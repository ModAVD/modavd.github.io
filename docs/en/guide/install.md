# Install

This guide uses AUTO-MAS as the example. None of the steps needs administrator rights, except turning on the Windows feature.

## Check before you start

- Windows 10 / 11, 64-bit. The CPU is an Intel or AMD x86_64.
- The GPU supports Vulkan (a discrete GPU or a recent integrated GPU).
- AUTO-MAS: `v5.7.0` or newer is recommended. From v5.7.0-beta.5 it supports MAA and all MFW scripts. For earlier versions, see the Release notes.
- Find an NTFS drive with plenty of space:
  - Fetching the components needs about 6.5 GB free. Once installed, the components and the emulator itself take about 5 GB together.
  - On each instance's first boot, the drive it sits on needs more than 10 GB free.
  - After that the instance grows with game data, usually tens of GB per game. Deleting a game or files does not make the instance files smaller, but new writes reuse the freed space.

## 1. Download and extract

Download `ModAVD-<version>-win-x64.zip` from [Releases](https://github.com/ModAVD/ModAVD/releases) (the examples below use `0.36.0`).

The zip has no outer folder. Right-click it and choose Extract All, or in 7-Zip choose `Extract to ModAVD-0.36.0-win-x64\`, to get the `ModAVD-0.36.0-win-x64` folder. Do not choose `Extract Here`, or the files end up loose in the folder that holds the zip.

Put it at a path that contains **only English letters and digits**. You can rename it, for example `D:\ModAVD`.

- With Chinese characters in the path the emulator cannot start, and **补全组件** (Fetch components) refuses to run.
- Do not put it in a directory that needs administrator rights, such as `C:\Program Files`.
- All instance data from now on is stored in the `avd\` folder here, so pick a drive with plenty of space.

The extracted folder contains:

| Path | Contents |
|---|---|
| `sdk\emulator\` | The emulator itself; `resources\modavd\` holds the arm64 execution bridge |
| `ModAVD.exe` | The manager (from 0.36.0). Fetching the components, collecting a problem report and copying the configuration info are done here too |
| `tools\` | The CLI `modavd.exe`, and `modavd-bridge.ps1` for installing the bridge (from 0.36.0) |
| `components\` | The package of µLauncher, a lightweight home screen; from 0.36.0 also the host IME `modavd-ime.apk` |
| `说明.txt` | A short readme |
| `LICENSES\` | Licenses and third-party component notices |
| `modavd-manifest.json` | The size and SHA-256 of every file in the package |

Packages 0.38.1 and earlier also have `补全组件.bat`, `收集问题信息.bat` and `复制配置信息.bat` in the root, and the PowerShell scripts they call in `tools\`. From 0.38.2 none of them exist; the three jobs are done in the manager or on the command line.

## 2. Fetch the Google components

adb and the system image are downloaded on your computer from the official channels. There are two ways, and both download the same things:

- **In the manager**: double-click `ModAVD.exe`. When components are missing, the home page shows a banner with a **补全组件** (Fetch components) button. You can also click **电脑检查** (Computer check) in the top bar and click **补全组件** under the **组件** (Components) item that did not pass.
- **On the command line**: type `cmd` in the folder's address bar, press Enter, and run `tools\modavd.exe components fetch`.

In packages 0.38.1 and earlier this was `补全组件.bat` in the package root. From 0.38.2 that file is gone.

The steps below are the same for both ways. Only the interface differs.

1. Choose the download source: automatic (tries googledownloads_cn → tencent → google in order), only one of them, or a custom address.
   - In the manager, choose it in the dialog. The choice is saved when you click **同意并下载** (Agree and download).
   - On the command line: if no source has been saved yet and you run it in a console, it asks once with a numbered list; press Enter for automatic. It does not ask when its input or output is a pipe or a file, or with `--json` or `--accept-license`.
   - Once saved, the choice is reused and not asked again. To change it, choose **组件下载源** (Component download source) in **设置** (Settings) in the manager, next to the update source (it saves as soon as you choose), or run `tools\modavd.exe components source [auto|googledownloads_cn|tencent|google]`. Without an argument it shows the current one.
2. It gets the full text of Google's Android Software Development Kit License Agreement from the chosen source and shows it. It also saves a copy to `downloads\android-sdk-license.txt`.
   - Manager: the full text is shown in the dialog. After reading it, click **同意并下载** (Agree and download). If you click **不同意** (Disagree) or close the dialog, nothing is downloaded.
   - Command line: type `y` and press Enter to agree. If you just press Enter or type anything else, it exits without downloading anything.
3. After you agree, it downloads two things and installs them into `sdk\`:
   - Platform tools (adb) 37.0.1, about 8 MB;
   - System image Android 14 (API 34) Google APIs x86_64 r14, about 1.5 GB, about 4.2 GB after extraction.
4. With the automatic choice it tries the mirrors in order: googledownloads.cn → Tencent Cloud mirror → dl.google.com. If one is unreachable or fails the check, it moves on to the next.
5. After each file is downloaded, it checks the size and SHA-1 and extracts the file only if they match. If the download is interrupted, click **补全组件** again or run the command again and it resumes.
6. Done. In the manager, the item shows the progress (bytes downloaded, percentage, speed, time left) and a **取消** (Cancel) button while it runs, and the check runs again by itself when it finishes. The command line prints 完成，可以在 AUTO-MAS 里添加这个文件夹了。 (Done. You can now add this folder in AUTO-MAS.)

Components that are already installed are skipped, so running it again has no side effects. The process is logged in `logs\fetch-components.log`.

### If fetching the components fails

In the manager, a failure shows the reason under the item, and the button becomes **重试** (Retry). The command line prints the same reason.

| Message | What to do |
|---|---|
| 路径里有中文或其他非英文字符 (the path contains Chinese or other non-English characters) | Move the whole folder to a path with English characters only, then run it again |
| 这里没有 sdk\emulator\emulator.exe (there is no sdk\emulator\emulator.exe here) | The Release zip was not fully extracted. Extract it again and run it in the extracted folder |
| 磁盘空间不够 (not enough disk space) | Use a drive with more space |
| 取不到许可协议全文 / 所有镜像都没下成 (cannot get the license text / no mirror worked) | Check your network and try again. The parts already downloaded are kept. You can also choose another download source |
| 下载源这次给的许可协议和你在管理器里同意的那份不一样 (the source gave a license text different from the one you agreed to in the manager) | Nothing was downloaded. Click **补全组件** again, read the current text and agree again |
| 解压后的关键文件或版本校验失败 (the key files or version check failed after extraction) for the system image, with a 0.37.0–0.38.0 package | `补全组件.bat` in these versions has a bug and always fails on the system image. Type `cmd` in the folder's address bar and press Enter, run `tools\modavd.exe components fetch`, and type `y` after reading the license agreement; the zip already downloaded is used as it is |

If downloads are too slow or keep failing, you can download the two files below by hand with a browser or a download tool, put them in the folder's `downloads\` **without renaming them**, and click **补全组件** again (or run `tools\modavd.exe components fetch`). It still needs the network once to get the license text. It then checks the two files and uses them if they pass. After installing, it deletes these two zip files from `downloads\`.

| File | URL | SHA-1 |
|---|---|---|
| `platform-tools_r37.0.1-win.zip` | `https://dl.google.com/android/repository/platform-tools_r37.0.1-win.zip` | `e03e78b1d80b396f1c3358e31251cb31740e1110` |
| `x86_64-34_r14.zip` | `https://dl.google.com/android/repository/sys-img/google_apis/x86_64-34_r14.zip` | `e0f6c9a0691aa27bd597d0deb1bcfdc943ac8ca7` |

If you replace `dl.google.com/android/repository/` with `googledownloads.cn/android/repository/`, you get the same files.

## 3. Turn on virtualization

The emulator needs Windows Hypervisor Platform:

1. Press Win+R, type `optionalfeatures` and press Enter to open Turn Windows features on or off.
2. Check Windows Hypervisor Platform and click OK.
3. Restart the computer.

If it still does not work, CPU virtualization is most likely turned off in the BIOS. Enter the BIOS and turn on Intel VT-x or AMD SVM. See your motherboard manual for where to find it.

## 4. Add it in AUTO-MAS

1. Open **模拟器管理** (Emulator Management).
2. If you have no emulator configuration yet, click **手动添加模拟器** (Add emulator manually) and set the emulator type to **自动识别（推荐）** (Auto-detect (recommended)). If you already have such a configuration, use it.
3. In that configuration click **管理模拟器** (Manage emulators) → **添加魔改 AVD（内测）** (Add ModAVD (beta)), choose the folder you extracted in step 1, and click **检查** (Check).
4. When all the computer checks pass, click **添加** (Add). The first instance is created automatically after it is added.

If an item under **检查** (Check) does not pass, follow the hint. If virtualization does not pass, see the previous section.

::: tip Without AUTO-MAS
Double-click `ModAVD.exe` in the package root to open the manager, where you can create instances, start and stop them, and watch the screen. For how to use the CLI `tools\modavd.exe`, see [The manager and the CLI](../components/manager).
:::

## 5. First use

Every new instance must be started by hand once, to install the game and log in:

1. In the device list, click the start button of the instance. A manual start shows the emulator window.
2. In the window, swipe up from the bottom to open the app list, use Chrome to download the game's Android installer from its official website, and install it. If the system says installing unknown apps is not allowed, follow the prompt to allow Chrome to install apps.
3. Open the game, log in and download the first-run resources, then shut down the instance in AUTO-MAS.

To go back to the home screen, use the ○ button on the window's side toolbar. Swiping up from the bottom edge of the screen does not take you home.

After that, when a task starts the instance, whether it has a window follows the **静默模式** (Silent mode) setting in AUTO-MAS. For how to work with scripts such as MAA and M9A, follow the AUTO-MAS documentation.

## Uninstall

First remove this emulator under **管理模拟器** (Manage emulators) in AUTO-MAS, then delete the whole folder. Crash dumps (if any) are in `%TEMP%\AndroidEmulator\emu-crash-37.2.10-mas.db\` and can be deleted along with it. Entries in the same directory without `-mas` in their names belong to the official emulator, not to this project.
