# Bundled scripts

**What you change**: the scripts that ship in the ModAVD package, in [`package/`](https://github.com/ModAVD/ModAVD/tree/main/package) of the ModAVD repository. The three `.bat` files go in the root of the package and the four `.ps1` files in the package's `tools\` folder. They are byte-identical to the files shipped in the package.

| File | What it does | In the package since |
| --- | --- | --- |
| `补全组件.bat` (fetches the Google components) → `fetch-components.ps1` | First shows Google's Android Software Development Kit License Agreement. After you agree, it downloads adb and the system image from the official channels, checks the SHA-1 and installs them into `sdk\`. It can resume downloads and falls back to the next mirror in order | 37.2.10-mas30 |
| `收集问题信息.bat` (collects a problem report) → `collect-info.ps1` | Makes a problem report on the desktop; see [Reporting problems](../guide/feedback) | 37.2.10-mas30 |
| `复制配置信息.bat` (copies your system and game info) → `report-config.ps1` | Puts the computer's configuration and the game packages installed in each instance into one block of text and copies it to the clipboard, to paste into the compatibility report issue | 0.35.0 |
| `modavd-bridge.ps1` | Installs, removes or checks the arm64 execution bridge on an instance; see [Development: arm64 execution bridge](./bridge#installing-into-an-instance) | 0.36.0 |

## Writing rules

- They must also run on the Windows PowerShell 5.1 that ships with Windows, because it is the default on users' machines:
  - save `.ps1` files as UTF-8 with BOM;
  - use only ASCII in `.bat` files, with CRLF line endings;
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
