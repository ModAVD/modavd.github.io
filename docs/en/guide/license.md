# Licenses and source code

## What is in the ModAVD repository

- **Everything except `package/`, `bridge/`, `assets/` and the `.patch` files under `patches/`** (the README and other documents, `docs/`, `scripts/`, `.github/` and so on): Apache License 2.0, see [LICENSE](https://github.com/ModAVD/ModAVD/blob/main/LICENSE) in the repository root. Copyright 2026 qiyinxi.
- `package/` and `bridge/` are under AGPL-3.0-or-later (see the next section).
- Patches follow the license of the file each one changes (see the Patches section).
- The images and program icons under `assets/` are covered in [Icon and artwork](#icon-and-artwork).

The documents on this site are also published under the Apache License 2.0.

## ModAVD's own programs

From 0.36.0 all of them are under the GNU Affero General Public License version 3 or later (AGPL-3.0-or-later):

| Program | Source |
|---|---|
| The scripts in the package (`tools\modavd-bridge.ps1`, which installs the bridge; 0.38.1 and earlier also have three `.bat` and three `.ps1` files for fetching the Google components, collecting a problem report and copying system and game info) | [`package/`](https://github.com/ModAVD/ModAVD/tree/main/package) in the ModAVD repository. The scripts in packages from 0.35.0 and earlier are published under the Apache License 2.0 |
| The arm64 execution bridge (`sdk\emulator\resources\modavd\`) | [`bridge/`](https://github.com/ModAVD/ModAVD/tree/main/bridge) in the ModAVD repository, and also in the source bundle of the same Release |
| The manager `ModAVD.exe` and the CLI `tools\modavd.exe` | [ModAVD/ModAVDManager](https://github.com/ModAVD/ModAVDManager) |
| The host IME `components\modavd-ime.apk` | [ModAVD/ModAVDHostIME](https://github.com/ModAVD/ModAVDHostIME) |

If you distribute these programs (modified or not), or put a modified version online for others to use, you must provide the corresponding source under the same license. Other programs that only call the local interface of `modavd.exe`, the MCP server or the manager are not affected.

## Patches

Each patch is published under the license of the file it changes, consistent with the upstream file header:

- In the QEMU repository (`platform/external/qemu`), patches to QEMU's own files, and to files with a GPL-2.0 header, are under GPL-2.0. Patches to files with an Apache-2.0 header (some of those under `android/` and `android-qemu2-glue/`) are under the Apache License 2.0. The license of each patch is listed in [patches/BASE.md](https://github.com/ModAVD/ModAVD/blob/main/patches/BASE.md).
- The gfxstream and Crashpad patches are published under the Apache License 2.0, the same as those projects themselves.

## Programs in the Release

They contain third-party components such as QEMU (GPL-2.0), FFmpeg (GPL-2.0 or later, statically linked), Qt 6.5.3 (LGPL-3.0), and GLib and libusb (LGPL-2.1). Programs such as `qemu-system` as a whole are published under GPL-2.0. The license of each component is in `LICENSES\NOTICE.txt` in the package, and a summary is in [THIRD_PARTY.md](https://github.com/ModAVD/ModAVD/blob/main/THIRD_PARTY.md).

## Source code

The source bundle of the same Release (`ModAVD-<version>-sources.zip`) holds the complete corresponding source:

- the exact versions, at build time, of the 24 repositories compiled into the programs, one `.tar.xz` per repository, with the build scripts in the QEMU repository;
- the source packages of FFmpeg / libvpx / libxml2 / pixman, the SeaBIOS and iPXE source, and the Qt 6.5.3 source;
- the GLib 2.82.2 that `netsimd.exe` statically links, with its build modules, and the netsim source;
- two repository lists (also in [`manifests/`](https://github.com/ModAVD/ModAVD/tree/main/manifests) in the ModAVD repository);
- from 0.36.0 also `modavd-src-<commit>.tar.xz`, the source of ModAVD's own programs (the manager and CLI, the arm64 execution bridge, the host IME), published under AGPL-3.0-or-later, with `LICENSE` and `NOTICE` inside the archive;
- `SOURCES.txt`, which describes these files one by one.

The patches are in [`patches/`](https://github.com/ModAVD/ModAVD/tree/main/patches) in the ModAVD repository. To build it yourself, see [Building from source](../develop/build).

## Google components

adb and the system images are not in the Release. **补全组件** (Fetch components) in the manager, or `tools\modavd.exe components fetch`, downloads them from the official channels. They are covered by the Android Software Development Kit License Agreement, which you must accept before downloading.

## Icon and artwork

- The images under `assets/` in the ModAVD repository (banner, avatar, social preview image), and the icons compiled into the programs (the program icons and window icons of `emulator.exe`, `emulator-check.exe`, `qemu-system-x86_64*.exe` and `ModAVD.exe`, and the images in the manager's pages), are ModAVD's own icon and artwork and **are not covered by the grant of any code or document license**.
- If you have a copyright concern, please contact us through [Issues](https://github.com/ModAVD/ModAVD/issues) or by email at qiyinxi@foxmail.com, and we will deal with it immediately.
