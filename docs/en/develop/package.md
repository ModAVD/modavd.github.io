# Bundled scripts

**What you change**: the scripts that ship in the ModAVD package, in [`package/`](https://github.com/ModAVD/ModAVD/tree/main/package) of the ModAVD repository. From 0.38.2 only `modavd-bridge.ps1` is left, in the package's `tools\` folder. It is byte-identical to the file shipped in the package.

Fetching the components, collecting a problem report and copying the configuration info are no longer scripts. In packages 0.38.1 and earlier, the package root has three `.bat` files that call `fetch-components.ps1`, `collect-info.ps1` and `report-config.ps1` under `tools\`. From 0.38.2 none of these six files ship, and the three jobs are all in the manager and the CLI. To change them, send a PR to [ModAVDManager](https://github.com/ModAVD/ModAVDManager); see [Manager and CLI](./manager).

| File | What it does | In the package since |
| --- | --- | --- |
| `modavd-bridge.ps1` | Installs, removes or checks the arm64 execution bridge on an instance; see [Development: arm64 execution bridge](./bridge#installing-into-an-instance) | 0.36.0 |

What the three `.bat` files did is now done like this:

| Before | Now: the manager | Now: the CLI |
| --- | --- | --- |
| `补全组件.bat` (fetches the Google components) | **补全组件** under the **组件** item in **电脑检查** (Computer check) in the top bar, or on the banner of the home page when components are missing. Choose a download source and read Google's Android Software Development Kit License Agreement; after you agree, it downloads adb and the system image, checks the SHA-1 and installs them into `sdk\`. It can resume downloads | `tools\modavd.exe components fetch`; use `components source` to see and change the download source |
| `收集问题信息.bat` (collects a problem report) | **设置 → 组件与问题反馈 → 收集问题信息** (Settings → Components and feedback → Collect a problem report) makes the report; see [Reporting problems](../guide/feedback) | `tools\modavd.exe collect-info` |
| `复制配置信息.bat` (copies your system and game info) | **复制配置信息** in the same place puts the computer's configuration and the game packages installed in each instance into one block of text and copies it to the clipboard, to include in a new issue in [Issues](https://github.com/ModAVD/ModAVD/issues) | `tools\modavd.exe report-config` |

## Writing rules

- They must also run on the Windows PowerShell 5.1 that ships with Windows, because it is the default on users' machines:
  - save `.ps1` files as UTF-8 with BOM;
  - `.gitattributes` makes this directory store files as they are, with no line-ending conversion. When you send a PR, keep the file's original line endings and BOM: the bytes in the repository are the bytes in the release package.
- No hard-coded local paths. adb goes only through the private port in `mas-avd.json` in the ModAVD root folder and never touches 5037.
- Before restarting or shutting down, run `adb shell sync` first, then end the emulator.
## Hardware

To run it for real on an installed ModAVD, you need to start an instance:

| | Recommended | Minimum |
|---|---|---|
| CPU | 8 cores, 16 threads | 4 cores, 8 threads |
| RAM | 16 GB | 16 GB |
| Free disk space | 30 GB | 20 GB |

## Verification

Run `modavd-bridge.ps1` with PowerShell 5.1 on Windows 10 and 11, and under different system languages.

## Delivery

Open an issue to say so first, then send a PR. Once merged, it ships with the next Release, and the release notes will say so. The license is AGPL-3.0-or-later.

## Suggested models

Sonnet 5.5 or GPT-6.1 Sol; for mechanical checks such as line endings and encoding, Haiku 5.5 or GPT-6 Luna.
