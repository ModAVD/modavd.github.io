# The arm64 execution bridge

It lets games that only have an arm64 build and use app hardening run on ModAVD's x86_64 system image. Right now it takes effect only for the 7 channel builds of *Onmyoji*. From 0.36.0 it ships with the main Release package, installed in `sdk\emulator\resources\modavd\`.

::: info It does not touch the game
The bridge **does not modify, patch or bypass the game or its hardening libraries, and does not interfere with any integrity or anti-tamper check**. This is compatibility work on the translation layer: it makes the hooks the game installs itself execute and return correctly. Intel Houdini already works this way, and the same game runs on Houdini. We do not change a single byte of Google's translation-layer binaries.
:::

## Why it is needed

x86_64 images run arm64 apps through Google's translation layer: the system libraries stay native x86_64, and only the arm64 libraries that ship with the app are translated.

A game's hardening library redirects the entry points of some functions in the system libraries to its own arm64 code. On a real device both sides are arm64, so this is fine. On an x86_64 image, the native code crashes as soon as it jumps into arm64 code, because the translation layer only supports translated code calling native code, not the other way round. The bridge fills this gap using the interfaces the translation layer itself exports. For the details, see [Develop: the arm64 execution bridge](../develop/bridge).

## Only for games on the list

- The list is currently the 7 channel builds of *Onmyoji*.
- For apps not on the list, after the process starts, everything the bridge changed is reverted, so they behave the same as when the bridge is not installed.

## Installing into an instance

- **From 0.36.0 you do not need to install it yourself**: when you start an instance with the manager `ModAVD.exe` or the CLI `tools\modavd.exe start`, both new and existing instances get the bridge automatically. If the bridge is not installed after the startup sequence finishes, it is installed; if it does not take effect, the instance is shut down and cold-booted, up to three rounds. The first boot takes 1–2 minutes longer.
- Once it is installed, start instances with AUTO-MAS as usual; the bridge stays in place.
- An instance that has only ever been started by AUTO-MAS and never by the manager is not installed automatically in this version: start it once with the manager.
- The bridge is installed in the instance's own system / vendor overlay and does not touch Google's original image.

## If you do not want the bridge

- When creating an instance, use `tools\modavd.exe create --no-bridge`;
- For an existing instance, run `tools\modavd.exe bridge <index> uninstall`; after that, starts no longer install it automatically (run `install` again to restore it);
- `start --no-bridge` applies to that one start only;
- For a read-only check, use `bridge <index> verify` (the instance must be running).

::: warning Before rolling back to an older version
Before going back to a version earlier than 0.36.0, run `tools\modavd.exe bridge <index> uninstall` once on every instance, and swap the package only after the result says the bridge is not installed. If you roll back without uninstalling first, every app on that instance that only has an arm64 build will fail to run.
:::

The source is in the [`bridge/`](https://github.com/ModAVD/ModAVD/tree/main/bridge) folder of the ModAVD repository, released under AGPL-3.0-or-later.
