# How ModAVD differs from the official emulator

Below are the changes that affect users in the current version (`0.36.0`, build mas-36, based on Google's AOSP Android Emulator 37.2.10). For the individual patches, see [`patches/`](https://github.com/ModAVD/ModAVD/tree/main/patches) in the ModAVD repository. For the changes in each version, see the [Release notes](https://github.com/ModAVD/ModAVD/releases).

## Nothing is sent out

- It does not upload usage statistics (`-metrics-collection` is treated as `-no-metrics`).
- It does not upload crash reports and does not pop up a question. Crash dumps stay on this machine, and the latest 5 are kept.
- It does not check for updates at boot and does not download feature flags (it uses the local cache or the copy shipped in the package).

For details see [Privacy](./privacy).

## Survives a force-kill

- The data disk is handed to Android write-through, so force-killing the emulator process does not corrupt the virtual disk's (qcow2) metadata. Our hard-kill tests have not produced any corruption. Files that were still not written to disk in the last few seconds before shutdown can still be lost.
- Fixed the crash handler (crashpad_handler) exiting at random. Before the fix, once it had exited, the emulator hung the next time it crashed and left no dump.

## Uses fewer resources

- It supports free page reporting for the memory balloon: memory that Android frees goes back to Windows. What it saves is physical memory actually in use, not the commit charge, and the effect depends on the load.
- A new instance no longer takes up the full data disk limit temporarily on its first boot. When the drive holding the data disk is NTFS or ReFS, creating the disk for the first time only requires 10 GB free (the official build requires 1.2 times the limit: 77 GB for a 64 GB limit).
- Without `-logcat`, Android logs are no longer forwarded to the host.
- The graphics staging buffer grows on demand from 16 MB (the limit is still 128 MB) instead of allocating 128 MB at boot. On NVIDIA GPUs each idle instance uses about 140 MB less memory.

## Disk

- When Android submits several small reads or writes at once (64 KiB in total at most), they are merged into one block before being handed to Windows. This cuts the system calls per disk write from about 4 to 1.
- The data disk can be enlarged without touching game data: when the configured data disk is larger than the existing one, only the virtual disk is enlarged before boot (it is never shrunk), and Android expands it online after boot. In this case the official build either ignores the change or wipes the whole instance.
- A new data disk gets at most 1,048,576 inodes (the default for a 16 GB partition). For a 64 GB data disk the inode table goes from 1 GiB to 256 MiB, so a new instance uses about 0.7 GB less disk. Existing disks are unchanged.
- The resize inode of a new data disk is laid out as the kernel's online resize requires, so disks created at 16 GB from now on can be enlarged fully (before, they could only grow to about 30 GB).

## Windows Hypervisor Platform (WHPX)

- Fixed several problems where the guest clock (TSC) went out of sync around pause, resume and loading a snapshot.
- The local APIC is emulated by the Windows hypervisor by default.
- The virtual CPU limit goes from 6 to half the computer's logical processors.

## Network

- The buffer of each TCP connection goes from 8 KiB to 128 KiB.
- On Windows all network connections are polled. Before, only the first 128 were looked at.
- Connections on the host side have a short keepalive, so they close sooner when the peer is lost.
- Fixed a null pointer read, which made the whole emulator exit, when unregistering a connection that was never registered. It was hit when adb reconnected after an instance restart, and the official code has it too.

## Graphics (gfxstream) {#graphics}

- Fixed about 2%–5% of frames being read back all black on NVIDIA GPUs (flicker, and occasional all-black screenshots). Submitted upstream.
- Fixed render threads contending for the OpenGL context. Before, when a game switched videos, the YUV conversion shader could fail to compile and the whole emulator would exit.
- When a program in Android adds extension structures that the host does not recognize (ray tracing, mesh shaders and so on) to a Vulkan query, the emulator no longer exits. *Arknights: Endfield* used to make the emulator exit as soon as it created a Vulkan device.
- Fixed some compatibility problems in Vulkan descriptor template updates and OpenGL ES compute shaders, and a crash and several video memory leaks in the hardware video decoding (CUDA) path.
- Added two environment variable switches, both off by default:
  - `ANDROID_EMU_VK_HIDE_REBAR=1`: reports the host's "video memory and host-visible" memory (NVIDIA ReBAR) to Android as video memory only;
  - `ANDROID_EMU_VK_ASTC_BC3=1`: when emulating ASTC textures, decompresses them to BC3 (experimental).

## Interface and logs

- The side toolbar is cut down to power, volume up and down, back and home (plus minimize and close). Set the environment variable `ANDROID_EMU_FULL_TOOLBAR=1` to get the full toolbar back.
- Each log line is written immediately, and standard error is no longer buffered in blocks, so the last lines before a crash are not lost.
- The program icon and window icon are now ModAVD's own icon (see [Licenses and source code](./license#icon-and-artwork)).

## Input method

- Added a host IME channel (the goldfish pipe service `modavd_ime`) and the console command `ime`. Together with the guest IME in Android, they let you type Chinese and other text into Android directly in the emulator window with a Windows input method.
- From 0.36.0 the guest IME comes with the package (`components\modavd-ime.apk`) and is installed automatically when you start with the manager or the CLI. When it is not installed, the emulator behaves as before. See [The host IME](../components/ime).

## arm64 execution bridge

- When the instance directory has the boot marker `modavd-writable-system`, the instance boots with a writable system image no matter who starts it.
- From 0.36.0 the arm64 execution bridge puts this marker there when it is installed into an instance and removes it when uninstalled. So an instance with the bridge installed is started as usual by AUTO-MAS, and the bridge is still there. Instances without the marker behave as before. See [The arm64 execution bridge](../components/bridge).

## Removed files

Compared with the files that an official build installs, the Release package does not have these (the emulator does not need them to run):

- `bin64\` (Cygwin e2fsprogs) and `drivers\` (the USB passthrough driver);
- the virtual camera scenes, the macro samples and the Pixel 10 skin, and the FlatBuffers development files;
- the ARM and 32-bit x86 `qemu-system`.

So only x86_64 system images can run, and there is no `-usb-passthrough` and no virtual scene camera.
