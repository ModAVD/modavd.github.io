# The manager and CLI

Since ModAVD 0.36.0 the package includes two management programs. Their source is in [ModAVDManager](https://github.com/ModAVD/ModAVDManager):

| Program | Location | Who uses it |
|---|---|---|
| The manager `ModAVD.exe` | Package root | People: instance cards, start and stop, create, settings, screen view, logs |
| The CLI `modavd.exe` | `tools\` | Scripts, AUTO-MAS and AI assistants; `modavd mcp` is an MCP server |

Instance files and `mas-avd.json` are written the same way as in AUTO-MAS, so instances created by either one can be started by the other.

## The manager

Double-click `ModAVD.exe` in the package root. It starts a local server that listens only on 127.0.0.1, then opens a window in Edge app mode (Edge comes with Windows 10 / 11); if Edge is not found, it uses the default browser. The page is embedded in the program and does not use the network.

- Features: instance cards (with a screen thumbnail when the instance is online), start and stop (with progress), create, settings, delete, PC check, activity panel, screen view (a click is a tap; Back / Home / Recents), logs, install APK, open folder; light / dark / follow system.
- One server runs per root folder; double-clicking again only reopens the window. The log is at `<root>\logs\modavd-ui.log`.
- After you close the window, it waits for the running tasks to finish before it exits.

## The CLI

```
modavd [--root <dir>] [--json] [--quiet] [--verbose] <command> [args]
```

| Command | Description |
| --- | --- |
| `list` | All instances and their status |
| `info <i>` / `status <i>` | Detailed information / status of one instance |
| `create [--index N] [--title T] [--memory 6G] [--cpu N] [--data-gb N] [--fps 30\|60] [--no-bridge]` | Create an instance. It includes the arm64 execution bridge by default, installed on the first boot |
| `set <i> [--title T] [--memory M] [--cpu N] [--fps F] [--data-gb N]` | Change settings; they take effect on the next start. `--data-gb` can only grow the disk; game data is untouched |
| `delete <i> --yes` | Delete a shut-down instance together with its game data |
| `start <i> [--window] [--timeout 300] [--no-bridge]` | Start, then wait until boot is complete and the post-boot setup is done |
| `stop <i> [--force]`, `stop --all` | Shut down: first ask Android for a clean shutdown; if that fails, sync + kill. `--force` is sync + force-kill |
| `restart <i> [--window] [--timeout 300] [--force] [--no-bridge]` | Shut down, then start |
| `bridge <i> install\|uninstall\|verify` | Install, uninstall or check the arm64 execution bridge |
| `check [--memory M]` | PC check before starting |
| `window <i> show\|hide`, `install <i> <apk>`, `shell <i> <command>`, `adb <i> -- <args>` | Window, install an APK, guest command, adb passthrough |
| `servers`, `version`, `mcp`, `help [command]` | |

- Write `<i>` as `3` or `mas_3` (0–9, except 5). Write memory as `6144`, `6144M` or `6G`; there are only four levels: 3 / 4 / 5 / 6 GB. Cores are 2 / 4 / 6, frame rate 30 / 60.
- Root folder: `--root`; if it is not given, the environment variable `MODAVD_ROOT`; otherwise the folder containing `modavd.exe` or its parent.
- adb uses only the root folder's private server (`adbServerPort` in `mas-avd.json`) and never touches the default 5037.
- Shutdown syncs first and then stops, so it does not leave 0-byte files behind.

For machine-readable output (`--json`), exit codes and the full option reference, see [the ModAVDManager README](https://github.com/ModAVD/ModAVDManager/blob/main/README.en.md#command-line).

## MCP

```
modavd mcp --root D:\ModAVD
```

Tools: `list_instances`, `get_instance`, `check_host`, `create_instance`, `update_instance`, `delete_instance`, `start_instance` (with progress), `stop_instance`, `set_window_visible`, `shell`, `install_apk`.

To register it in Claude Code (in PowerShell, `--` must be quoted, or it gets swallowed):

```powershell
claude mcp add --transport stdio --scope user modavd '--' D:\ModAVD\tools\modavd.exe mcp --root D:\ModAVD
```

Or in a project's `.mcp.json`:

```json
{"mcpServers": {"modavd": {"command": "D:\\ModAVD\\tools\\modavd.exe", "args": ["mcp", "--root", "D:\\ModAVD"]}}}
```

## Downloading separately

The manager has its own version number (from v0.1.0) and is released separately on [ModAVDManager Releases](https://github.com/ModAVD/ModAVDManager/releases).

- Normally just use the copy that comes in the ModAVD package; it is replaced together with the package when you upgrade.
- A separately downloaded package can go in any folder; point it at the ModAVD root folder with `--root` or `MODAVD_ROOT`. Do not extract it into the ModAVD root folder and overwrite the files from the package.
- After downloading, check the hash against `SHA256SUMS.txt` in the release.
