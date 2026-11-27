# Investigating common problems

Below are problems that were actually investigated before. Each entry gives the symptom, how it was investigated, what was found, and the result. For a new problem, you can usually find a similar way to investigate here. For stutter and frame drops, see also [Investigating stutter and frame drops](./performance).

## Commonly used ways to collect evidence

- **What a thread is doing**:
  - `top -H -p <pid>` shows the CPU of each thread;
  - `/proc/<pid>/task/<tid>/stat` and `wchan` show a thread's state and which kernel function it is stopped in;
  - `TracerPid` in `/proc/<pid>/status` shows whether someone else is ptrace-ing it;
  - `/proc/<pid>/syscall` shows which system call it is stuck in and with what arguments.
- **Thread stacks**: `shell su 0 debuggerd -b <pid>`, which does not kill the process.
- **Sampling and tracing**:
  - `simpleperf record -g -t <thread id>`, which can also follow a given system call;
  - kernel tracefs (`/sys/kernel/tracing`) to follow signals;
  - uprobe / uretprobe to see the return value of a library function.
- **Network**:
  - the emulator console's `emu network capture start <file>` / `stop` captures all of the guest's traffic;
  - `ss -tni` shows the receive backlog (Recv-Q) of each connection.
- **Disk**: `/proc/diskstats`; `wchar` and `syscw` in `/proc/<pid>/io`; the read and write counts of the qemu process on the host.
- **Host**: Process Explorer shows the CPU of each qemu thread. When the emulator crashes, take the crash dump and read the stack with the symbols of the matching version.
- **For games with protection, prefer passively reading `/proc`**, and do not casually ptrace the game process.

## Hangs and freezes

### Works sometimes at startup; when it fails, ANR after about 20 seconds (*Onmyoji*)

- **How it was investigated**: At the ANR, the whole machine's CPU was only 4.6%, so the main thread was not busy but halted. Passively reading `/proc` showed that the main thread's state was `t` (stopped by tracing), `wchan` was `ptrace_stop`, and `TracerPid` was not 0. Following it, what halted the thread was a child process of the game: WebView's crash handler, whose command line has `--trace-parent-with-exception`, which means it had decided the parent process crashed.
- **What was found**: The bridge is entered through a deliberate segmentation fault. WebView's crash handling is native code, and the signal handler it installs got to the very front. It took the bridge's segmentation fault for a crash, so it ptraced the parent process and hung there. Whether you hit this depends entirely on timing, so it works sometimes and fails sometimes.
- **Result**: Switched to the "first right to handle" that the native bridge interface already has (`getSignalHandler`). It comes before all `sigaction` handlers, so no one can get in front of it, however late they install theirs.

### Stuck at "正在获取音频列表..." ("Fetching the audio list...") and not moving (*Onmyoji*, about one cold boot in five)

- **How it was investigated**: All 139 threads of the game were asleep, and a 60-second packet capture had only one packet, so it was not the network. The main logic thread was reading a pipe, waiting for the child process it had forked itself. The child process was stopped on a futex whose lock address fell inside the translation layer's internal data. The same lock was free in the parent process and locked in the child's copy.
- **What was found**: The translation layer is not fork-safe. At the moment of the fork, this lock was held by another thread of the parent process, and in the child process nobody would ever release it. This is the classic multi-threaded fork deadlock.
- **Result**: In the companion library, `pthread_atfork` carries these locks across the fork. After the fix, there were 0 hangs in 15 consecutive cold boots.

### The picture freezes after about twenty minutes (*Honkai: Star Rail*)

- **How it was investigated**: `debuggerd -b` showed the render thread waiting in `dequeueBuffer` for a free buffer the whole time, and logcat had `Too many open files`. The game process's fd count grew linearly with the number of frames, one per frame, and ran out at about 32,000 frames, which matched the time of the freeze.
- **What was found**: The guest Vulkan driver bundled with the image leaks one fd per frame. After the fds ran out, the callback that sends the buffer back failed to unpack on the app side, and the buffer was never returned.
- **Result**: Worked around by setting the property `debug.angle.feature_overrides_disabled=supportsSwapchainMaintenance1` after boot. The emulator does not need to change.

### Occasional deadlock while loading (*Arknights: Endfield*; introduced by the first version of the patch for the crash below)

- **How it was investigated**: `debuggerd -b` showed the render thread waiting for a lock, and several other threads waiting for replies from the host, one of which was holding that lock.
- **What was found**: With `VulkanQueueSubmitWithCommands` on, the host executes commands one by one in global sequence-number order. The render thread took a sequence number first and then waited for the lock, while the thread holding the lock was waiting for a reply with a later sequence number. The host had to execute the render thread's command first, so they waited for each other.
- **Result**: The rule is: **do not hold a lock across a round trip to the host**. The second version of the patch only looks up the table under the lock, and sends to the host after leaving the lock.

## Crashes

### Crashes within 1 second of entering the game, every time (*Onmyoji*; the bridge was built for this)

- **What was found**: The game's protection library changes some GOT slots in the native x86 code to jump into translated arm64 code. On a real device these are all arm64 and fine. The translation layer supports only translated code calling native code and not the reverse, so it crashes every time.
- **Result**: The bridge uses the interface the translation layer itself exports to add the missing "native calls translated" path.
  - It hooks the translation layer's own import table (the entry that actually takes effect is its `mprotect`), because loading the libraries of an arm64 app goes through the translation layer's own loader and not through `libnativeloader`;
  - It never modifies the game or its protection library.

### Random crashes; the tombstone shows SIGSEGV with pc 0 and a different thread name each time (*Arknights: Endfield*)

