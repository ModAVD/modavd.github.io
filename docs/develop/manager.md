# 管理器和命令行

**改什么**：[ModAVDManager](https://github.com/ModAVD/ModAVDManager) 仓库。

- 管理器 `ModAVD.exe`：给人用的界面，实例卡片、开关机、新建、设置、画面查看、日志；
- 命令行 `modavd.exe` 和它的 MCP 服务：给脚本、AUTO-MAS、AI 助手用。

代码结构（`internal/` 下各包分别对照 AUTO-MAS 的哪段代码）、命令行的完整说明、机读输出和退出码，见仓库的 [README](https://github.com/ModAVD/ModAVDManager#readme)。使用者看的介绍见[组件：管理器和命令行](../components/manager)。

## 环境

- Go **1.26.5**（`go.mod` 里的 toolchain），设 `GOTOOLCHAIN=local`，只用标准库；
- PowerShell 7；
- 页面在 `internal/ui/web/`，是原生 JS / CSS，没有前端构建步骤。改样式时用 `ModAVD.exe --dev` 起假后端，不用开模拟器。

## 硬件

- 只编译、跑单测、用 `--dev` 改界面：4 核、8 GB 内存、2 GB 硬盘就够；
- 实机测试要开一台不装游戏的实例：

| | 推荐 | 最低 |
|---|---|---|
| CPU | 8 核 16 线程 | 4 核 8 线程 |
| 内存 | 16 GB | 16 GB（只编译和单测 8 GB） |
| 硬盘可用空间 | 30 GB | 20 GB |

## 构建

```powershell
pwsh -NoProfile -File build.ps1          # -> out\ModAVD.exe、out\tools\modavd.exe
pwsh -NoProfile -File build.ps1 -Test    # 先跑 go vet 和 go test
```

`-trimpath -buildvcs=false`，不用 `-X` 写版本号：同一份源码在哪台机器、哪个目录编，结果都逐字节相同，可以拿发布的哈希核对。

## 验证

- `gofmt -l .` 为空，`go vet ./...`、`go test ./...` 通过；
- 有一部分测试用 Python 3 运行 AUTO-MAS 的原始逻辑，和 Go 的输出逐字节对照，所以要装 Python 3；
- 实测要一个 ModAVD 根目录：Release 包解压，再补全组件；
- 实测用新建的实例、私有 adb 端口；
- 不要对放着重要实例的根目录开实机测试开关（`MODAVD_TEST_LIVE=1`）。

CI 在 PR 上跑格式检查、`go vet`、`go test`、`build.ps1`、隐私扫描和作者检查。

## 契约

`--json` 输出的信封、错误码和 `protocol` 版本是 AUTO-MAS 依赖的。加字段可以；改含义、删字段要把 `internal/buildinfo` 里的 `Protocol` 加一，先开 issue。

## 版本

管理器从 v0.1.0 起单独编号、单独发版。当前已发布的独立版本是 `v0.1.0`，ModAVD `v0.36.0` 整包钉住同一版本和哈希；整包里的那份不自更新，跟着整包一起换。`main` 中后续的 `update` 命令用于更新整个 ModAVD 根目录，不等于管理器独立包自更新；其中的 `0.2.0` 初始化和更新相关实现尚未随独立 Release 发布。AUTO-MAS 是否改用该命令由 AUTO-MAS 自己的维护者决定。

## 模型建议

- 界面、普通功能：Sonnet 5.5 或 GPT-6.1 Sol；
- 开机流程、并发和锁、进程管理、自更新这类容易出隐蔽问题、涉及安全的：Opus 5.5 或 GPT-6 Astra 写或者审。
