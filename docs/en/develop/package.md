# Bundled scripts

**What you change**: the scripts that ship in the ModAVD package, in [`package/`](https://github.com/ModAVD/ModAVD/tree/main/package) of the ModAVD repository. The three `.bat` files go in the root of the package, and `modavd-bridge.ps1` and `components-sources.txt` in the package's `tools\` folder. They are byte-identical to the files shipped in the package.

The three `.bat` files only call the CLI in the package, `tools\modavd.exe`: how components are fetched, problem reports are collected and system info is copied is changed in [ModAVDManager](https://github.com/ModAVD/ModAVDManager), see [Manager and CLI](./manager). In 0.38.0 and earlier packages, three `.ps1` files under `tools\` did these jobs; later packages no longer have them.

| File | What it does | In the package since |
| --- | --- | --- |
| `补全组件.bat` (fetches the Google components) → `modavd components fetch` | On the first run it asks where to download from (the menu is `tools\components-sources.txt`; the choice is kept in `downloads\source.txt`). Then it shows Google's Android Software Development Kit License Agreement; after you agree, it downloads adb and the system image, checks the SHA-1 and installs them into `sdk\`. It can resume downloads | 37.2.10-mas30 |
| `收集问题信息.bat` (collects a problem report) → `modavd collect-info` | Makes a problem report on the desktop; see [Reporting problems](../guide/feedback) | 37.2.10-mas30 |
| `复制配置信息.bat` (copies your system and game info) → `modavd report-config` | Puts the computer's configuration and the game packages installed in each instance into one block of text and copies it to the clipboard, to include in a new issue in [Issues](https://github.com/ModAVD/ModAVD/issues) | 0.35.0 |
| `modavd-bridge.ps1` | Installs, removes or checks the arm64 execution bridge on an instance; see [Development: arm64 execution bridge](./bridge#installing-into-an-instance) | 0.36.0 |

## Writing rules

- They must also run on the Windows PowerShell 5.1 that ships with Windows, because it is the default on users' machines:
  - save `.ps1` files as UTF-8 with BOM;
  - use only ASCII in `.bat` files, with CRLF line endings; Chinese text for the user goes into a UTF-8 `.txt` file, shown under code page 65001 just for that and switched back before reading input;
  - `.gitattributes` makes this directory store files as they are, with no line-ending conversion. When you send a PR, keep the file's original line endings and BOM: the bytes in the repository are the bytes in the release package.
- No hard-coded local paths. adb goes only through the private port in `mas-avd.json` in the ModAVD root folder and never touches 5037.
- Before restarting or shutting down, run `adb shell sync` first, then end the emulator.
- Output that users paste into public issues must not contain user names, computer names, full paths or game accounts.

## Hardware

To run them for real on an installed ModAVD, you need to start an instance:

| | Recommended | Minimum |
|---|---|---|
| CPU | 8 cores, 16 threads | 4 cores, 8 threads |
| RAM | 16 GB | 16 GB |
| Free disk space | 30 GB | 20 GB |

## Verification

Run each script with PowerShell 5.1 on Windows 10 and 11, and under different system languages.

## Delivery

Open an issue to say so first, then send a PR. Once merged, it ships with the next Release, and the release notes will say so. The license is AGPL-3.0-or-later.

## Suggested models

Sonnet 5.5 or GPT-6.1 Sol; for mechanical checks such as line endings and encoding, Haiku 5.5 or GPT-6 Luna.
