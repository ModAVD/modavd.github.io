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
- Some tests run AUTO-MAS's original logic with Python 3 and compare it with Go's output byte by byte, so Python 3 must be installed;
- Testing on a real instance needs a ModAVD root folder: extract the release package, then fetch the Google components;
- Use newly created instances and a private adb port for these tests;
- Do not turn on the live-test switch (`MODAVD_TEST_LIVE=1`) against a root folder that holds important instances.

CI runs the format check, `go vet`, `go test`, `build.ps1`, the privacy scan and the author check on PRs.

## Contract

The envelope of the `--json` output, the error codes and the `protocol` version are what AUTO-MAS depends on. Adding fields is fine. To change a meaning or remove a field, add one to `Protocol` in `internal/buildinfo` and open an issue first.

## Versioning

The manager has been numbered and released separately since v0.1.0 (the two exe files of v0.1.0 are byte-identical to those in the ModAVD 0.36.0 package). When the ModAVD package is released, it pins the manager version and hash at that time, and the copy inside the package changes together with the package. The manager does not update itself: from 0.2.0, `modavd update` updates the whole ModAVD root folder (from GitHub or MirrorChyan, going online only when you run it by hand), and a manager downloaded on its own has to be replaced by hand.

## Suggested models

- Interface and ordinary features: Sonnet 5.5 or GPT-6.1 Sol;
- Boot flow, concurrency and locks, process management and package updates, which are things that easily hide subtle problems and involve security: Opus 5.5 or GPT-6 Astra to write or review.
