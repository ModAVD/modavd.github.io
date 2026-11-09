# 参与 ModAVD

ModAVD 只有一个维护者，回复可能要几天。大一点的改动请先开 issue 商量，没商量过的大 PR 可能不合。

想知道各部分要什么环境和硬件、用 AI 工具时选什么模型，见[分区一览和通用要求](./overview)。

issue、PR、评论和提交说明用中文或英文都可以。

## 按你会的找入口

| 你会的 | 能做什么 | 要什么环境 | 从这里开始 |
|---|---|---|---|
| 不写代码，会玩游戏 | 在自己的电脑上跑游戏，报能不能跑、帧率怎么样 | 一台满足[适用环境](../guide/#适用环境)的 Windows 10 / 11 电脑 | [游戏实测和兼容性报告](./testing)；已经测过哪些游戏见 [README](https://github.com/ModAVD/ModAVD#已实测的游戏) |
| 写文档、翻译 | 改错漏、把只有中文的页面和 README 翻成英文、校对英文 | 浏览器就够；本地预览要 Node.js 24 | [文档和本站](./docs)；[文档类 issue](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3Aarea%3Adocs) |
| Go | 管理器和命令行：建实例、开关机、下载组件、界面（页面是原生 JS / CSS），包括给界面做英文版 | Go 1.26、Windows；只编译和跑单测 4 核、8 GB 内存就够 | [管理器和命令行](./manager)；[管理器的 issue](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3Aarea%3Amanager) |
| Java（Android） | 宿主输入法：电脑上打字直接送进安卓 | JDK、两件 Android SDK 组件（共约 1 GB） | [宿主输入法](./ime)；[输入法的 issue](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3Aarea%3Ahostime) |
| PowerShell、Python | 发版前回归（端到端测试）、随包脚本、CI 检查 | PowerShell 7、Python 3.12 | [随包脚本](./package)、[ModAVDE2E](https://github.com/ModAVD/ModAVDE2E)；[回归的 issue](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3Aarea%3Ae2e) |
| C / C++（QEMU、图形、Vulkan、ARM 转译） | 模拟器本体的补丁、arm64 执行桥 | 自己编模拟器要约 140 GB 硬盘，16 核编一次约 1.5 小时；只交补丁的话不要求会编 | [模拟器本体](./emulator)、[arm64 执行桥](./bridge) |
| macOS、Linux | 把 ModAVD 移到别的平台：管理器的平台层、打包、签名 | 对应平台的电脑 | [#27 多平台总体安排](https://github.com/ModAVD/ModAVD/issues/27)；[macOS](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3Aplatform%3Amacos)、[Linux](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3Aplatform%3Alinux) 的 issue |

第一次来，先看标了 [good first issue](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3A%22good%20first%20issue%22) 的：范围小，不用编模拟器，正文里有英文说明。

## 最需要的：在你的电脑上试

维护者只在一台 Windows 11、AMD CPU、NVIDIA 独显的电脑上测过。最缺这些配置的实测：Intel CPU，AMD 或 Intel 显卡，笔记本双显卡，Windows 10，16 GB 内存。

1. 照[安装](../guide/install)装好，在管理器里建一台实例、开机，装上你玩的游戏玩一会儿；用 AUTO-MAS 的，在 AUTO-MAS 里添加，跑一轮日常任务。
2. 在管理器的「设置 → 组件与问题反馈」里点「复制配置信息」（或运行 `tools\modavd.exe report-config`），在 ModAVD 仓库的 [Issues](https://github.com/ModAVD/ModAVD/issues) 新开 issue，贴上它，补完最后三行，再写一句能不能跑。0.38.1 及更早的包里是包根的「复制配置信息.bat」。

这份输出不带用户名、电脑名、完整路径和游戏账号，可以直接公开贴。详见[游戏实测和兼容性报告](./testing)。

## 报问题

- 各组件的问题都在 ModAVD 仓库的 [Issues](https://github.com/ModAVD/ModAVD/issues) 提：模拟器本体，也包括管理器和命令行、宿主输入法、本站、发版前回归。开 issue 时选上是哪个组件。
- 附「收集问题信息」生成的问题包（管理器的「设置 → 组件与问题反馈」，或 `tools\modavd.exe collect-info`）。哪些能公开贴、崩溃转储怎么私下发，见[反馈问题](../guide/feedback)。
- 贴日志前，把路径里的 `C:\Users\<你的用户名>` 换成 `%USERPROFILE%`。
- AUTO-MAS 的界面、任务、调度问题，请到 [AUTO-MAS](https://github.com/AUTO-MAS-Project/AUTO-MAS/issues) 提。
- 安全问题不要公开发，请发邮件到 qiyinxi@foxmail.com。

## 改文档和代码

- 动手前在 issue 里说一声；issue 已经指派给谁，就是有人在做。
- 从自己的 fork 开 PR。外部 PR 的 CI 要维护者批准后才会跑。
- 本站和各仓库 README 里写错、写得不清楚的地方：直接提 PR，见[文档和本站](./docs)。
- 随包脚本 `package/`：可以提 PR，合进来后随下一版发出。要守的写法见[随包脚本](./package)。
- arm64 执行桥 `bridge/`：改动先开 issue 商量。它直接影响游戏能不能启动，每一版都要在装了桥的实例上实跑游戏回归。
- 管理器和命令行在 [ModAVDManager](https://github.com/ModAVD/ModAVDManager)，宿主输入法在 [ModAVDHostIME](https://github.com/ModAVD/ModAVDHostIME)，发版前回归（端到端测试）在 [ModAVDE2E](https://github.com/ModAVD/ModAVDE2E)：PR 提到那边，issue 还是在 ModAVD 仓库提；署名和许可规矩与本页相同。
- ModAVD 仓库的 `patches/`、`manifests/`、`release/` 是发版工具（`tools/pubrel/`）导出的：PR 不直接改这些，有问题先开 issue。
- ModAVD 仓库的发版和编译工具 `tools/`、CI 检查 `scripts/`（发版工具也用这一份）：改动先开 issue 商量。
- 新加或修改 workflow：第三方 action 钉到 40 位提交 SHA，不用 `pull_request_target`，不用自托管 runner。`mirrorchyan_*.yml` 由 Mirror 酱官方维护，照原样保留。
- 不收编译 CI：源码加编译产物约 124 GB，16 核的机器全量编一次要 1.5 小时左右，GitHub 的免费机器跑不了；自托管 runner 又会让外部 PR 在那台机器上执行任意命令。想帮忙验证构建，照[从源码构建](./build)在自己的电脑上编，把结果贴到 issue。

模拟器补丁怎么交，见[模拟器本体](./emulator)。

## 署名与许可

- 署你自己的名字或化名，邮箱用 GitHub 的 noreply 地址（`<编号>+<登录名>@users.noreply.github.com`，在 GitHub 的邮箱设置里能看到）；不写 `Co-authored-by`。收进来后保留你的署名，发版说明里会致谢。
- 你的改动按所改文件的许可证进来，见[许可证与源码](../guide/license)；新文件的版权行写你的名字或化名。不用签 CLA，`Signed-off-by` 可加可不加。
- 可以用 AI 工具，但改动要让 AI 自己测过，你为它负责。给 AI 工具看的规矩在 ModAVD 仓库根目录的 [AGENTS.md](https://github.com/ModAVD/ModAVD/blob/main/AGENTS.md)，Codex、Claude Code 等会自己读。见[用 AI 工具协助](./ai)。
- 通用的修复以后可能投到 Google 上游（AOSP、google/gfxstream），上游要求作者本人签 Google CLA。到时会先问你，不愿意就只留在 ModAVD。
- 图片、图标类改动先开 issue，写明来源和许可证；同人图和来源说不清的图不收。

## 自己测试时

- 关实例尽量在 AUTO-MAS 或管理器里关。自己写脚本时，先 `adb -s <设备> shell sync`，再 `adb -s <设备> emu kill`：不先 sync，游戏刚写的文件可能变成 0 字节。
- 强杀测试用新建的实例和测试账号，不用登着主力账号的实例。
- 不要用默认 5037 端口上的 adb，它会和别的模拟器自带的 adb 抢同一个 server；端口看 `mas-avd.json` 里的 `scriptAdbServerPort`（默认 20049），和 AUTO-MAS 给脚本用的一样。

## 其他

想帮着整理 issue（复现、合并重复、打标签），可以找维护者要 Triage 权限。
