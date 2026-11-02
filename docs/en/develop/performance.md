# Investigating stutter and frame drops

This is how the problems in *Onmyoji*, *Honkai: Star Rail* and *Arknights: Endfield* were found. Developers' machines are usually well equipped, so what is worth investigating is what adding cores or memory does not fix.

## 1. First confirm what you are measuring

- Confirm that you really reached the screen you want to measure. Measure menus, loading screens, battles and the open world separately.
- For battles, cut out each fight using the automation script's log and compute from that. With a 30-second window, menus and loading screens are mixed in, and what you compute is not the battle frame rate.
- Note how many other emulators are open on the same machine. With too many open, all cores drop their clock speed and the frame rate falls across the board, so read the conclusion together with this number.
- When comparing, use the same scene, the same graphics quality and the same instance configuration.

## 2. Measure the frame rate

- In the guest logcat, `EGL_emulation` prints a line `app_time_stats: avg=… min=… max=… count=…` every second.
- Take only the lines of the game's main process: the one whose parent is `zygote64` and whose name is the package name.
- Add up `count` and divide by the number of seconds to get the frame rate. `max` is the slowest frame in that second.

## 3. See whether the bottleneck is in the guest or the host

**Guest**: `shell top -H -p <game pid>` shows the CPU of each thread. Look mainly at the main thread (called `UnityMain` in Unity games) and the render thread.

- One thread uses up a whole core while the other cores are mostly idle: a single-thread bottleneck. Adding cores or memory does not help.
- The main thread is very busy, but the frame rate does not change with the CPU frequency: it is most likely waiting (for locks, memory access, replies from the host), not computing.

**Host**: Use Task Manager or Process Explorer to see how much the virtual CPU threads and the render thread of the qemu process each take, then look at the GPU 3D usage. If the render thread is full, the bottleneck is on the graphics side.

## 4. Dig deeper

- What the main thread is doing and waiting for: in the guest, record for 20 to 30 seconds with `simpleperf record -g -t <thread id>` and look at the hot spots and call chains (for example, many `futex` waits).
- Stuck or frozen picture: `shell su 0 debuggerd -b <pid>` gets the stacks of all threads, so you can see who is waiting for whom.
- Graphics round trips: if the render thread spends most of its time on synchronous round trips between the guest and the host, see whether they can be batched or the synchronous calls replaced.
- Slowest at loading and right after entering a battle: look at the guest's memory swap-out and disk reads and writes. The main thread is most likely waiting then, not computing.

## 5. Write down the conclusion

Write down which scene, how many frames, which thread was full, which switch you changed, and the before and after numbers. Run the comparison in alternating rounds, several times, and check whether the difference between groups is larger than the fluctuation within a group. One run each does not count.

## Examples found earlier

| Game | Symptom | Cause found | Result |
|---|---|---|---|
| *Onmyoji* | Courtyard 44–48 fps; menus about 44 fps, and the loading screen when entering or leaving a battle stalls for about 1 second | Courtyard: GL transport goes through a pipe. Menus and loading screens: the game's main thread is fully loaded in user mode, running translated arm64 code; the rest of the guest's CPU is 70% idle, and the host render thread is only at 20–30% | After switching GL transport to asg, the courtyard runs at 60 fps. Menus and loading screens are translation overhead, and adding cores does not help |
| *Honkai: Star Rail* | Battles 40–48 fps; the first 30 seconds of the first battle only 7–16 fps | Battles: the main thread and the render thread each use up one core and are limited by single-core speed; going to 8 cores or adding memory does not raise it. First battle: the main thread is only at 31%, waiting for loading and memory swap-out | The battle frame rate can only be raised through translation efficiency, single-core frequency or lower graphics quality; for the first-battle stretch, swap-out has to be reduced |
| *Arknights: Endfield* | While running tasks 12.8 fps; title screen 14.6 fps | Running tasks: the render thread spends 79% of its time on synchronous round trips between the guest and the host, with about 159 descriptor allocations per frame. Title screen: host-visible video memory (ReBAR) made uploads take the slow path | After turning on Vulkan batched descriptor updates, 30.5 fps; after setting `ANDROID_EMU_VK_HIDE_REBAR=1`, the title screen runs at 60.7 fps |