- **How it was investigated**: This is a secondary crash scene. Tracing signals with tracefs gave this chain: the game's own assertion → `SIGTRAP` → crash-reporting SDK → translation layer → the reporting SDK takes a page fault on a host thread → turned into SIGSEGV. It also confirmed that the anti-cheat sent no signal. The assertion was `ret == VK_SUCCESS`, and a uretprobe then caught `vkBindImageMemory` returning -2.
- **What was found**: In the guest Vulkan driver bundled with the image, `BindImageMemory` looks up the handle table without taking a lock. When another thread happens to grow the table, the lookup misses and returns -2. This is a data race, and the upstream code is the same section.
- **Result**: Patched the guest driver to take the lock before looking up the table. There were 0 assertions in 10 cold boots, and no new tombstone in a 3-hour long run.

### The emulator itself crashes (during the 0.36 release regression tests)

- **How it was investigated**: In the upgrade test, qemu crashed when the instance restarted and adb reconnected. Took the crash dump, read the stack with the symbols of that version, then disassembled, and located an instruction that reads data from near a null pointer.
- **What was found**: When unregistering the network listener, it did not first check whether the listener node existed.
- **Result**: Check for null before unregistering. After the fix, the whole regression suite was rerun.

## Display

### Flicker and occasional all-black screenshots (NVIDIA GPUs, 2%–5% of frames)

- **How it was investigated**: Put probes on four paths (window, shared memory, adb screenshot, screen recording) and counted all-black frames frame by frame. All the paths turned out to be affected, so the problem is in the host's read-back step.
- **What was found**: When the NVIDIA driver requires a "dedicated allocation", gfxstream did not give one, and that part of the frame buffer read back as all 0.
- **Result**: After the fix, the number of all-black frames is 0 on every path. Submitted upstream.

## Network, downloads and data

### "网络请求超时" ("network request timed out") is shown, but the network is fine (*Honkai: Star Rail*)

- **How it was investigated**: Looked for 0-byte files in the game data directory, and captured packets with the emulator console to confirm that the hot-update requests and downloads were normal.
- **What was found**: An earlier shutdown without sync had turned the hot-update manifest that had just been written into 0 bytes. The game threw an exception when parsing the empty file, but the interface showed it as a network error.
- **Result**: With the game stopped, write the content of `_cache` in the same directory back into the real file. From now on, always sync before shutting down.

### Slow downloads, under 8 MB/s (*Arknights*)

- **How it was investigated**:
  - Compared in three layers: the host straight to the CDN at about 100 MB/s, a single connection on the emulator's network card at 80-odd MB/s, and the game itself at only 5.9 MB/s.
  - `ss` showed a receive backlog of several MB on each connection, which means the data had already reached the guest and the game was reading slowly.
  - `/proc/<pid>/io` and `/proc/diskstats`: the amount written to disk was about 8 times the download size, all in small blocks. The download thread was stopped in `jbd2_log_wait_commit`, that is, it was doing fsync while downloading.
  - No single qemu thread was maxed out.
- **What was found**: The bottleneck is the round-trip cost of each write request on the data disk. Each guest write turns into about 4 writes on the host. This way of writing is fine on a real device's flash, but on the emulator it drops to only 6 MB/s.
- **Result**: Not fully fixed yet. The direction is to lower the round-trip cost of each write. This kind of change touches the disk I/O path, so the hard-kill regression has to be run first.

### Files become 0 bytes or revert to an old version after a hard kill

- **How it was investigated**: Several ways of writing files (delete first then rename, rename over the old file, overwrite directly) were written under different writeback parameters and killed right after writing, to count how soon after a write a kill loses data.
- **Result**: This is where the "sync before shutdown" rule comes from. At boot the emulator also shortens the guest's writeback period, which narrows the window for data loss but cannot eliminate it.

## System level

### The guest freezes after a warm reboot (WHPX)

- **How it was investigated**: The guest kernel log had a soft lockup: one virtual CPU did not respond to inter-processor interrupts, and the other cores were stuck waiting for it.
- **Result**: Everywhere the guest needs to restart now does a cold boot (shut down, then start), not `adb reboot`.

### Memory use is higher than other emulators

- **How it was investigated**: Measured in three parts, then compared with other emulators under the same conditions: how much the guest actually uses, how big the guest memory block on the host is, and how much the emulator itself takes on top (about 0.65–0.75 GB).
- **Result**:
  - Turned on free page reporting for the memory balloon, so memory freed in the guest goes back to Windows;
  - Made the graphics staging buffer grow on demand, so each instance takes about 140 MB less when idle.

### Slow cold boot; adding cores or raising the clock speed does not help (*Arknights: Endfield*)

- **How it was investigated**:
  - First look at the host power plan: if "Maximum processor state" is 99%, turbo boost is off.
  - Then run several ways of pinning cores in alternating rounds, several times each, and check whether the difference between groups is larger than the fluctuation within a group.
- **What was found**: Pinning to any group of cores made no difference. After turbo boost was turned on, the clock speed was about 20% higher, but cold boot was only about 2% faster. The main thread looks busy but is actually waiting (for memory access, the translation cache or other waits); it is not a lack of compute.
- **Result**: Nothing needs to change for core pinning. The next step is to find out what the main thread is waiting for.

## A few lessons

- **Collect evidence first, then draw conclusions.** In the past, a fork deadlock was taken for a slow network, a file broken by a hard kill was taken for a CDN that could not be reached, and a frame rate mixed with menus was taken for the battle frame rate. All of these were guesses made without collecting evidence.
- **Run comparisons in alternating rounds**, several times, and check whether the difference between groups is larger than the fluctuation within a group. One run each does not count.
- **When the problem is in a component bundled with the guest image** (the guest Vulkan driver, ANGLE), first look for a property or a guest-side workaround. The emulator does not necessarily have to change.
- **For changes that touch disk I/O or the shutdown flow, run the hard-kill regression first.**
