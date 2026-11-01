# 分区一览和通用要求

ModAVD 是 AOSP Android Emulator 加一批补丁，WHPX 加速，gfxstream 渲染，另有几样自己写的组件。下面按开发区域分类，每个分区的页面写清要什么硬件和环境、怎么验证，以及用 AI 工具协助时建议用什么模型（Claude 和 GPT 都列了）。

参与方式（署名、许可、怎么提交）以[参与 ModAVD](./) 为准。

## 仓库和分区一览

| 分区 | 仓库 / 目录 | 主要语言 | 难度 | GitHub CI 能验证到哪 | 建议模型（Claude / GPT） |
|---|---|---|---|---|---|
| [模拟器本体](./emulator)（qemu / gfxstream / crashpad 补丁） | [ModAVD](https://github.com/ModAVD/ModAVD) 的 `patches/`、`manifests/` | C / C++ | 高 | 只回放补丁、比对源码树；不编译 | Opus 5.5 / GPT-6 Astra，推理开高 |
| [arm64 执行桥](./bridge) | ModAVD 的 `bridge/` | C++（NDK） | 高 | 不能 | Opus 5.5 / GPT-6 Astra |
| [管理器和命令行](./manager) | [ModAVDManager](https://github.com/ModAVD/ModAVDManager) | Go，页面是原生 JS / CSS | 中 | 单元测试、构建、可复现核对 | Sonnet 5.5 / GPT-6.1 Sol；开机流程、并发、自更新用 Opus 5.5 / GPT-6 Astra |
| [宿主输入法](./ime) | [ModAVDHostIME](https://github.com/ModAVD/ModAVDHostIME) | Java（Android） | 中低 | 协议自测、APK 构建、发布核对 | Sonnet 5.5 / GPT-6.1 Sol |
| [随包脚本](./package) | ModAVD 的 `package/` | PowerShell、批处理 | 中低 | 隐私扫描 | Sonnet 5.5 / GPT-6.1 Sol |
| [文档和本站](./docs) | 本站仓库 [modavd.github.io](https://github.com/ModAVD/modavd.github.io)，各仓库的 README | Markdown | 低 | 编译站点、查死链、隐私扫描 | Sonnet 5.5 / GPT-6.1 Terra；机械改动用 Haiku 5.5 / GPT-6 Luna |
| [AUTO-MAS 对接](./automas) | [AUTO-MAS](https://github.com/AUTO-MAS-Project/AUTO-MAS) | Python、前端 | 中 | 按 AUTO-MAS 自己的 CI | Sonnet 5.5 / GPT-6.1 Sol；审查用 Opus 5.5 / GPT-6 Astra |
| [游戏实测、兼容性报告](./testing) | 置顶的「兼容性报告」issue | — | 低到中 | 不能 | 看日志 Sonnet 5.5 / GPT-6.1 Terra；整理 Haiku 5.5 / GPT-6 Luna |
| [适配新游戏](./adapt-game)（起不来、跑不好） | 查清原因后落在执行桥、本体或自动化脚本 | 看原因 | 中到高 | 不能 | 分类看日志 Sonnet 5.5 / GPT-6.1 Sol；查转译层、图形的根因 Opus 5.5 / GPT-6 Astra |

## 项目组成与协作边界

| 项目 | 主要职责 | 发布与问题反馈 |
|---|---|---|
| [ModAVD](https://github.com/ModAVD/ModAVD) | 模拟器补丁、arm64 执行桥、随包脚本、整包构建和发布 | 整包 Release；模拟器、桥和随包脚本问题提到 ModAVD |
| [ModAVDManager](https://github.com/ModAVD/ModAVDManager) | 图形管理器、CLI、MCP 和实例生命周期 | 独立 Release；管理器、CLI、MCP 问题提到 ModAVDManager |
| [ModAVDHostIME](https://github.com/ModAVD/ModAVDHostIME) | 客体侧宿主输入法 APK 和协议实现 | 独立 Release；输入法和客体协议问题提到 ModAVDHostIME |
| [modavd.github.io](https://github.com/ModAVD/modavd.github.io) | 使用说明、组件说明和开发文档 | 文档问题提到本站仓库；内容以对应代码和 Release 为准 |
| [AUTO-MAS](https://github.com/AUTO-MAS-Project/AUTO-MAS) | 独立的自动化编排、脚本和任务流程 | AUTO-MAS 自己的代码、Release、网络和隐私问题提到 AUTO-MAS |

ModAVD 的 QEMU 补丁提供宿主侧输入法通道，ModAVDHostIME 实现客体侧协议；协议或版本变化需要在相关仓库分别同步。技术兼容和接口对接不表示这些项目存在正式合作、共同维护或相互代表关系。

## 所有分区都适用的要求

- **系统**：Windows 11 x64（Windows 10 测得少，欢迎报告），BIOS 里开着虚拟化，打开「Windows 虚拟机监控程序平台」（WHPX）。
- **显卡**：装好带 Vulkan 的显卡驱动（独立显卡或较新的集成显卡）。没有可用显卡时只能软件渲染，游戏会占满 CPU。
- **CPU、内存、硬盘**：按分区差别很大，关键看要不要编译模拟器本体、要不要开实例、要不要装游戏，写在各分区页面的「硬件」里。最低配置能跑通、但会慢；推荐配置是维护者觉得顺手的。
- **常用工具**：
  - PowerShell 7（开发脚本），随包脚本还要兼容 Windows PowerShell 5.1；
  - Python 3.12；
  - Git for Windows。
- **关模拟器**：先 `adb -s <设备> shell sync`，再 `adb -s <设备> emu kill`，或者用管理器、命令行的关机。不先 sync，客体刚写的文件可能变成 0 字节。
- **adb 端口**：不要用默认 5037 上的 adb server，它会和别的模拟器自带的 adb 抢。用 ModAVD 根目录 `mas-avd.json` 里的私有端口。
- **测试数据**：用新建的实例和测试账号，不在登着主力账号的实例上做强杀之类的测试。
- **提交**：
  - 从自己的 fork 开 PR；
  - 署自己的名字或化名；
  - 外部 PR 的 CI 要维护者批准后才会跑。
- **用 AI 工具**：可以用。提交者仍要对改动负责；能编译、能开实例的代码改动应尽可能实际验证，在 PR 里写明实际运行过的检查和结果。不要把账号、密钥、私人路径交给 AI 工具。见[用 AI 工具协助](./ai)。

CI 绿灯只表示相应仓库声明的静态、构建或协议检查通过，不代表完整编译、Windows 实机启动、GPU 或游戏兼容性验证，也不代表 AUTO-MAS 全流程已经验证。跨仓库改动要分别说明每个仓库的基线、依赖和实际测试结果。

### 开一台实例要什么

好几个分区的验证都要开实例。数字来自 ModAVD 的说明和维护者机器上的实测：

- **CPU**：x86_64，BIOS 里开着虚拟化（Intel VT-x / AMD SVM）。安卓能用的虚拟 CPU 最多是电脑逻辑处理器数的一半，所以给实例 4 核要 8 个线程，6 核要 12 个线程。
- **内存**：实例内存可选 3 / 4 / 5 / 6 GB（AUTO-MAS 默认 6 GB），开机时电脑还要再空出约 1.5 GB；模拟器自身另占约 0.6–0.75 GB。
- **硬盘**：放在 NTFS 盘上。组件和模拟器本体共约 5 GB（补全组件时要 6.5 GB 可用）；每台实例第一次开机，所在的盘要有 10 GB 以上可用，不装游戏的新实例实际只占约 1.1 GB。装了游戏的实例要几十 GB，见[游戏实测](./testing)。

## 当前状态和对接方向

动手前先看，免得撞车：

- AUTO-MAS 与 `modavd` 命令行的对接方向；是否以及何时切换由 AUTO-MAS 自己的维护者和 Release 决定；
- ModAVDManager 的第一个独立版本 `v0.1.0` 已发布；`main` 中的 `0.2.0` 初始化和整包 `update` 实现尚未随独立 Release 发布；
- ModAVDHostIME 的第一个独立版本 `v1.0.0` 已发布，后续协议和 APK 变更按该仓库的 Release 说明为准。

想做的事和这些有交集，先在对应仓库开 issue 说一声。
