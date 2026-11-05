# Areas and common requirements

ModAVD is the AOSP Android Emulator plus a set of patches, with WHPX acceleration and gfxstream rendering, and a few components written by the project. The areas below are sorted by development area. Each area's page says what hardware and environment it needs, how to verify, and which model to suggest when you use AI tools (both Claude and GPT are listed).

For how to take part (credit, licensing, how to submit), [Contributing to ModAVD](./) is authoritative.

## Repositories and areas

| Area | Repository / directory | Main language | Difficulty | What GitHub CI can verify | Suggested models (Claude / GPT) |
|---|---|---|---|---|---|
| [Emulator](./emulator) (qemu / gfxstream / crashpad patches) | `patches/` and `manifests/` of [ModAVD](https://github.com/ModAVD/ModAVD); the patched source is in [ModAVDQemu](https://github.com/ModAVD/ModAVDQemu), [ModAVDGfxstream](https://github.com/ModAVD/ModAVDGfxstream) and [ModAVDCrashpad](https://github.com/ModAVD/ModAVDCrashpad) (`release/0.36`) | C / C++ | High | Only replays the patches and compares the source tree; does not build | Opus 5.5 / GPT-6 Astra, with high reasoning effort |
| [arm64 execution bridge](./bridge) | `bridge/` of ModAVD | C++ (NDK) | High | Nothing | Opus 5.5 / GPT-6 Astra |
| [The manager and CLI](./manager) | [ModAVDManager](https://github.com/ModAVD/ModAVDManager) | Go; the pages are plain JS / CSS | Medium | Unit tests, build, reproducible-build check | Sonnet 5.5 / GPT-6.1 Sol; Opus 5.5 / GPT-6 Astra for the boot flow, concurrency and package updates |
| [The host IME](./ime) | [ModAVDHostIME](https://github.com/ModAVD/ModAVDHostIME) | Java (Android) | Medium to low | Protocol self-test, APK build, release check | Sonnet 5.5 / GPT-6.1 Sol |
| [Bundled scripts](./package) | `package/` of ModAVD | PowerShell, batch | Medium to low | Privacy scan | Sonnet 5.5 / GPT-6.1 Sol |
| Pre-release regression tests (end-to-end tests) | [ModAVDE2E](https://github.com/ModAVD/ModAVDE2E) | PowerShell, Python | Medium | Syntax parsing, privacy scan; the regression run itself is not run | Sonnet 5.5 / GPT-6.1 Sol |
| [Documentation and this site](./docs) | This site's repository [modavd.github.io](https://github.com/ModAVD/modavd.github.io), and the READMEs of the repositories | Markdown | Low | Builds the site, checks dead links, privacy scan | Sonnet 5.5 / GPT-6.1 Terra; Haiku 5.5 / GPT-6 Luna for mechanical changes |
| [AUTO-MAS integration](./automas) | [AUTO-MAS](https://github.com/AUTO-MAS-Project/AUTO-MAS) | Python, front end | Medium | AUTO-MAS's own CI | Sonnet 5.5 / GPT-6.1 Sol; Opus 5.5 / GPT-6 Astra for review |
| [Testing on real games, compatibility reports](./testing) | [Open an issue](https://github.com/ModAVD/ModAVD/issues) with the configuration output | — | Low to medium | Nothing | Sonnet 5.5 / GPT-6.1 Terra for reading logs; Haiku 5.5 / GPT-6 Luna for tidying up |
| [Making a new game work](./adapt-game) (won't start, runs poorly) | Once the cause is found, it ends up in the bridge, the emulator itself or the automation scripts | Depends on the cause | Medium to high | Nothing | Sonnet 5.5 / GPT-6.1 Sol for sorting logs; Opus 5.5 / GPT-6 Astra for root causes in the translation layer and graphics |

## Requirements for all areas

- **System**: Windows 11 x64 (Windows 10 is tested less, and reports are welcome), virtualization turned on in the BIOS, and Windows Hypervisor Platform (WHPX) turned on.
- **GPU**: Install a GPU driver with Vulkan (a discrete GPU or a fairly recent integrated GPU). Without a usable GPU, only software rendering is possible, and games will use up the CPU.
- **CPU, RAM, disk**: These differ a lot by area. What matters is whether you build the emulator itself, run instances and install games. They are written under "Hardware" on each area's page. The minimum configuration runs but is slow; the recommended one is what the maintainer finds comfortable.
- **Common tools**:
  - PowerShell 7 (development scripts); the bundled scripts must also work on Windows PowerShell 5.1;
  - Python 3.12;
  - Git for Windows.
- **Shutting down the emulator**: Run `adb -s <device> shell sync` first, then `adb -s <device> emu kill`, or use the shutdown of the manager or the CLI. Without sync, files the guest just wrote can become 0 bytes.
- **adb port**: Do not use the adb server on the default port 5037. It fights with the adb that other emulators bring along. Use the private port in `mas-avd.json` in the ModAVD root folder.
- **Test data**: Use newly created instances and test accounts. Do not run tests such as force-kill on an instance logged in to your main account.
- **Submitting**:
  - Open PRs from your own fork;
  - sign with your own name or a pseudonym;
  - CI for external PRs only runs after the maintainer approves it.
- **Using AI tools**: You may. The AI must test the change itself: build, run the unit tests, and if it can start an instance, start one and look at the result. State in the PR what was tested and with what result. Do not give accounts, keys or private paths to AI tools. The rules for AI tools are in [AGENTS.md](https://github.com/ModAVD/ModAVD/blob/main/AGENTS.md) at the root of the ModAVD repository; Codex, Claude Code and others read it on their own. See [Using AI tools](./ai).

### What it takes to run an instance

Verification in several areas needs a running instance. The numbers come from ModAVD's documentation and from measurements on the maintainer's machine:

- **CPU**: x86_64, with virtualization turned on in the BIOS (Intel VT-x / AMD SVM). Android can use at most half of the computer's logical processors as virtual CPUs, so an instance with 4 cores needs 8 threads, and 6 cores need 12 threads.
- **RAM**: Instance memory can be 3 / 4 / 5 / 6 GB (AUTO-MAS defaults to 6 GB). At boot the computer needs about another 1.5 GB free, and the emulator itself takes about 0.6–0.75 GB more.
- **Disk**: On an NTFS drive. The components and the emulator itself take about 5 GB together (6.5 GB must be free when fetching the Google components). The drive of each instance needs 10 GB or more free on its first boot; a new instance with no games installed actually takes only about 1.1 GB. An instance with games installed takes tens of GB; see [Testing on real games](./testing).

## What is in progress

Look here before you start, to avoid collisions:

- AUTO-MAS plans to switch to the `modavd` CLI for managing instances and updating the package (the changes go to the AUTO-MAS repository);
- ModAVDManager: v0.1.0 is released; v0.2.0 (finishes initialization in the background when creating an instance, `modavd update`) is not released yet; 0.3.0 (components and problem reporting, platform layer) is being worked on in main;
- ModAVDHostIME: v1.0.0 is released.

If what you want to do overlaps with these, say so first in an issue in the ModAVD repository (issues for every component are there).
