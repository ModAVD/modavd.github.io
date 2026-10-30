# 许可证与源码

## ModAVD 仓库里的内容

- **除 `package/`、`bridge/`、`assets/` 和 `patches/` 下的 `.patch` 补丁以外**（README 等文档、`docs/`、`scripts/`、`.github/` 等）：Apache License 2.0，见仓库根目录的 [LICENSE](https://github.com/ModAVD/ModAVD/blob/main/LICENSE)。Copyright 2026 qiyinxi。
- `package/` 和 `bridge/` 按 AGPL-3.0-or-later（见下一节）。
- 补丁按各自所改文件的许可证（见「补丁」一节）。
- `assets/` 下的图片和程序图标见[图标与美术](#图标与美术)。

本站的文档同样按 Apache License 2.0 发布。

## ModAVD 自己的程序

0.36.0 起都是 GNU Affero General Public License 第 3 版或更新版本（AGPL-3.0-or-later）：

| 程序 | 源码 |
|---|---|
| 包里的脚本（补全组件、收集问题信息、复制配置信息、装执行桥） | ModAVD 仓库的 [`package/`](https://github.com/ModAVD/ModAVD/tree/main/package)。0.35.0 及更早的包里的脚本按 Apache License 2.0 发布 |
| arm64 执行桥（`sdk\emulator\resources\modavd\`） | ModAVD 仓库的 [`bridge/`](https://github.com/ModAVD/ModAVD/tree/main/bridge)，也在同一个 Release 的源码包里 |
| 管理器 `ModAVD.exe` 和命令行 `tools\modavd.exe` | [ModAVD/ModAVDManager](https://github.com/ModAVD/ModAVDManager) |
| 宿主输入法 `components\modavd-ime.apk` | [ModAVD/ModAVDHostIME](https://github.com/ModAVD/ModAVDHostIME) |

分发这些程序（改没改都算），或者把改过的版本放到网上给别人用，都要按同样的许可证提供对应源码。别的程序只是调用 `modavd.exe`、MCP 服务或管理器的本地接口，不受影响。

## 补丁

每个补丁按它所改文件的许可证发布，与上游文件头一致：

- QEMU 仓库（`platform/external/qemu`）里，改 QEMU 本体文件的、改带 GPL-2.0 文件头的文件的，按 GPL-2.0；改带 Apache-2.0 文件头的文件的（`android/`、`android-qemu2-glue/` 下的一部分），按 Apache License 2.0。逐个补丁的许可证见 [patches/BASE.md](https://github.com/ModAVD/ModAVD/blob/main/patches/BASE.md)。
- gfxstream 和 Crashpad 的补丁按 Apache License 2.0 发布，与它们本身相同。

## Release 里的程序

含有 QEMU（GPL-2.0）、FFmpeg（GPL-2.0 或更新版本，静态链接）、Qt 6.5.3（LGPL-3.0）、GLib 和 libusb（LGPL-2.1）等第三方组件。`qemu-system` 等程序整体按 GPL-2.0 发布。每个组件的许可证见包里的 `LICENSES\NOTICE.txt`，摘要见 [THIRD_PARTY.md](https://github.com/ModAVD/ModAVD/blob/main/THIRD_PARTY.md)。

## 源码

同一个 Release 的源码包（`ModAVD-<版本>-sources.zip`）里有完整的对应源码：

- 编进程序的 24 个仓库在编译时的确切版本，每个仓库一个 `.tar.xz`，QEMU 仓库里含构建脚本；
- FFmpeg / libvpx / libxml2 / pixman 的源码包、SeaBIOS 和 iPXE 源码、Qt 6.5.3 源码；
- `netsimd.exe` 静态链接的 GLib 2.82.2 及其构建模块和 netsim 源码；
- 两份仓库清单（ModAVD 仓库的 [`manifests/`](https://github.com/ModAVD/ModAVD/tree/main/manifests) 里也有）；
- 0.36.0 起还有 `modavd-src-<提交>.tar.xz`，是 ModAVD 自己的程序（管理器和命令行、arm64 执行桥、宿主输入法）的源码，按 AGPL-3.0-or-later 发布，`LICENSE` 和 `NOTICE` 在归档里；
- 逐个说明这些文件的 `SOURCES.txt`。

补丁在 ModAVD 仓库的 [`patches/`](https://github.com/ModAVD/ModAVD/tree/main/patches)。自己编译见[从源码构建](../develop/build)。

## Google 的组件

adb 和系统镜像不在 Release 里，由「补全组件.bat」从官方渠道下载，受《Android 软件开发套件许可协议》约束，下载前要你同意。

## 图标与美术

- ModAVD 仓库 `assets/` 下的图片（横幅、头像、社交预览图），以及编进程序里的图标（`emulator.exe`、`emulator-check.exe`、`qemu-system-x86_64*.exe`、`ModAVD.exe` 的程序图标和窗口图标，管理器页面里的图片），都是同人创作，**不在任何代码或文档许可证的授权范围内**。
- 画中角色是《明日方舟》的艾雅法拉，角色版权归上海鹰角网络所有。
- 本项目与鹰角网络无关，也未获其认可。
- 如有版权问题，请通过 [Issues](https://github.com/ModAVD/ModAVD/issues) 或邮件 qiyinxi@foxmail.com 联系，我们会立即处理。
