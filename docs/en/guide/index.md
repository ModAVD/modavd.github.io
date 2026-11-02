# What is ModAVD

ModAVD is an Android emulator based on the AOSP Android Emulator 37.2.10, built by the project with a batch of patches added. It supports Windows today, and more platforms are planned (see [#27](https://github.com/ModAVD/ModAVD/issues/27)).

The package includes a manager, `ModAVD.exe`, and a CLI, `tools\modavd.exe`, for creating instances and starting and stopping them. Automation tools such as [AUTO-MAS](https://github.com/AUTO-MAS-Project/AUTO-MAS) can also drive it and take care of instance orchestration and task flows.

- An Android emulator that runs on Windows today and uses the Windows Hypervisor Platform (WHPX) for hardware acceleration. More platforms are planned.
- It can run with a window as an ordinary emulator, or without one (headless). The manager, the CLI or a script starts it and shuts it down when done.
- The emulator itself comes from Google's open-source [Android Emulator](https://android.googlesource.com/platform/external/qemu/). We changed QEMU, gfxstream (graphics streaming) and Crashpad (crash handling) in it, and the changes are published as patches.
- adb and the Android system images belong to Google and are covered by the Android Software Development Kit License Agreement. We cannot distribute them, so they are not in the Release. `补全组件.bat` (fetches the Google components) in the package downloads them from the official channels on your computer.

For the differences from the official emulator, item by item, see [How ModAVD differs from the official emulator](./changes).

## What is in the package

A Release package is made of several parts, each developed in its own repository:

| Part | Location in the package | Repository |
|---|---|---|
| The emulator itself (the patched AOSP Emulator) | `sdk\emulator\` | `patches/` in [ModAVD](https://github.com/ModAVD/ModAVD) |
| The arm64 execution bridge | `sdk\emulator\resources\modavd\` | `bridge/` in ModAVD |
| Bundled scripts (fetch the Google components, collect a problem report, copy system and game info, install the bridge) | the `.bat` files in the package root, `tools\*.ps1` | `package/` in ModAVD |
| The manager and the CLI | `ModAVD.exe`, `tools\modavd.exe` | [ModAVDManager](https://github.com/ModAVD/ModAVDManager) |
| The host IME | `components\modavd-ime.apk` | [ModAVDHostIME](https://github.com/ModAVD/ModAVDHostIME) |

- The manager and the host IME have their own version numbers and are released separately from their own repositories. A ModAVD package release includes the versions that are current at the time.
- For everyday use, the full package is all you need. MirrorChyan also updates only the full ModAVD package.

## Requirements

| Item | Requirement |
|---|---|
| System | Windows 10 / 11, 64-bit |
| CPU | x86_64 (Intel / AMD), with virtualization turned on in the BIOS (Intel VT-x / AMD SVM) |
| Windows feature | Windows Hypervisor Platform (WHPX) |
| GPU | A discrete GPU or a recent integrated GPU with Vulkan support |
| Memory | AUTO-MAS gives each instance 6 GB by default, and the PC needs about 1.5 GB more free when an instance boots |
| Disk | Put it on an NTFS drive. Fetching the components needs about 6.5 GB free. Each instance needs more than 10 GB free on its first boot, then grows with game data, usually tens of GB per game |
| Path | A path with only English letters and digits, for example `D:\ModAVD` |
| AUTO-MAS | `v5.7.0` or newer is recommended. From v5.7.0-beta.5, MAA and MFW scripts (MaaFramework projects, such as M9A) work; other scripts are not supported yet. The Release notes list what each version supports |

## Disclaimer

- Android is a trademark of Google LLC.
- The software is provided "as is", without warranty of any kind. See each license for details.
- Whether running a game with an emulator and scripts complies with the game's user agreement is for you to judge.
