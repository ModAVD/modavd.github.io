# Privacy

Here "the emulator" means the program under `sdk\emulator\` in the Release package, which runs on your Windows. The Android system and the apps in it are a separate matter; see below.

## The emulator does not contact Google in the background

The official Android Emulator contacts Google's servers in the background. ModAVD removes all of that:

| Behavior of the official build | ModAVD |
|---|---|
| With `-metrics-collection`, it uploads usage statistics (including an installation ID, the system version and the usage events of the session) to `play.googleapis.com` | Not uploaded. `-metrics-collection` is treated as `-no-metrics` |
| On a crash, it uploads the crash dump to `clients2.google.com` according to the settings, and in windowed mode may pop up a question | Not uploaded, nothing asked. The dump stays on this machine |
| At every boot (once per 4 hours for the same version), it contacts `dl.google.com` with the installation ID, the system and the version to check for updates | No check. The boot log has a line `Update check skipped: this build never checks for updates; upgrades come from whoever distributed it.` |
| Every 24 hours, it downloads feature flags from `dl.google.com` | Not downloaded. It uses the local cache or the copy shipped in the package. The boot log has a line `Feature patterns are not downloaded: this build never fetches them and keeps using the cached or shipped ones.` |

In testing we checked this with three methods at the same time: the emulator's libcurl verbose log (every HTTP request on the host side is recorded), a once-per-second pass over the process connection table, and the Windows DNS cache. Through boot, stress tests, clean shutdown and deliberate crashes, `emulator.exe`, the code of `qemu-system` itself and `crashpad_handler.exe` made no outside connections.

The matching changes are the patches in `patches/qemu/fixq30/` of the ModAVD repository whose titles start with `MAS local` and that cover crash reports, usage statistics, the update check and feature flags (0036, 0038, 0039, 0045–0049).

**Exceptions**:

- In windowed mode, if you open the Location page in the extended controls window, it fetches a map key from `dl.google.com` and loads Google Maps. If you do not open this page, nothing is contacted, and headless runs do not have this page. The default slim toolbar has no button for opening the extended controls.
- The Street View feature of the virtual scene camera only turns on when you set an environment variable, and it is off by default. The Release package also does not include the virtual scene resource files.
- The links on the Help, Feedback and similar pages in the extended controls open in a browser only when you click them.

The `-metrics-to-file` and `-metrics-to-console` options still work. They write the statistics to a local file or the console only when you give them explicitly.

## Android and its apps use the network as usual

The Android system, games, and the Google Play services that come with the Google APIs system image all go online as usual through the emulator's virtual network. That is their own traffic, just like on a phone. The emulator neither blocks nor changes it.

## Crash dumps stay on this machine

- Location: `%TEMP%\AndroidEmulator\emu-crash-37.2.10-mas.db\`. You can move it elsewhere with the environment variable `ANDROID_EMU_CRASH_REPORTING_DATABASE`.
- The latest 5 are kept, and older ones are deleted automatically at boot. The number can be changed with `ANDROID_EMU_CRASH_REPORTS_TO_KEEP` (1 to 100).
- Contents: the thread stacks of the emulator process, a few memory fragments and local paths (the paths contain the Windows user name). It does not contain the full memory of the Android system, and it does not deliberately collect account passwords.
- If you do not want to keep them: adding `-crash-report-mode disabled` to the boot arguments turns crash recording off completely. To remove existing dumps, just delete the folder above.

## Bundled scripts and programs

- **`补全组件.bat`** (fetches the Google components): connects to the network only when you run it. It contacts the download source you chose (automatic: googledownloads.cn, mirrors.cloud.tencent.com and dl.google.com in turn), to download the license agreement list, adb and the system image. The requests carry only ordinary download information (the user agent is `ModAVDManager/<version>`; `ModAVD-fetch-components/1.0` in packages 0.38.0 and earlier) and no identifier. The process is logged in `logs\fetch-components.log` in the folder.
- **`收集问题信息.bat`** (collects a problem report): only reads files and packs them on this machine. It does not connect to the network and does not upload anything. It reads the emulator and AUTO-MAS logs and the crash dumps, and takes a screenshot of a running instance. It does not touch the instances' disk images, or the `config` and `data` folders where AUTO-MAS stores account passwords. Whether to send the zip is up to you. Do not upload crash dumps publicly; if you want to send them, send them by email, see [Report a problem](./feedback).
- **The manager `ModAVD.exe`**: starts a local server that listens only on 127.0.0.1. The pages are embedded in the program, and it does not connect to the network.
- **The host IME**: requests no permissions, stores no data, and does not log the text typed.

## This project collects no data

ModAVD has no server and no statistics of any kind. All we can see is what you post yourself in Issues and the problem reports you send to the feedback email.

This site is a set of static pages on GitHub Pages. It has no analytics scripts and loads no fonts from other sites. GitHub keeps its own access logs; see GitHub's privacy statement.
