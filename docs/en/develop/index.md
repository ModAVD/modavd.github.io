# Contributing to ModAVD

ModAVD has only one maintainer, so replies can take a few days. For bigger changes, please open an issue to discuss them first. A big PR that was not discussed may not be merged.

To see what environment and hardware each area needs, and which models to pick when you use AI tools, see [Areas and common requirements](./overview).

Issues, PRs, comments and commit messages can be in English or Chinese.

## Where to start, by what you know

| What you know | What you can do | What you need | Start here |
|---|---|---|---|
| No coding, you play games | Run games on your own computer and report whether they run and how the frame rate is | A Windows 10 / 11 computer that meets the [requirements](../guide/#requirements) | [Testing on real games and compatibility reports](./testing); for the games already tested, see the [README](https://github.com/ModAVD/ModAVD/blob/main/README.en.md#tested-games) |
| Writing, translating | Fix mistakes, translate pages and READMEs that exist only in Chinese, proofread the English | A browser is enough; previewing locally needs Node.js 24 | [Documentation and this site](./docs); [docs issues](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3Aarea%3Adocs) |
| Go | The manager and CLI: creating instances, starting and stopping, fetching components, the interface (plain JS / CSS pages), including an English version of the interface | Go 1.26 and Windows; building and unit tests need only 4 cores and 8 GB of RAM | [The manager and CLI](./manager); [manager issues](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3Aarea%3Amanager) |
| Java (Android) | The host IME: text typed on the computer goes straight into Android | A JDK and two Android SDK components (about 1 GB in all) | [The host IME](./ime); [IME issues](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3Aarea%3Ahostime) |
| PowerShell, Python | The pre-release regression (end-to-end tests), bundled scripts, CI checks | PowerShell 7, Python 3.12 | [Bundled scripts](./package), [ModAVDE2E](https://github.com/ModAVD/ModAVDE2E); [regression issues](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3Aarea%3Ae2e) |
| C / C++ (QEMU, graphics, Vulkan, ARM translation) | Patches to the emulator itself, the arm64 execution bridge | Building the emulator yourself needs about 140 GB of disk, and one build takes about 1.5 hours on 16 cores; you do not have to build it to send a patch | [The emulator itself](./emulator), [the arm64 execution bridge](./bridge) |
| macOS, Linux | Bring ModAVD to other platforms: the manager's platform layer, packaging, signing | A computer on that platform | [#27 Multi-platform plan](https://github.com/ModAVD/ModAVD/issues/27); [macOS](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3Aplatform%3Amacos) and [Linux](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3Aplatform%3Alinux) issues |

If this is your first time, look at the issues labeled [good first issue](https://github.com/ModAVD/ModAVD/issues?q=is%3Aissue%20is%3Aopen%20label%3A%22good%20first%20issue%22): they are small, need no emulator build, and have an English summary in the description.

## What is needed most: try it on your computer

The maintainer has tested on only one computer: Windows 11, AMD CPU, NVIDIA discrete GPU. What is missing most is testing on these configurations: Intel CPU, AMD or Intel GPU, laptops with dual GPUs, Windows 10, and 16 GB of RAM.

1. Install by following [Installation](../guide/install), create an instance in the manager, start it, install a game you play and play for a while. If you use AUTO-MAS, add the instance there and run one round of daily tasks.
2. Click **复制配置信息** (Copy configuration info) under **设置 → 组件与问题反馈** (Settings → Components and feedback) in the manager, or run `tools\modavd.exe report-config`. Open an issue in the [ModAVD repository](https://github.com/ModAVD/ModAVD/issues) and paste it. Fill in the last three lines and add one sentence on whether it runs. In packages 0.38.1 and earlier this was `复制配置信息.bat` in the package root.

This output does not contain your user name, computer name, full paths or game accounts, so you can post it publicly as it is. For details, see [Testing on real games and compatibility reports](./testing).

## Reporting problems

- Problems with every component go to the [Issues](https://github.com/ModAVD/ModAVD/issues) of the ModAVD repository: the emulator itself, and also the manager and CLI, the host IME, this site and the pre-release regression tests. Pick the component when you open the issue.
- Attach the problem report made by **收集问题信息** (Collect a problem report), in **设置 → 组件与问题反馈** in the manager or with `tools\modavd.exe collect-info`. For what you can post publicly and how to send crash dumps privately, see [Reporting problems](../guide/feedback).
- Before you paste logs, replace `C:\Users\<your user name>` in paths with `%USERPROFILE%`.
- Problems with AUTO-MAS's interface, tasks or scheduling belong to [AUTO-MAS](https://github.com/AUTO-MAS-Project/AUTO-MAS/issues).
- Do not report security problems publicly. Send an e-mail to qiyinxi@foxmail.com.

## Changing documentation and code

- Say so in the issue before you start. If an issue is already assigned to someone, that person is working on it.
- Open PRs from your own fork. CI for external PRs only runs after the maintainer approves it.
- If something on this site or in the READMEs of the repositories is wrong or unclear, send a PR directly. See [Documentation and this site](./docs).
- Bundled scripts, `package/`: you can send PRs, and once merged they ship with the next release. For the rules to follow, see [Bundled scripts](./package).
- The arm64 execution bridge, `bridge/`: open an issue to discuss changes first. It directly affects whether games can start, so every release needs real game regression runs on an instance with the bridge installed.
- The manager and CLI are in [ModAVDManager](https://github.com/ModAVD/ModAVDManager), the host IME is in [ModAVDHostIME](https://github.com/ModAVD/ModAVDHostIME), and the pre-release regression tests (end-to-end tests) are in [ModAVDE2E](https://github.com/ModAVD/ModAVDE2E). Take PRs there, but issues still go to the ModAVD repository. The rules for credit and licensing are the same as on this page.
- `patches/`, `manifests/` and `release/` in the ModAVD repository are exported by the release tool (`tools/pubrel/`). PRs do not change them directly. If you find a problem, open an issue first.
- The release and build tools `tools/` and the CI checks `scripts/` in the ModAVD repository (the release tool uses this copy too): open an issue to discuss changes first.
- New or changed workflows: pin third-party actions to a full 40-character commit SHA, do not use `pull_request_target`, and do not use self-hosted runners. `mirrorchyan_*.yml` is maintained by MirrorChyan itself, so keep it as it is.
- Build CI is not accepted. Source plus build output is about 124 GB, a full build on a 16-core machine takes about 1.5 hours, and GitHub's free machines cannot do that. A self-hosted runner would let external PRs run arbitrary commands on that machine. To help verify the build, build on your own computer by following [Building from source](./build) and post the result in an issue.

To submit emulator patches, see [Emulator](./emulator).

## Credit and licensing

- Sign with your own name or a pseudonym, and use a GitHub noreply address as your e-mail (`<id>+<login>@users.noreply.github.com`, which you can see in GitHub's e-mail settings). Do not write `Co-authored-by`. Your credit is kept after your change is accepted, and the release notes will thank you.
- Your changes come in under the license of the files they change; see [Licenses and source code](../guide/license). The copyright line of a new file carries your name or pseudonym. You do not need to sign a CLA, and `Signed-off-by` is optional.
- You may use AI tools, but the AI must test the change itself, and you are responsible for it. The rules for AI tools are in [AGENTS.md](https://github.com/ModAVD/ModAVD/blob/main/AGENTS.md) at the root of the ModAVD repository; Codex, Claude Code and others read it on their own. See [Using AI tools](./ai).
- General fixes may later be sent to the Google upstream (AOSP, google/gfxstream). Upstream requires the author to sign the Google CLA personally. You will be asked first, and if you do not want to, the change stays in ModAVD only.
- For image and icon changes, open an issue first with the source and the license. Fan art and images with an unclear source are not accepted.

## When you test yourself

- Shut down instances in AUTO-MAS or the manager when you can. In your own script, run `adb -s <device> shell sync` first, then `adb -s <device> emu kill`. Without sync, files the game just wrote can become 0 bytes.
- For force-kill tests, use a newly created instance and a test account, not an instance logged in to your main account.
- Do not use adb on the default port 5037. It fights with the adb that other emulators bring along over the same server. Take the port from `scriptAdbServerPort` in `mas-avd.json` (default 20049), the same one AUTO-MAS gives to scripts.

## Other

If you want to help sort issues (reproduce, merge duplicates, add labels), ask the maintainer for Triage permission.
