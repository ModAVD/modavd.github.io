# The manager and CLI

**What you change**: the [ModAVDManager](https://github.com/ModAVD/ModAVDManager) repository.

- The manager `ModAVD.exe`: the interface for people, with instance cards, start and stop, create, settings, screen view and logs;
- The CLI `modavd.exe` and its MCP server: for scripts, AUTO-MAS and AI assistants.

The code structure (which part of AUTO-MAS's code each package under `internal/` corresponds to), the full CLI documentation, the machine-readable output and the exit codes are in the repository's [README](https://github.com/ModAVD/ModAVDManager/blob/main/README.en.md). For an introduction for users, see [Components: the manager and CLI](../components/manager).

## Environment

- Go **1.26.5** (the toolchain in `go.mod`), with `GOTOOLCHAIN=local`, standard library only;
- PowerShell 7;
- The pages are in `internal/ui/web/`, in plain JS / CSS with no front-end build step. To change styles, start a fake backend with `ModAVD.exe --dev`; you do not need to start the emulator.

## Hardware

- Only building, running unit tests, and changing the interface with `--dev`: 4 cores, 8 GB of RAM and 2 GB of disk are enough;
- Testing on a real instance means starting one instance with no games installed:

| | Recommended | Minimum |
|---|---|---|
| CPU | 8 cores, 16 threads | 4 cores, 8 threads |
| RAM | 16 GB | 16 GB (8 GB for only building and unit tests) |
| Free disk space | 30 GB | 20 GB |

## Build

```powershell
pwsh -NoProfile -File build.ps1          # -> out\ModAVD.exe, out\tools\modavd.exe
pwsh -NoProfile -File build.ps1 -Test    # run go vet and go test first
```

It uses `-trimpath -buildvcs=false` and does not write the version number with `-X`. The same source gives byte-identical results on any machine and in any directory, so you can check against the published hash.

## Verification

- `gofmt -l .` prints nothing, and `go vet ./...` and `go test ./...` pass;
- Some tests run AUTO-MAS's original logic with Python 3 and compare it with Go's output byte by byte, so Python 3 must be installed: point the environment variable `MODAVD_TEST_PYTHON` at it; if it is not set, `python` on PATH is used, and if that is not found, those comparison tests are skipped;
- Testing on a real instance needs a ModAVD root folder: extract the release package, then fetch the Google components;
- Use newly created instances and a private adb port for these tests;
- Give root folders for development and testing their own port range: when the same computer also has a root folder in daily use (for example the one AUTO-MAS uses), write `"portBase": 21000` in the `mas-avd.json` of the development root folder. Its instances then count their ports from 21000 and do not fight with the instances of the same number over there. This needs a manager with [ModAVD/ModAVD#75](https://github.com/ModAVD/ModAVD/issues/75).
  - Ports: console = `portBase` + 10 × index, adb is 1 more, gRPC 2 more; the index is still 0–9 without 5. `portBase` can only be 20000 (the default) or a multiple of 100 between 1100 and 65400. With two development root folders open at the same time, give the second another range, for example 23000. Before you pick one, check that no other program uses that range (Syncthing, for example, takes 22000 by default).
  - Also set `adbServerPort` and `scriptAdbServerPort`. They cannot be 20049 or 20050, nor fall on the ports of an instance in the 20000 range. Otherwise the manager does not start or create instances, and does not start or connect to an adb server.
  - Shut down every instance of the root folder before you change it. AUTO-MAS does not know `portBase` yet, so do not add a root folder that sets it to AUTO-MAS.
- Do not turn on the live-test switch (`MODAVD_TEST_LIVE=1`) against a root folder that holds important instances.

On PRs, CI runs:

- Windows: the full set: the format check, `go vet`, `go test`, `build.ps1`, the privacy scan and the author check, plus a cross `go vet` with `GOOS=darwin GOARCH=arm64` and with `GOOS=linux GOARCH=amd64`;
- macOS and Linux: only `go vet` and `go test` on the matching system. They do not build a releasable program or start an emulator.

## Platform layer

The manager is mainly for Windows x64 today. The platform-specific parts are split into two places:

- `internal/win`: the Windows operations for processes, command lines, ports, starting outside the process tree, file locks and windows. These files carry `//go:build windows`, so other systems do not compile them;
- `internal/root/platform.go`: the platform table. The `Platform` struct gives one fixed row of values per host system and architecture: the file names of the emulator, adb and QEMU (including the headless one), the subdirectory QEMU lives in, the suffix of the package file name, the MirrorChyan system and architecture ids, the guest ABI and architecture and the target API, and the system image directory and name. `CurrentPlatform()` currently has three rows, Windows x64, macOS arm64 and Linux x64; any other combination returns an empty table, `Supported()` is `false`, and it does not inherit the Windows names. Shared code looks things up in this table; do not hard-code `.exe` or x86_64 in it.

The table covers only file names and identifiers. The rules for the root folder layout, ports and instance paths are not in it (they are in the other files of `internal/root`).

The non-Windows side lives in files such as `*_other.go` in each package (the host-related part is in `internal/host`). Most of it is first a stub that returns `Unsupported`, and commands report `unsupported` (exit code 4) honestly; for example, only Windows has a component list. To add a new platform you roughly need to:

1. Add its row to the platform table (or change the existing one) and add tests for it;
2. Write the Windows-only operations (those in `internal/win` and the stubs in each package's `*_other.go`) for that platform, separated by build tags, replacing the stubs;
3. Do component download, package update, packaging and signing once per platform;
4. Run `go vet` and `go test` in CI on that system.

The overall plan and who takes which platform are in [ModAVD/ModAVD#27](https://github.com/ModAVD/ModAVD/issues/27); how the macOS platform layer is done is in [ModAVD/ModAVD#68](https://github.com/ModAVD/ModAVD/issues/68).

## Contract

The envelope of the `--json` output, the error codes and the `protocol` version are what AUTO-MAS depends on. Adding fields is fine. To change a meaning or remove a field, add one to `Protocol` in `internal/buildinfo` and open an issue first.

When a script needs the ports of an instance, take them from `ports` and `serial` in `list` / `info` / `status` instead of computing 20000 + 10 × index: a root folder that sets `portBase` is not in the 20000 range. `port_base` in `list` is the port range the root folder actually uses; older managers do not have it (they only use the 20000 range).

## Versioning

The manager has been numbered and released separately since v0.1.0 (the two exe files of v0.1.0 are byte-identical to those in the ModAVD 0.36.0 package). When the ModAVD package is released, it pins the manager version and hash at that time, and the copy inside the package changes together with the package. The manager does not update itself: from 0.2.0, `modavd update` updates the whole ModAVD root folder (from GitHub or MirrorChyan, going online only when you run it by hand), and a manager downloaded on its own has to be replaced by hand.

## Suggested models

- Interface and ordinary features: Sonnet 5.5 or GPT-6.1 Sol;
- Boot flow, concurrency and locks, process management and package updates, which are things that easily hide subtle problems and involve security: Opus 5.5 or GPT-6 Astra to write or review.
