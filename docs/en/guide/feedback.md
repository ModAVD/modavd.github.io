# Report a problem

Open an issue in the [Issues](https://github.com/ModAVD/ModAVD/issues) of the ModAVD repository. Before you do, search for whether someone has already reported the same problem.

- For problems with AUTO-MAS's interface, tasks or scheduling, please go to [AUTO-MAS](https://github.com/AUTO-MAS-Project/AUTO-MAS/issues).
- Do not post security problems publicly. Send an email to qiyinxi@foxmail.com.

## 1. Collect a problem report

1. **Do not shut down the emulator after something goes wrong.** If the instance is still running, the collection also records the screen and state at that moment.
2. Double-click `收集问题信息.bat` (collects a problem report) in the folder. After about a minute, a `魔改AVD问题信息-<time>.zip` (the name means "ModAVD problem info") appears on the desktop and is selected in File Explorer automatically.

This script only reads and does not write: it does not shut down or restart anything, and it uploads nothing. It collects:

| Content | Description |
|---|---|
| `summary.txt` | The versions of the emulator, adb and the system image; the folder path and the free space on its drive; Windows, CPU, memory, GPU model and driver version; the state of the virtualization-related Windows features; the result of `emulator -accel-check`; the name of the antivirus software; the running emulator processes and their command lines |
| `avd\` | The config files of each instance (`config.ini` and so on), and a list of the file names and sizes in each instance folder |
| `logs\` | Emulator logs and Android logs (logcat), the latest 8 for each instance; the log from fetching the components |
| `crash\` | Emulator crash dumps from the last 7 days, at most 3 |
| `mas\` | The logs in AUTO-MAS's `debug` folder |
| `live\` | A running instance: a screenshot, the system properties (getprop), the current window, and the Android crash log |

It does **not** take: the instances' disk images (all the game data is in them), and AUTO-MAS's `config` and `data` folders (they hold encrypted account passwords).

## 2. What to post publicly and what to send privately

::: warning Issues are public
Anyone can download the attachments. Open the zip and look through it before you upload it.
:::

| Content | How to share it |
|---|---|
| `summary.txt`, `avd\`, `logs\`, `mas-avd.json` | Can be posted in a public issue. The paths in them may contain your Windows user name. If you mind, change it first (replace `C:\Users\<your user name>` with `%USERPROFILE%`) |
| `live\` (screenshot, system properties, current window, Android crash log), `mas\` (AUTO-MAS logs) | Can be posted, but take a look first: the screenshot may show a game nickname or account information, and the AUTO-MAS logs may contain the user name you entered in AUTO-MAS. Delete or blur what you do not want public, or send it privately instead |
| `crash\` (crash dumps) | **Do not upload it publicly.** It contains the thread stacks of the emulator process, a few memory fragments and local paths (the paths contain the Windows user name). It does not contain the full memory of the Android system, and it does not deliberately collect account passwords |

What to do:

1. In the issue, post the part without `crash\` (delete the `crash` folder from the zip before uploading, or post only the content of `summary.txt`), and write "there is a crash dump, sent by email".
2. Email the **complete problem report** (with `crash\`) to **qiyinxi@foxmail.com**, and put the issue number in the subject or the body. If the attachment is too large to send, say so in the issue.

## 3. Describe it clearly

- Roughly when it happened, and what task you were running (which script, which game);
- what you saw, with a screenshot if you have one;
- whether it can be reproduced, and how;
- the emulator version (`Pkg.BuildId` in `sdk\emulator\source.properties`) and the AUTO-MAS version. The problem report's `summary.txt` already has both.

When `补全组件.bat` (fetches the Google components) fails, attaching `logs\fetch-components.log` is enough. It only records the download process (which mirror, which address, at which step it failed) and the folder path.

## Tell us when it works, too

If a round of daily tasks runs through on your computer, double-click `复制配置信息.bat` (copies your system and game info), paste the output into the pinned "兼容性报告" (compatibility report) issue in Issues, fill in the last three lines, and add a sentence saying whether it works. This output has no user name, computer name, full paths or game accounts, so you can post it publicly as it is. See [Testing on real games and compatibility reports](../develop/testing).
