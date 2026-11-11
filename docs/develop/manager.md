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
- 有一部分测试用 Python 3 运行 AUTO-MAS 的原始逻辑，和 Go 的输出逐字节对照，所以要装 Python 3：环境变量 `MODAVD_TEST_PYTHON` 指向它，不设就用 PATH 上的 `python`，找不到就跳过那几个对照测试；
- 实测要一个 ModAVD 根目录：Release 包解压，再补全组件；
- 实测用新建的实例、私有 adb 端口；
- 开发、测试用的根目录换一段端口：同一台电脑上还有日常在用的根目录（比如 AUTO-MAS 用的那个）时，在开发根目录的 `mas-avd.json` 里写 `"portBase": 21000`，这个根目录的实例就从 21000 起算端口，不和那边同编号的实例抢。要带 [ModAVD/ModAVD#75](https://github.com/ModAVD/ModAVD/issues/75) 的管理器。
  - 端口：控制台 = `portBase` + 10 × 编号，adb 加 1，gRPC 加 2；编号还是 0–9，不含 5。`portBase` 只能是 20000（缺省），或者 1100–65400 之间 100 的整数倍；同时开两个开发根目录，第二个换一段，比如 23000。选之前先看一眼这一段有没有别的程序在用（比如 Syncthing 默认占着 22000）。
  - `adbServerPort`、`scriptAdbServerPort` 也要配，不能是 20049、20050，也不能落在 20000 段实例的端口上。否则管理器不开机、不新建，也不去起或连 adb server。
  - 改之前先关掉这个根目录的所有实例。AUTO-MAS 还不认 `portBase`，设了的根目录不要加进 AUTO-MAS。
- 不要对放着重要实例的根目录开实机测试开关（`MODAVD_TEST_LIVE=1`）。

CI 在 PR 上跑：

- Windows：全套，包括格式检查、`go vet`、`go test`、`build.ps1`、隐私扫描和作者检查，另外用 `GOOS=darwin GOARCH=arm64`、`GOOS=linux GOARCH=amd64` 各交叉 `go vet` 一遍；
- macOS 和 Linux：只在对应系统上跑 `go vet` 和 `go test`，不编出可发布的程序，也不开模拟器。

## 平台层

管理器目前以 Windows x64 为主，平台相关的部分拆在两处：

- `internal/win`：Windows 的进程、命令行、端口、脱离进程树的启动、文件锁、窗口等操作。这些文件都带 `//go:build windows`，别的系统编译时不包含它们；
- `internal/root/platform.go`：平台表。`Platform` 结构按宿主系统和架构给出一行固定的值：模拟器、adb、QEMU（含无头版）的文件名，QEMU 所在的子目录，整包文件名的后缀，Mirror 酱的系统和架构标识，客体的 ABI 和架构、目标 API，以及系统镜像的目录和名字。`CurrentPlatform()` 现在有 Windows x64、macOS arm64、Linux x64 三行，其余组合返回空表，`Supported()` 为 `false`，不会沿用 Windows 的名字。共用的代码查这张表，不要在里面写死 `.exe` 或 x86_64。

这张表只管文件名和标识，不管根目录布局、端口和实例路径的规则（那些在 `internal/root` 的其他文件里）。

非 Windows 的部分放在各包的 `*_other.go` 这类文件里（宿主相关的在 `internal/host`），多数先是返回 `Unsupported` 的桩，各命令照实报 `unsupported`（退出码 4）；比如组件清单只有 Windows 有。要给一个新平台补上，大致是：

1. 在平台表里加这一行（或改现有的行），补上该平台的测试；
2. 把 Windows 专有的操作（`internal/win` 里的，以及各包 `*_other.go` 里的桩）写成对应平台的实现，用构建标签区分，替换掉桩；
3. 组件下载、整包更新、打包和签名按平台各做一份；
4. 在对应系统的 CI 上跑 `go vet`、`go test`。

总体安排和各平台的分工见 [ModAVD/ModAVD#27](https://github.com/ModAVD/ModAVD/issues/27)，macOS 平台层的具体做法见 [ModAVD/ModAVD#68](https://github.com/ModAVD/ModAVD/issues/68)。

## 契约

`--json` 输出的信封、错误码和 `protocol` 版本是 AUTO-MAS 依赖的。加字段可以；改含义、删字段要把 `internal/buildinfo` 里的 `Protocol` 加一，先开 issue。

脚本要用实例的端口时，从 `list` / `info` / `status` 的 `ports`、`serial` 取，不要自己按 20000 + 10 × 编号算：设了 `portBase` 的根目录不在 20000 段上。`list` 的 `port_base` 是根目录实际用的端口段，旧版管理器没有这一项（只用 20000 段）。

## 版本

管理器从 v0.1.0 起单独编号、单独发版（v0.1.0 的两个 exe 和 ModAVD 0.36.0 包里的逐字节相同）。ModAVD 整包发版时钉住当时的管理器版本和哈希，整包里的那份跟着整包一起换。管理器不自更新：0.2.0 起的 `modavd update` 更新的是整个 ModAVD 根目录（来源 GitHub 或 Mirror 酱，只在手动运行时联网），单独下载的管理器要手动替换。

## 模型建议

- 界面、普通功能：Sonnet 5.5 或 GPT-6.1 Sol；
- 开机流程、并发和锁、进程管理、整包更新这类容易出隐蔽问题、涉及安全的：Opus 5.5 或 GPT-6 Astra 写或者审。
