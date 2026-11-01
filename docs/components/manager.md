# 管理器和命令行

::: warning 版本范围
本页的普通用户说明以 ModAVD `v0.36.0` 整包随附的 ModAVDManager `v0.1.0` 为准。Manager 仓库 `main` 中的后续实现（例如新建时后台初始化和 `update` 命令）要等独立 Release 发布后才适用于下载包。
:::

ModAVD 0.36.0 起包里带两个管理程序，源码在 [ModAVDManager](https://github.com/ModAVD/ModAVDManager)：

| 程序 | 位置 | 给谁用 |
|---|---|---|
| 管理器 `ModAVD.exe` | 包根 | 给人用：实例卡片、开关机、新建、设置、画面查看、日志 |
| 命令行 `modavd.exe` | `tools\` | 给脚本、AUTO-MAS 和 AI 助手用；`modavd mcp` 是 MCP 服务 |

实例文件和 `mas-avd.json` 的写法与 AUTO-MAS 一致，两边建的实例可以互相开。

## 管理器

双击 `v0.36.0` 整包中的 `ModAVD.exe`：起一个只听 127.0.0.1 的本地服务，再用 Edge 的应用模式开一个窗口（Windows 10 / 11 自带 Edge）；找不到 Edge 时用默认浏览器。该整包中的管理器页面内嵌在程序里，日常操作不需要联网；单独下载的 Manager 版本可能包含不同的更新功能，请以它自己的 Release 说明为准。

- 功能：实例卡片（在线时有画面缩略图）、开关机（带进度）、新建、设置、删除、电脑检查、活动面板、画面查看（点击即点按，返回 / 主页 / 最近任务）、日志、安装 APK、打开目录；浅色 / 深色 / 跟随系统。
- 一个根目录只开一个服务，再双击只是把窗口重新打开；日志在 `<根>\logs\modavd-ui.log`。
- 关掉窗口后，等正在跑的任务做完再退出。

## 命令行

```
modavd [--root <目录>] [--json] [--quiet] [--verbose] <命令> [参数]
```

| 命令 | 说明 |
| --- | --- |
| `list` | 全部实例和状态 |
| `info <i>` / `status <i>` | 一台实例的详细信息 / 状态 |
| `create [--index N] [--title T] [--memory 6G] [--cpu N] [--data-gb N] [--fps 30\|60] [--no-bridge]` | 新建。默认带 arm64 执行桥，第一次开机时装上 |
| `set <i> [--title T] [--memory M] [--cpu N] [--fps F] [--data-gb N]` | 修改，下次开机生效。`--data-gb` 只能改大，游戏数据不动 |
| `delete <i> --yes` | 删除已关机的实例，连同游戏数据 |
| `start <i> [--window] [--timeout 300] [--no-bridge]` | 开机，等开完并做完开机后的设置 |
| `stop <i> [--force]`、`stop --all` | 关机：先让安卓正常关机，不成再 sync + kill；`--force` 是 sync + 强杀 |
| `restart <i> [--window] [--timeout 300] [--force] [--no-bridge]` | 关机再开机 |
| `bridge <i> install\|uninstall\|verify` | 装、卸、检查 arm64 执行桥 |
| `check [--memory M]` | 开机前的电脑检查 |
| `window <i> show\|hide`、`install <i> <apk>`、`shell <i> <命令>`、`adb <i> -- <参数>` | 窗口、装 APK、客体命令、adb 透传 |
| `servers`、`version`、`mcp`、`help [命令]` | |

- `<i>` 写成 `3` 或 `mas_3`（0–9，5 除外）；内存写成 `6144`、`6144M` 或 `6G`，只有 3 / 4 / 5 / 6 GB 四档，核数 2 / 4 / 6，帧率 30 / 60。
- 根目录：`--root`，没给就用环境变量 `MODAVD_ROOT`，再没有就用 `modavd.exe` 所在目录或它的上一级。
- adb 只走根目录的私有 server（`mas-avd.json` 的 `adbServerPort`），不碰默认的 5037。
- 关机先 sync 再关，不会弄出 0 字节的文件。

机读输出（`--json`）、退出码和完整的选项说明见 [ModAVDManager 的 README](https://github.com/ModAVD/ModAVDManager#命令行)。

## MCP

```
modavd mcp --root D:\ModAVD
```

工具：`list_instances`、`get_instance`、`check_host`、`create_instance`、`update_instance`、`delete_instance`、`start_instance`（带进度）、`stop_instance`、`set_window_visible`、`shell`、`install_apk`。

在 Claude Code 里注册（PowerShell 里 `--` 要加引号，否则会被吞掉）：

```powershell
claude mcp add --transport stdio --scope user modavd '--' D:\ModAVD\tools\modavd.exe mcp --root D:\ModAVD
```

或者项目的 `.mcp.json`：

```json
{"mcpServers": {"modavd": {"command": "D:\\ModAVD\\tools\\modavd.exe", "args": ["mcp", "--root", "D:\\ModAVD"]}}}
```

## 单独下载

管理器有自己的版本号（从 v0.1.0 起），在 [ModAVDManager 的 Releases](https://github.com/ModAVD/ModAVDManager/releases) 单独发布。

- 平时用 ModAVD 整包里带的那份就行，整包升级时一起换。
- 单独下载的包可以放在任意目录，用 `--root` 或 `MODAVD_ROOT` 指向 ModAVD 根目录；不要把它解压到 ModAVD 根目录、覆盖整包里的文件。
- 下载后按 Release 里的 `SHA256SUMS.txt` 核对哈希。
