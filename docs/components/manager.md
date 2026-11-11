# 管理器和命令行

ModAVD 0.36.0 起包里带两个管理程序，源码在 [ModAVDManager](https://github.com/ModAVD/ModAVDManager)：

| 程序 | 位置 | 给谁用 |
|---|---|---|
| 管理器 `ModAVD.exe` | 包根 | 给人用：实例卡片、开关机、新建、设置、画面查看、日志 |
| 命令行 `modavd.exe` | `tools\` | 给脚本、AUTO-MAS 和 AI 助手用；`modavd mcp` 是 MCP 服务 |

实例文件和 `mas-avd.json` 的写法与 AUTO-MAS 一致，两边建的实例可以互相开。

## 管理器

双击包根的 `ModAVD.exe`：起一个只听 127.0.0.1 的本地服务，再用 Edge 的应用模式开一个窗口（Windows 10 / 11 自带 Edge）；找不到 Edge 时用默认浏览器。页面内嵌在程序里，不联网。

- 功能：实例卡片（在线时有画面缩略图）、开关机（带进度）、新建、设置、删除、电脑检查、活动面板、画面查看（点击即点按，返回 / 主页 / 最近任务）、日志、安装 APK、打开目录；浅色 / 深色 / 跟随系统。管理器 0.4.0 起还有[按应用走代理](./app-proxy)。
- 管理器开机一律带窗口。无头只从命令行开（`start <i>` 默认无头，MCP 的 `start_instance` 也是），给 AUTO-MAS 这类自动化用；管理器里不提供无头开机。无头运行的实例在卡片上标「无头」，也能在这里关机。
- 一个根目录只开一个服务，再双击只是把窗口重新打开；日志在 `<根>\logs\modavd-ui.log`。
- 关掉窗口后，等正在跑的任务做完再退出。管理器 0.8.0 起的 Windows 版改成留在托盘，见下。

### 老板键和托盘

管理器 0.8.0 起，只有 Windows。

- **老板键**：每台带窗口运行的实例一个全局快捷键，按一下藏起这台的模拟器窗口，再按一下叫回来。
  - 藏着的时候照旧渲染、照旧能截图，自动化不受影响。任务栏上没有它的按钮。叫回来以后，位置、大小和藏之前一样。
  - 无头的实例本来就没有窗口，老板键管不到它。
- **默认键**：编号 0–9 是 Ctrl+Alt+Shift+编号，用主键盘那排数字，比如 `mas_1` 是 Ctrl+Alt+Shift+1；编号超过 9 的默认没有。
- **在哪改**：在实例的「设置」里改，和诊断模式在一处。
  - 点一下输入框，按想用的组合。至少带 Ctrl、Alt、Shift 中的一个，不收 Win 的组合。
  - 可以清空，这台就没有老板键了。
  - 改了马上生效，不用重开实例。
  - 命令行是 `set <i> --boss-key <组合>`（`none` 是不要），`info` 里能看到。
  - 存在 `mas-avd.json` 这台实例底下的 `bossKey`，没写就用默认值。
- **几台用同一个键**：不算冲突。按下时，这几台里只要有一台的窗口显示着，就全部藏起来；全都藏着，就全部显示。看的是窗口现在显不显示，所以 AUTO-MAS 或 `window <i> hide` 藏起来的窗口，按老板键也能叫回来。
- **键被别的程序占了**：设置页那一项旁边标一个警告图标，悬停会提示换一个键，不弹窗。同一台电脑上同时开着两个根目录的管理器时，默认键会撞上，后开的那边会标出来。
- **托盘**：
  - 管理器在托盘里放一个图标。关掉管理器窗口以后，管理器留在托盘，老板键照常能用。
  - 左键点图标，把藏着的窗口都叫回来。
  - 右键菜单有「打开管理器」「退出」。退出前先把藏着的窗口都显示出来，有任务在跑就等它做完。
  - 老板键由管理器注册，所以只用 AUTO-MAS、从来不开管理器的，没有老板键。开一次管理器，让它留在托盘就有了。

## 命令行

```
modavd [--root <目录>] [--json] [--quiet] [--verbose] <命令> [参数]
```

| 命令 | 说明 |
| --- | --- |
| `list` | 全部实例和状态 |
| `info <i>` / `status <i>` | 一台实例的详细信息 / 状态 |
| `create [--index N] [--title T] [--memory 6G] [--cpu N] [--data-gb N] [--fps 30\|60] [--resolution 1080\|720] [--no-bridge]` | 新建。默认带 arm64 执行桥，第一次开机时装上 |
| `set <i> [--title T] [--memory M] [--cpu N] [--fps F] [--resolution 1080\|720] [--data-gb N] [--boss-key 组合\|none]` | 修改，下次开机生效。`--data-gb` 只能改大，游戏数据不动。`--boss-key` 是[老板键](#老板键和托盘)，马上生效 |
| `delete <i> --yes` | 删除已关机的实例，连同游戏数据 |
| `start <i> [--window \| --headless] [--timeout 300] [--no-bridge]` | 开机，默认无头；`--window` 带窗口，`--headless` 明确要求无头。等开完并做完开机后的设置 |
| `stop <i> [--force]`、`stop --all` | 关机：先让安卓正常关机，不成再 sync + kill；`--force` 是 sync + 强杀 |
| `bridge <i> install\|uninstall\|verify` | 装、卸、检查 arm64 执行桥 |
| `proxy <i> [on\|off\|test] [--server URL\|auto] [--add 包名] [--remove 包名] [--apps 包名]` | 管理器 0.4.0 起：[按应用走代理](./app-proxy)，名单里的应用走代理，其余直连 |
| `check [--memory M]` | 开机前的电脑检查 |
| `window <i> show\|hide` | 显示 / 隐藏带窗口开机的实例；无头实例没有窗口。管理器里用[老板键](#老板键和托盘) |
| `install <i> <apk>`、`shell <i> <命令>`、`adb <i> -- <参数>` | 装 APK、客体命令、adb 透传 |
| `servers`、`version`、`mcp`、`help [命令]` | |

- `<i>` 写成 `3` 或 `mas_3`（0–9，5 除外）；内存写成 `6144`、`6144M` 或 `6G`，只有 3 / 4 / 5 / 6 GB 四档，核数 2 / 4 / 6，帧率 30 / 60。
- 根目录：`--root`，没给就用环境变量 `MODAVD_ROOT`，再没有就用 `modavd.exe` 所在目录或它的上一级。
- 运行中不能切换带窗口 / 无头；先关机，再按需要的方式开机。`--window` 和 `--headless` 不能同时给。0.3.0 起没有 `restart` 命令，要重启就先 `stop` 再 `start`。
- adb 只走根目录的私有 server（`mas-avd.json` 的 `adbServerPort`），不碰默认的 5037。
- 关机先 sync 再关，不会弄出 0 字节的文件。

机读输出（`--json`）、退出码和完整的选项说明见 [ModAVDManager 的 README](https://github.com/ModAVD/ModAVDManager#命令行)。

分辨率在管理器的新建和实例设置中选择，CLI 用 `--resolution 1080|720`，MCP 的 `create_instance`、`update_instance` 用 `resolution`。新建默认 1080p（1920×1080 / DPI 280）；720p（1280×720 / DPI 240）更省资源。换档联动宽、高、DPI，保留横竖屏，下次开机生效。已有横屏或竖屏 1920×1080 配置保持 1080p；其余配置及缺字段的旧配置保持 720p，不会自动升级。DPI 不单独设置。自动化工具里的分辨率也要跟着改。

AUTO-MAS 的两档配套见 [AUTO-MAS#1837](https://github.com/AUTO-MAS-Project/AUTO-MAS/pull/1837)，覆盖新建、实例设置和没有包内 CLI 时的 Python 启动，重启保留所选档位。使用 1080p 前须更新 AUTO-MAS 及包内 CLI；不支持两档的旧 CLI 会在写盘前提示升级。旧版 AUTO-MAS 的 Python 回退仍会固定写回 720p。

## MCP

```
modavd mcp --root D:\ModAVD
```

工具：`list_instances`、`get_instance`、`check_host`、`create_instance`、`update_instance`、`delete_instance`、`start_instance`（带进度）、`stop_instance`、`set_window_visible`、`shell`、`install_apk`。管理器 0.4.0 起还有 `get_app_proxy`、`set_app_proxy`（[按应用走代理](./app-proxy)）。

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
