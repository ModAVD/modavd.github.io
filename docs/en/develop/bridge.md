# The arm64 execution bridge

**What to change**: the layer that lets games that only have an arm64 build (currently the 7 channel builds of *Onmyoji*) run on the x86_64 image. It is in the [`bridge/`](https://github.com/ModAVD/ModAVD/tree/main/bridge) folder of the ModAVD repository:

| Directory | Output | What it does |
| --- | --- | --- |
| `nbshim/` | `libmodavd_bridge.so` | Our own native bridge entry. `ro.dalvik.vm.native.bridge` points to it; `libnativebridge` opens it and gets `NativeBridgeItf`. It opens the real translation layer, copies the real struct over byte by byte at the length for its version (v6 = 144, v7 = 160, v8 = 168 bytes), forwards the calls one by one, and brings up the companion library |
| `companion/` | `libmodavd_gate.so` | The bridge itself. Using the interfaces the translation layer exports itself (`WrapGuestFunctionImpl`, `RunGuestCall`, `GuestMapShadow`, `MakeTrampolineCallable`), it adds from the outside the path "native x86 code calls a translated arm64 function through a rewritten GOT slot" |
| `nbshim/modavd_bridge.rc` | — | Re-registers the arm64 `binfmt_misc` for the new property value (the one that comes with the image only recognizes `libndk_translation.so`; once the property is changed, arm64 executables silently stop running); on instances that have been remounted, it loads zram at boot |

Two generations of the translation layer are supported: ndk_translation 0.2.3 on the API 34 image (this is the one ModAVD uses) and Berberis 16 on API 36.1. Symbols are resolved by name from the images that are already mapped, and are not tied to a build-id.

::: danger Hard rules
Do not modify, patch or bypass any file of the game itself or of its protection libraries, and do not interfere with any integrity or anti-tamper check. The bridge itself does not change Google's translation layer. After boot, the manager separately mounts a patched copy, generated on your machine, over the original path. It only changes how the hint instructions (SEVL, SEV, WFE, WFI) are decoded; the image file is untouched and the modified binary is not distributed.
:::

## Why it crashes

Google's native bridge keeps ART and the system libraries native x86_64 and translates only the app's own arm64 libraries, so one process is split into two halves.

To watch dex reads, the game's hardening library (arm64, translated) makes the GNU_RELRO of the host `libartbase.so` writable, rewrites the GOT slots of functions such as `read` / `mmap` to point to its own arm64 hooks, and then makes it read-only again. On a real device both sides are arm64, and everything works up to this point.

On an x86_64 image, the native x86 ART runs `call [GOT slot]` and jumps into an arm64 code page. The translation layer maps guest code pages as non-executable on the host side, so the instruction fetch faults (`SIGSEGV`, `SEGV_ACCERR`, and the fault address is RIP). The translation layer's own signal handler has no branch for "native code jumped into a guest page" and treats it as a fatal error.

## Only for apps on the list

- The list is comma-separated package names, compiled into the companion library (`kDefaultGateTargets` in `companion/jni/native_to_guest_companion.cc`).
- If the property `modavd.gate.target` is set, it replaces the whole list; `setprop modavd.gate.target none` turns it off. The property is not persistent and is gone when the guest restarts, which suits trying out a new game temporarily (see [Adapting a new game](./adapt-game)).
- For apps not on the list, after the process is forked, the forwarding callbacks and the slots the companion library changed are all reverted, so they behave the same as when the bridge is not installed.

## Signal order

The bridge works through SIGSEGV: the instruction-fetch fault raised when native code jumps into a guest page through a rewritten GOT slot is the bridge's entry point. This fault must reach us first, or another handler will treat it as a real crash, for example WebView's crashpad.

The shim hands the companion library's decision function to ART through `getSignalHandler(SIGSEGV)` of the native bridge interface. ART registers it with libsigchain as a special handler, placed before all `sigaction()` handlers. It recognizes only our own trap and lets everything else through.

## Environment and hardware

- Android NDK r27c, about 2.2 GB; if you only compile, 4 cores and 8 GB of memory are enough.
- The build is deterministic: the same source built in different folders gives outputs that differ only in the build-id.

Verification needs a running instance with *Onmyoji* installed (6 GB of memory and 6 cores for testing; the instance is about 26 GB):

| | Recommended | Minimum |
|---|---|---|
| CPU | 8 cores, 16 threads | 6 cores, 12 threads (the instance gets 6 cores); 4 cores, 8 threads also works, but the instance can only get 4 cores and the frame rate is lower |
| Memory | 32 GB | 16 GB |
| Free disk space | 50 GB | 35 GB |

## Build

```powershell
$env:ANDROID_NDK_ROOT = '<NDK r27c dir>'
pwsh -File bridge\scripts\build-companion.ps1 [-OutDir <dir>]
pwsh -File bridge\scripts\build-nbshim.ps1 [-OutDir <dir>]
```

- The outputs go under `%TEMP%\modavd-nbbridge\` by default.
- **Never add `-ftls-model=initial-exec`.** Both libraries are loaded with dlopen. A library with initial-exec TLS relocations is rejected by Bionic's linker, the whole native bridge fails to load, and the device loses all arm64 support. `build-nbshim.ps1` checks after building and reports an error if there are such relocations.
- The same source built in different folders differs only in `.note.gnu.build-id` (the build-id contains the source path); with that section removed, the outputs are byte-identical. So it is normal that the hash of your own build does not match the one in the Release; the SHA-256 of the three files in the Release is written in `modavd-manifest.json` in the root of the main package.

## Installing into an instance

What does the work is `tools\modavd-bridge.ps1` in the package (its source is in `package/` in the ModAVD repository); the `bridge` command of the manager and the CLI both call it:

- The instance must boot with a writable system image. The emulator from 0.36.0 does this when it sees the boot marker `modavd-writable-system` in the instance folder.
- The two `.so` files go into `/system/lib64` (the shim has to be there: `libnativebridge` opens it in the linker's "system" namespace), and the `.rc` goes into `/system/etc/init/`.
- Append `ro.dalvik.vm.native.bridge=libmodavd_bridge.so` to `/vendor/build.prop`. Back it up before changing it; check it after writing and before rebooting; run `sync` before rebooting.
- Install in the order files first, property last; uninstall in the order property first, then files. The property is the only switch.
- All of this is written to the instance's own system / vendor overlay and does not touch Google's original image.
- When the guest needs a restart, always shut down and cold boot; do not hot-restart inside the guest (a hot restart hangs on WHPX, see [How to investigate common problems](./troubleshooting#system-level)).

For how users install and uninstall the bridge, see [Components: the arm64 execution bridge](../components/bridge).

## Verification

- You need a logged-in instance with a game on the list installed; install the bridge with the manager or `modavd bridge <index> install`;
- Check logcat for `shim-ctor OK`; for a game not on the list, the log must have the line saying the changes were reverted;
- Every version must be run on real games.

## Delivery

Open an issue first to discuss the change. It directly affects whether games can start. The maintainer rebuilds the payload and pins its hash; it ships with the next version.

## Suggested models

Opus 5.5 or GPT-6 Astra. With native code, the ABI, the dynamic linker and GOT rewriting, one mistake means the game will not start, and it also touches the hard rules above.
