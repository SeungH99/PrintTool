import assert from 'node:assert/strict';
import { spawn, execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const cliRoot = path.join(root, 'node_modules/@opennextjs/cloudflare');
const cliPackage = JSON.parse(await readFile(path.join(cliRoot, 'package.json'), 'utf8'));
const cliBin =
  typeof cliPackage.bin === 'string' ? cliPackage.bin : cliPackage.bin?.['opennextjs-cloudflare'];
assert.ok(cliBin, 'The installed OpenNext package must expose its CLI.');

// Pick an unused loopback port instead of reusing another local development server.
const port = await new Promise((resolve, reject) => {
  const probe = createServer();
  probe.once('error', reject);
  probe.listen(0, '127.0.0.1', () => {
    const address = probe.address();
    assert.ok(address && typeof address === 'object');
    probe.close((error) => (error ? reject(error) : resolve(address.port)));
  });
});
const base = `http://127.0.0.1:${port}`;
const worker = spawn(process.execPath, [path.join(cliRoot, cliBin), 'preview', '--port', String(port)], {
  cwd: root,
  detached: process.platform !== 'win32',
  env: { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false' },
  stdio: ['ignore', 'pipe', 'pipe'],
});

let recentOutput = '';
let exitInfo;
let startupError;
const capture = (chunk) => {
  recentOutput = (recentOutput + chunk.toString()).slice(-12000);
};
worker.stdout.on('data', capture);
worker.stderr.on('data', capture);
worker.once('exit', (code, signal) => {
  exitInfo = { code, signal };
});
worker.once('error', (error) => {
  startupError = error;
});

async function request(route) {
  return fetch(`${base}${route}`, { redirect: 'manual', signal: AbortSignal.timeout(5000) });
}

async function waitForWorker() {
  const deadline = Date.now() + 120000;
  while (Date.now() < deadline) {
    if (startupError) throw startupError;
    if (exitInfo) throw new Error(`Worker preview exited before readiness: ${JSON.stringify(exitInfo)}`);
    try {
      const response = await request('/ko/pdf');
      await response.body?.cancel();
      if (response.status === 200) return;
    } catch {
      // Startup can take several seconds while OpenNext prepares the local cache.
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error('Worker preview did not become ready within 120 seconds.');
}

async function stopWorker() {
  if (exitInfo || !worker.pid) return;
  if (process.platform === 'win32') {
    await new Promise((resolve) => {
      execFile('taskkill', ['/PID', String(worker.pid), '/T', '/F'], () => resolve());
    });
    return;
  }
  // Stop the preview process group, including the Wrangler/workerd children we started.
  try {
    process.kill(-worker.pid, 'SIGTERM');
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }
  await Promise.race([
    new Promise((resolve) => worker.once('exit', resolve)),
    new Promise((resolve) => setTimeout(resolve, 3000)),
  ]);
  if (!exitInfo) {
    try {
      process.kill(-worker.pid, 'SIGKILL');
    } catch (error) {
      if (error.code !== 'ESRCH') throw error;
    }
  }
}

try {
  await waitForWorker();
  for (const route of ['/ko/pdf', '/en/color']) {
    const response = await request(route);
    assert.equal(response.status, 200, `${route} must be served by the Worker.`);
    assert.match(response.headers.get('content-type') ?? '', /text\/html/i);
    assert.match(await response.text(), /<html[\s>]/i);
  }

  for (const asset of ['lcms/lcms.js', 'lcms/lcms.wasm', 'profiles/default_cmyk.icc']) {
    const response = await request(`/${asset}`);
    assert.equal(response.status, 200, `${asset} must be served without a locale redirect.`);
    const bytes = Buffer.from(await response.arrayBuffer());
    const expected = await readFile(path.join(root, 'public', asset));
    assert.equal(
      createHash('sha256').update(bytes).digest('hex'),
      createHash('sha256').update(expected).digest('hex'),
      `${asset} must retain the exact public asset bytes.`,
    );
  }
  console.log('Cloudflare Worker smoke passed: 2 localized routes and 3 exact static assets.');
} catch (error) {
  console.error(recentOutput);
  throw error;
} finally {
  await stopWorker();
}
