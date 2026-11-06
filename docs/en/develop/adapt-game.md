# Adapting a new game

To get a game that currently will not start or runs badly working on ModAVD, work in the order below. Adaptation has no separate code folder: after you find the cause, the change lands in one place, either the execution bridge, the emulator itself or the automation script. Specific cases investigated before are in [How to investigate common problems](./troubleshooting).

## Preparation

- Use the latest ModAVD, create a new dedicated instance, and log in with a test account. Adapting a game means installing, uninstalling and force-killing over and over, so do not use the instance you normally use to run games unattended. Old versions lack a lot; for example, 0.32 does not have the arm64 execution bridge yet.
- For adb, use the private port from `mas-avd.json`: `adb -P <port> -s emulator-<console port> ...`. Commands below that need root are written as `shell su 0 <command>`.
- The hardware is the same as for [testing on real games](./testing#hardware), plus disk space for this game.

## Step 1: Find out about the game {#step1}

- Package name, channel (official server, Bilibili server, the various app stores) and game version. Find the package name with `shell pm list packages | findstr <keyword>`.
- Whether it is arm64-only: `shell dumpsys package <package> | findstr primaryCpuAbi`. `arm64-v8a` has to go through translation; `x86_64` or `x86` runs natively.
- Whether it uses app hardening or anti-cheat: unpack the APK and look at the library names under `lib/`.
- Whether an automation script already exists (the MAA series, M9A, SRC and the like). This decides whether the game can enter the pre-release regression tests later.

## Step 2: Reproduce and collect evidence {#step2}

- Before launching, run `logcat -c`, then `logcat -b all -v threadtime > 启动.txt`, then launch the game, and stop once it reproduces.
- If it crashed, take the newest file in `/data/tombstones/`: `shell su 0 ls -t /data/tombstones`.
- The emulator logs are in `logs\` in the root folder. **收集问题信息** (Collect a problem report) packs the logs together.
- Look mainly at these:
  - `Fatal signal`: which library and which thread it crashed in;
  - `FATAL EXCEPTION`;
  - `ANR in`;
  - `VK_ERROR` and `DEVICE_LOST` in the emulator log.
- Note exactly which step it gets stuck on, and whether it happens every time or only sometimes.

## Step 3: Find what can be changed, by cause {#step3}

Try approaches that need no recompiling first, and settle the direction before you touch code.

| Cause | Try first (no recompiling) | Where to change it if you really have to |
|---|---|---|
| arm64-only; crashes in the translation layer or exits right after launch | Make the execution bridge take effect for it temporarily: first make sure the instance has the bridge installed, then run `shell su 0 setprop modavd.gate.target <package>`, then cold-start the game. This property replaces the whole list, is not persistent, and is gone when the guest restarts. Check logcat for `shim-ctor OK` and whether the game gets through | If it gets through: send a PR that adds the package name to `kDefaultGateTargets` in `bridge/companion/jni/native_to_guest_companion.cc`. If it still fails: this is the deep end of the translation layer and the bridge; open an issue with the tombstone and the launch logcat |
| Graphics: black screen, garbled picture, Vulkan errors, device lost | Two environment-variable switches that are off by default (`ANDROID_EMU_VK_HIDE_REBAR=1`, `ANDROID_EMU_VK_ASTC_BC3=1`; see [How ModAVD differs from the official emulator](../guide/changes#graphics)); change the resolution in instance settings (1080p / DPI 280 or 720p / DPI 240, effective at the next boot); while investigating, you can uninstall the bridge with `modavd bridge <index> uninstall` to compare, and uninstalling the bridge restores the GL transport to what it was | The emulator's gfxstream patches; see [the emulator itself](./emulator) |
| Stutter and frame drops | Use [How to investigate stutter and frame drops](./performance) to find out which thread and which stage the bottleneck is in; then compare a few existing switches: GL transport asg / pipe, `ANDROID_EMU_VK_HIDE_REBAR=1`, and the Vulkan feature flags | If the bottleneck is the graphics round trip: change the emulator's gfxstream. If it is in translation: open an issue to discuss it. If it is in the game's own main thread: accept it, or lower the quality |
| The game detects the emulator or root, or kicks you out after you enter the game | — | Do not do anything. ModAVD does not bypass the game's protection and does not change game files. Note the exact message text and open an issue describing the situation |
| Network request timeout, hot update fails | Switch networks; check the game's data folder for 0-byte files (left behind by a hard kill) | Usually not something to change in ModAVD |
| The game runs, but the automation script cannot recognize the screen or taps inaccurately | Check the script's screenshot method, input method and resolution settings | Change it on the script side (for example, add a resource overlay for ModAVD to it), not in ModAVD |

## Step 4: Delivery {#step4}

- First open an issue titled "Adapt: \<game name\> (\<channel\>)", describing what you found in the first three steps and how you plan to change it.
- Adding to the bridge list: the PR changes only `kDefaultGateTargets` and comes with this evidence:
  - the launch logcat before and after adding to the list;
  - a game that was already on the list (*Onmyoji*) still works as usual;
  - a game not on the list still works as usual, and the log has the line saying the changes were reverted.

  The maintainer rebuilds the payload and pins its hash; it ships with the next version.
- Graphics changes: submit patches as described in [the emulator itself](./emulator#patches).
- You are not asked to run the full set of regression tests; the maintainer builds and tests on their own machine.

## Step 5: After it works {#after}

- Open an issue in the [ModAVD repository](https://github.com/ModAVD/ModAVD/issues). Include the output of **复制配置信息** (Copy configuration info), the game, channel, version, how you got it running, and roughly what frame rate it gets.
- If the game has an automation script and tasks that do not use many resources, the maintainer will add it to the pre-release regression tests and record a frame-rate baseline.

## Rules

Use a test account; do not modify game files or bypass the game's protection; do not pull gacha or buy anything; stop when you hit an update prompt; sync before you shut down the emulator.

## Suggested models

- Steps 1 and 2, and the classification in step 3 (reading logcat and the emulator logs): Sonnet 5.5 or GPT-6.1 Sol;
- Finding the root cause in the translation layer, the bridge or graphics problems: Opus 5.5 or GPT-6 Astra, with reasoning set high.
