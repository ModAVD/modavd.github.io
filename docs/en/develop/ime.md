# The host IME

**What you change**: the [ModAVDHostIME](https://github.com/ModAVD/ModAVDHostIME) repository. It holds the headless input method in the guest, `org.modavd.ime`, which receives text typed with the Windows IME through the emulator's `modavd_ime` channel. It also holds the test APK and the channel protocol description `docs/protocol-v1.md`.

For the directory layout, the key points of the protocol and how to use the test APK, see the repository's [README](https://github.com/ModAVD/ModAVDHostIME/blob/main/README.en.md).

## Environment

- JDK: Temurin 25.0.4.1+1 (`javac --release 17`);
- Android SDK: build-tools 36.1.0 and platforms android-36 (revision 2), using aapt, aapt2, d8, zipalign and apksigner; point `ANDROID_HOME` at it;
- No Gradle. `build.ps1` runs only on Windows; the protocol self-test needs only javac and works on any system;
- To build an unsigned APK that is byte-identical to the released one, set the time zone to Central European Time (`TZ=CET-1`) when building.

## Hardware

- Building only: the JDK and the two Android SDK components take about 1 GB together; 4 cores and 8 GB of RAM are enough;
- Verification needs one instance with no games installed:

| | Recommended | Minimum |
|---|---|---|
| CPU | 8 cores, 16 threads | 4 cores, 8 threads |
| RAM | 16 GB | 16 GB (8 GB for only building) |
| Free disk space | 30 GB | 20 GB |

## Signing

- The official build is signed only by the maintainer on the maintainer's machine, and the official key never goes into CI;
- A build you make yourself uses an automatically generated development key (`out\keys\dev.p12`), and keys never go into git;
- When installed on a ModAVD instance, it is replaced by the official build unless your `versionCode` is higher; when the signatures differ, the manager uninstalls first and then installs.

## Verification

You need an emulator from 0.35 or later that has the `modavd_ime` channel. Install the test APK, drive input with the `ime` command of the emulator console, and check the result.

## Protocol

Changing the protocol means changing both the host and the guest side: the host side is in ModAVD's emulator patches. You may only add new types and not change the format of existing ones; please discuss it in an issue first.

## Versioning

Numbered separately since v1.0.0. The tag is `v1.x.y`, and the APK's `versionName` is the same as the numeric part of the tag. When the APK's content changes, `versionCode` goes up by one.

## Suggested models

Sonnet 5.5 or GPT-6.1 Sol. The code is small and the rules are clear.
