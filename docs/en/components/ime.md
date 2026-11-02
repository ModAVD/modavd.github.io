# The host IME

A headless input method, `org.modavd.ime`, installed in the emulator's Android. Its source is in [ModAVDHostIME](https://github.com/ModAVD/ModAVDHostIME).

When you use the emulator with a window, it lets you type into Android directly with the Windows IME: Chinese, AltGr combinations and dead keys all work. Automation scripts can also type text in any language with the emulator console's `ime commit <text>`.

- It shows no input interface. Physical keys and `adb shell input` injection still go straight to the app, so games and automation are not affected.
- It requests no permissions, stores no data, and does not log the text that is typed.
- It needs an emulator from ModAVD 0.35.0 or newer (the `modavd_ime` channel exists from this version) and Android 11 or later. On an older emulator, installing it is harmless: it only backs off and retries the connection in the background and does not crash.

## How it gets installed

From 0.36.0 the package includes `components\modavd-ime.apk`, which is handled automatically when you start with the manager or the CLI:

- It is installed when it is not installed yet, when the installed version is older than the one in the package, or when the version number is the same but the content differs. It is never downgraded;
- After a fresh install it is enabled, and the decision whether to make it the default input method is made only once: it becomes the default only if the default at that time is still the image's own keyboard (or none). After that, if you switch to another input method, it is not changed back.

If you use a ModAVD release package, you do not need to install it manually.

## Signing certificate of the official APK

- Certificate SHA-256: `d18cca3c1982149349f164d28e02490b2eb694e44d56834fa02a1062eb42e823`
- Certificate subject `CN=ModAVD`, RSA 4096.
- To verify: `apksigner verify --print-certs <apk>`. The `certificate SHA-256 digest` in the output must match the value above.

## Downloading separately

The IME has its own version number (from v1.0.0) and is released separately on [ModAVDHostIME Releases](https://github.com/ModAVD/ModAVDHostIME/releases). The `components\modavd-ime.apk` in v1.0.0 and in the ModAVD 0.36.0 package is byte-for-byte identical.

An APK you build yourself is signed with your own key. To keep using it, its `versionCode` must be higher than the one in the release package; otherwise the manager switches back to the official version at boot. See [Develop: the host IME](../develop/ime).
