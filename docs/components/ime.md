# 宿主输入法

装在模拟器安卓里的无界面输入法 `org.modavd.ime`，源码在 [ModAVDHostIME](https://github.com/ModAVD/ModAVDHostIME)。

带窗口用模拟器时，它让你直接用 Windows 的输入法给安卓打字：中文、AltGr 组合键、死键都行。自动化脚本也可以用模拟器控制台的 `ime commit <文本>` 打任意语言的文字。

- 不显示任何输入界面；物理按键和 `adb shell input` 注入照旧直达应用，游戏和自动化不受影响。
- 不申请额外权限，也不把输入内容或通道数据持久化到文件；运行日志写入 Android logcat，正常日志不记录打出的文字。调试日志和系统日志仍可能由 Android 保留，见 [宿主输入法日志](../develop/ime#日志)。
- 要 ModAVD 0.35.0 或更新的模拟器（这一版起有 `modavd_ime` 通道），安卓 11 以上。旧模拟器上装了也只是在后台退避重连，不会崩。

## 怎么装上

0.36.0 起包里带 `components\modavd-ime.apk`，用管理器或命令行开机时自动处理：

- 没装、已装的版本比包里的旧，或者版本号相同但内容不同时装上，不降级；
- 新装后启用，并且只决定一次是否设成默认输入法：当时默认的还是镜像自带的键盘（或没设）才设成它，之后你切到别的输入法就不再改回来。

用 ModAVD 的发布包就不需要手动装。

## 官方 APK 的签名证书

- 证书 SHA-256：`d18cca3c1982149349f164d28e02490b2eb694e44d56834fa02a1062eb42e823`
- 证书主体 `CN=ModAVD`，RSA 4096。
- 核对：`apksigner verify --print-certs <apk>`，输出里的 `certificate SHA-256 digest` 要和上面的值一致。

## 单独下载

输入法有自己的版本号（从 v1.0.0 起），在 [ModAVDHostIME 的 Releases](https://github.com/ModAVD/ModAVDHostIME/releases) 单独发布。v1.0.0 和 ModAVD 0.36.0 包里的 `components\modavd-ime.apk` 逐字节相同。

自己编的 APK 用你自己的密钥签名，要一直用它的话 `versionCode` 要比发布包里的高，否则管理器开机时会换回官方版本。见[开发：宿主输入法](../develop/ime)。
