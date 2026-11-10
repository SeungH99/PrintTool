# Third-party notices

This file identifies vendored third-party assets and their own license terms.
PrintReady has not selected a repository-wide open-source license for its own
source code. The component licenses below remain applicable to their respective
files; this notice does not relicense PrintReady's source code.

## LittleCMS WebAssembly and JavaScript wrapper

Files: `public/lcms/lcms.wasm` and `public/lcms/lcms.js`.

- Package: `lcms-wasm` 1.0.5, MIT license.
- Wrapper copyright: Matt DesLauriers, 2024. The JavaScript wrapper also retains
  its original yoya attribution in its header.
- Package source revision: `762214c66e907674c8a5538223c624291f5039dd`.
- Source: https://github.com/mattdesl/lcms-wasm/tree/762214c66e907674c8a5538223c624291f5039dd
- Full wrapper license: [public/lcms/LICENSE-lcms-wasm.txt](public/lcms/LICENSE-lcms-wasm.txt).
- The bundled `.wasm` is byte-identical to `lcms-wasm` 1.0.5's `dist/lcms.wasm`.
  The JavaScript wrapper has local differences from that package's `dist/lcms.js`;
  it is not represented here as an unmodified copy.

The underlying LittleCMS library is MIT-licensed, copyright Marti Maria Saguer.
The package's pinned LittleCMS submodule revision is `c2a54017d73080f97c5cd34a78ff2fb51564aade`:
https://github.com/mm2/Little-CMS/tree/c2a54017d73080f97c5cd34a78ff2fb51564aade.
Its full license is preserved in
[public/lcms/LICENSE-LittleCMS.txt](public/lcms/LICENSE-LittleCMS.txt).

## Artifex CMYK ICC profile

File: `public/profiles/default_cmyk.icc`.

- Embedded description: Artifex CMYK SWOP Profile.
- Embedded copyright: Artifex Software, 2011.
- Upstream license: AGPL-3.0-or-later, as stated by Ghostscript's notice for
  the `iccprofiles` directory.
- Source revision: `4810e79ad4ade8708db8f2634c05e95b7e0d00e8`.
- Original file: https://raw.githubusercontent.com/ArtifexSoftware/ghostpdl/4810e79ad4ade8708db8f2634c05e95b7e0d00e8/iccprofiles/default_cmyk.icc
- SHA-256: `8472fa1493a024b800b67dee9424835ec0c41ab79490200ae8ec4a689fd1b9a9`.
- Changes to the profile: none.

The profile is retained as a separate ICC data file and loaded by LittleCMS;
the Ghostscript interpreter is not bundled. Source, full license text and the
upstream scope notice are available in
[public/profiles/README.md](public/profiles/README.md),
[LICENSE-AGPL-3.0-or-later.txt](public/profiles/LICENSE-AGPL-3.0-or-later.txt), and
[GHOSTSCRIPT-LICENSE.txt](public/profiles/GHOSTSCRIPT-LICENSE.txt).
This identifies the ICC component's license without assigning an open-source
license to PrintReady's own code or limiting the ICC recipient's licensed rights.

## Other dependencies

The packages listed in `package.json` and `package-lock.json` retain their own
licenses and notices. This file covers the vendored assets above; it is not a
replacement for those dependency licenses.
