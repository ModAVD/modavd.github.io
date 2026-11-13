# Connect MAA to ModAVD

This page is for people who run MAA on its own. If you use AUTO-MAS, skip it: AUTO-MAS sets everything up for you.

Once MAA supports ModAVD natively, this page will change to just picking ModAVD.

## How it works

ModAVD ships a MuMu-compatible shell in `<ModAVD root>\mumu-shim\`. MAA currently only knows MuMu's screenshot interface and loads `shell\sdk\external_renderer_ipc.dll` from the "MuMu Installation Path". So when you set MAA up as MuMu, screenshots go through ModAVD's shared memory, about 2 ms in testing. Taps still go through MaaTouch; the shell does not handle input.

## Before you start

- ModAVD 0.40.1 and later ship the `mumu-shim` folder.
- On an older version: update to 0.40.1, or download `external_renderer_ipc.dll` v0.1.3 or later from the [ModAVDExtras releases](https://github.com/ModAVD/ModAVDExtras/releases) and put it in `<ModAVD root>\mumu-shim\shell\sdk\`.
- Start the instance you want to connect to.

## Settings

In MAA, go to "Settings → Connection" and set, in order:

1. "Connection Preset": "MuMu Emulator".
2. Turn off "Auto detect connection". If it stays on, MAA changes the connection address back to MuMu's.
3. Tick "Enable MuMu's screenshot enhancement mode" and confirm the prompt.
   - Do not tick "Enable MuMu touch enhancement".
4. "MuMu Installation Path": `<ModAVD root>\mumu-shim`, for example `D:\ModAVD\mumu-shim`.
   - MAA rejects the path if `shell\sdk\external_renderer_ipc.dll` is not under it.
   - MAA may have filled in a real MuMu path from the registry when you ticked the option. Replace it with the one above.
5. Tick "MuMu Network Bridge Connection", click "Confirm" in the warning, then fill in "Instance Number" with the ModAVD instance number (0, 1, 2, ...: the number on the manager card).
   - If you leave it off, MAA works out MuMu's instance number from the connection address port. The result is wrong and screenshots fail.
6. "Touch Mode": "MaaTouch (Experimental)".
7. "Connection address": `127.0.0.1:<port>`, the adb address shown on the manager card. The default is `20001 + 10 × number`; if you changed the port range of the root, use what the manager shows.
8. "ADB path": `<ModAVD root>\sdk\platform-tools\adb.exe`.

## Check that it works

After MAA connects:

- `<ModAVD root>\mumu-shim\avdshim.log` has `connect index=<number> port=<port>`.
- In MAA's log, the screenshot speed test picks MumuExtras.

## If it does not work

- `avdshim.log` says `shared memory unavailable`: most likely the "Instance Number" is wrong or the instance is not running. Check the number first.
- MAA says it cannot find `external_renderer_ipc.dll`: check that the file is in `<ModAVD root>\mumu-shim\shell\sdk\`.
- The connection address keeps changing back: make sure "Auto detect connection" is off.