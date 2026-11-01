# 这是什么

ModAVD（魔改 AVD）是面向 Windows、重点优化无人值守自动化的安卓模拟器，也可以由随包的管理器或命令行独立管理。基于 AOSP Android Emulator 37.2.10，加了一批补丁后自己编译。

可以与独立的 [AUTO-MAS](https://github.com/AUTO-MAS-Project/AUTO-MAS) 项目集成，由它负责自己的实例编排、脚本和任务流程。0.36.0 起包里另带管理器 `ModAVD.exe` 和命令行 `tools\modavd.exe`，也可以不经 AUTO-MAS 自己管理实例。

::: info 非官方项目
这是非官方项目，与 Google 没有关联。
:::

::: warning 版本范围
本页的普通用户说明以最新已发布整包 `v0.36.0` 为准；各组件的 `main` 可能包含尚未随整包发布的后续实现，下载包的行为以对应 Release 说明和包内版本为准。
:::

- 一个跑在 Windows 上的安卓模拟器，用 Windows 虚拟机监控程序平台（WHPX）做硬件加速。
- 面向无人值守的挂机：通常不开窗口（无头）运行，由脚本拉起、跑完关掉；需要看画面或手动登录游戏时，也可以带窗口启动。
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

- 本项目是非官方项目，与 Google LLC 没有关联，也没有得到 Google 的认可或支持。
- Android 是 Google LLC 的商标。
- 软件按「现状」提供，不提供任何担保，详见各许可证。
- 用模拟器和脚本运行游戏是否符合游戏的用户协议，请自行判断。
