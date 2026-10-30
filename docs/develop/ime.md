# 宿主输入法

**改什么**：[ModAVDHostIME](https://github.com/ModAVD/ModAVDHostIME) 仓库。客体里的无界面输入法 `org.modavd.ime`，经模拟器的 `modavd_ime` 通道，接收 Windows 输入法打出的文字；还有测试 APK 和通道协议说明 `docs/protocol-v1.md`。

目录结构、协议要点、测试 APK 的用法见仓库的 [README](https://github.com/ModAVD/ModAVDHostIME#readme)。

## 环境

- JDK：Temurin 25.0.4.1+1（`javac --release 17`）；
- Android SDK：build-tools 36.1.0、platforms android-36（修订 2），用到 aapt、aapt2、d8、zipalign、apksigner；用 `ANDROID_HOME` 指过去；
- 不用 Gradle。`build.ps1` 只能在 Windows 上跑；协议自测只要 javac，任何系统都行；
- 想编出和发布版逐字节相同的未签名 APK，编译时把时区设成中欧时间（`TZ=CET-1`）。

## 硬件

- 只编译：JDK 和两件 Android SDK 组件共约 1 GB，4 核、8 GB 内存就够；
- 验证要开一台不装游戏的实例：

| | 推荐 | 最低 |
|---|---|---|
| CPU | 8 核 16 线程 | 4 核 8 线程 |
| 内存 | 16 GB | 16 GB（只编译 8 GB） |
| 硬盘可用空间 | 30 GB | 20 GB |

## 签名

- 官方版只由维护者在本机签名，正式密钥不进 CI；
- 自己编的版本会用自动生成的开发密钥（`out\keys\dev.p12`），密钥绝不进 git；
- 装到 ModAVD 实例上会被换回官方版，除非你的 `versionCode` 更高；签名不同时管理器会先卸再装。

## 验证

需要 0.35 起带 `modavd_ime` 通道的模拟器，装上测试 APK，用模拟器控制台的 `ime` 命令驱动输入，核对结果。

## 协议

改协议要宿主、客体两边一起改：宿主侧在 ModAVD 的模拟器补丁里。只能加新类型、不改已有类型的格式，请先在 issue 里讨论。

## 版本

从 v1.0.0 起单独编号。tag 是 `v1.x.y`，APK 的 `versionName` 与 tag 的数字部分相同；APK 内容改变时 `versionCode` 加一。

## 模型建议

Sonnet 5.5 或 GPT-6.1 Sol。代码量小、规则清楚。
