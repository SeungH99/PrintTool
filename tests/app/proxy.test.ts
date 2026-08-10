import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '@/proxy';

describe('proxy security headers', () => {
  it('allows the Google ad traffic quality frame in the report-only CSP', () => {
    const response = proxy(new NextRequest('https://printreadyhq.com/ko'));
    const policy = response.headers.get('Content-Security-Policy-Report-Only');

    expect(policy).toContain(
      'frame-src https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net https://*.adtrafficquality.google',
    );
  });
});
