# 这是什么

ModAVD（魔改 AVD）是基于 AOSP Android Emulator 37.2.10 的安卓模拟器，加了一批补丁后自己编译。目前支持 Windows，以后计划支持更多平台（见 [#27](https://github.com/ModAVD/ModAVD/issues/27)）。

包里带管理器 `ModAVD.exe` 和命令行 `tools\modavd.exe`，用来建实例、开机关机；也可以接入 [AUTO-MAS](https://github.com/AUTO-MAS-Project/AUTO-MAS) 这类自动化工具，由它们负责实例编排和任务流程。

- 一个安卓模拟器，现在跑在 Windows 上，用 Windows 虚拟机监控程序平台（WHPX）做硬件加速；以后计划支持更多平台。
- 可以开窗口当普通模拟器用，也可以不开窗口（无头）运行，由管理器、命令行或脚本拉起、用完关掉。
- 模拟器本体来自 Google 开源的 [Android Emulator](https://android.googlesource.com/platform/external/qemu/)。我们改了其中的 QEMU、gfxstream（图形转发）和 Crashpad（崩溃处理），改动以补丁形式公开。
- adb 和安卓系统镜像属于 Google，受《Android 软件开发套件许可协议》约束，不能由我们分发，所以不在 Release 里，由包里的「补全组件.bat」在你的电脑上从官方渠道下载。

和官方模拟器的逐项区别见[和官方模拟器有什么不同](./changes)。

## 包里有什么

一个 Release 包由几个部分组成，各自在自己的仓库里开发：

| 部分 | 在包里的位置 | 仓库 |
|---|---|---|
| 模拟器本体（打过补丁的 AOSP Emulator） | `sdk\emulator\` | [ModAVD](https://github.com/ModAVD/ModAVD) 的 `patches/` |
| arm64 执行桥 | `sdk\emulator\resources\modavd\` | ModAVD 的 `bridge/` |
| 随包脚本（补全组件、收集问题信息、复制配置信息、装执行桥） | 包根的 `.bat`、`tools\*.ps1` | ModAVD 的 `package/` |
| 管理器和命令行 | `ModAVD.exe`、`tools\modavd.exe` | [ModAVDManager](https://github.com/ModAVD/ModAVDManager) |
| 宿主输入法 | `components\modavd-ime.apk` | [ModAVDHostIME](https://github.com/ModAVD/ModAVDHostIME) |

- 管理器和输入法有自己的版本号，单独在各自仓库发版；ModAVD 整包发版时带上当时的版本。
- 平时只用整包就行。Mirror 酱也只更新 ModAVD 整包。

## 适用环境

| 项目 | 要求 |
|---|---|
| 系统 | Windows 10 / 11，64 位 |
| CPU | x86_64（Intel / AMD），BIOS 里开着虚拟化（Intel VT-x / AMD SVM） |
| Windows 功能 | 「Windows 虚拟机监控程序平台」（WHPX） |
| 显卡 | 支持 Vulkan 的独立显卡或较新的集成显卡 |
| 内存 | AUTO-MAS 默认每台实例 6 GB，开机时电脑要再空出约 1.5 GB |
| 硬盘 | 放在 NTFS 盘。补全组件时要约 6.5 GB 可用；每台实例第一次开机要 10 GB 以上可用，之后随游戏数据增长，一个游戏通常几十 GB |
| 路径 | 只含英文、数字的路径，例如 `D:\ModAVD` |
| AUTO-MAS | 推荐 `v5.7.0` 或更新。v5.7.0-beta.5 起 MAA 和 MFW 脚本（MaaFramework 项目，如 M9A）可以用，其他脚本暂不支持；各版本的支持情况见 Release 说明 |

## 免责声明

- Android 是 Google LLC 的商标。
- 软件按「现状」提供，不提供任何担保，详见各许可证。
- 用模拟器和脚本运行游戏是否符合游戏的用户协议，请自行判断。
