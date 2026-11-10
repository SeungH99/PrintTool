# Bundled CMYK ICC profile

`default_cmyk.icc` is an unmodified ICC color-profile data file from Artifex
Ghostscript. Its embedded description is **Artifex CMYK SWOP Profile** and its
embedded copyright notice is **Copyright Artifex Software 2011**.

- Source repository: https://github.com/ArtifexSoftware/ghostpdl
- Pinned source revision: `4810e79ad4ade8708db8f2634c05e95b7e0d00e8`
- Original file: https://raw.githubusercontent.com/ArtifexSoftware/ghostpdl/4810e79ad4ade8708db8f2634c05e95b7e0d00e8/iccprofiles/default_cmyk.icc
- SHA-256: `8472fa1493a024b800b67dee9424835ec0c41ab79490200ae8ec4a689fd1b9a9`
- Changes to the ICC file: none; the bundled bytes match the pinned source.

## License for this ICC file

The upstream Ghostscript `LICENSE` includes the `iccprofiles` directory under
**GNU Affero General Public License, version 3 or any later version**.
The complete upstream notice is preserved in [GHOSTSCRIPT-LICENSE.txt](GHOSTSCRIPT-LICENSE.txt)
and the complete license text in [LICENSE-AGPL-3.0-or-later.txt](LICENSE-AGPL-3.0-or-later.txt).
The original machine-readable ICC file is included here, and the pinned source
link above identifies the corresponding upstream file.

PrintReady fetches this separate ICC file in `src/lib/color/loadEngine.ts` and
passes the profile bytes to LittleCMS for color conversion. No Ghostscript
interpreter or executable is bundled. These notices describe this third-party
profile; they do not grant a license for PrintReady's own source code or restrict
the rights granted by the profile's license.
