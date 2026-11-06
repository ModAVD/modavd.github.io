# Upgrade

To upgrade, shut down all instances, then extract the whole new Release package into the old root folder (for example `D:\ModAVD`), overwriting files with the same names. Instances, games and login state are all in `avd\`. The new package does not contain that folder, so it is not touched, and you do not need to add anything again in AUTO-MAS.

From 0.36.0 the package root also has `ModAVD.exe` (the manager), `tools\` has `modavd.exe` (the CLI) and `modavd-bridge.ps1`, and `components\` has the host IME `modavd-ime.apk`. If you replace only `sdk\emulator\`, you miss them.

## What is replaced and what is left alone

| Path | On upgrade |
|---|---|
| `sdk\emulator\` | The emulator itself. Overwrite it with the one in the new package. Overwriting does not delete files that the new version dropped. To clear those too, delete the old folder before extracting (see step 3) |
| `ModAVD.exe` (the manager, from 0.36.0) | Overwrite with the one in the new package |
| `tools\`: from 0.36.0 `modavd.exe` (the CLI) and `modavd-bridge.ps1` (installs, uninstalls and checks the arm64 execution bridge); 0.38.1 and earlier also had `fetch-components.ps1`, `collect-info.ps1` and `report-config.ps1` | Overwrite with the ones in the new package. The three `.ps1` files are no longer shipped from 0.38.2: upgrading with `modavd update` deletes them, while overwriting by hand leaves them in place, which does no harm, and you can delete them yourself |
| `components\`: `de.jrpie.android.launcher_57.apk` (µLauncher); from 0.36.0 also `modavd-ime.apk` (the host IME) | Overwrite with the ones in the new package |
| `说明.txt`, `LICENSES\`, `modavd-manifest.json` | Overwrite with the ones in the new package |
| `补全组件.bat`, `收集问题信息.bat`, `复制配置信息.bat` (in the root of packages 0.38.1 and earlier) | The new package from 0.38.2 does not have them. The three jobs are done in the manager and on the command line (see [Install](./install) and [Report a problem](./feedback)). Upgrading with `modavd update` deletes these three files, while overwriting by hand leaves them in place, which does no harm, and you can delete them yourself |
| `avd\` | **Left alone**, the new package does not have this folder. Instances, games and login state are all here |
| `sdk\platform-tools\`, `sdk\system-images\` | Left alone, the new package does not have them either. If the versions the new release requires change, the Release notes say so, and you click **补全组件** (Fetch components) in the manager again then, or run `tools\modavd.exe components fetch` |
| `mas-avd.json`, `logs\` | Left alone. These are written by AUTO-MAS and the emulator itself |

## Steps

1. Shut down all instances: the ones started in AUTO-MAS and, from 0.36.0, the ones started in the manager `ModAVD.exe`. If `ModAVD.exe` is open, close its window too. Wait half a minute, because the emulator's helper processes take over ten seconds to exit. Check in Task Manager that there is no `qemu-system-x86_64` process.
2. Download the new Release package. Since 0.32.1 the zip has no outer folder, so `sdk\`, `tools\` and the rest sit directly at the root of the zip.
3. (Optional) To clear old files that the new version dropped, first delete `sdk\emulator\` in the old root folder. Delete only that one folder. Do not touch `avd\` or the other folders under `sdk\`.
4. Extract the whole new package into the old root folder and replace every file with the same name. Extract All creates a new folder named like the zip by default, so change the destination to the old root folder. In 7-Zip, also choose the old root folder as the destination, and do not use `Extract to <package name>\`. If overwriting reports that a file is in use, the emulator's helper processes have not exited yet. Wait a little and try again.
5. Open `sdk\emulator\source.properties` and check that `Pkg.BuildId` is the new version (for example `mas-36`).
6. You do not need to download the components again or add anything again in AUTO-MAS. Start the instances as usual.

## Upgrading from a beta package

A beta package (for example `ModAVD-37.2.10-mas25`) comes with adb and the system image, the same versions that **补全组件** (Fetch components) downloads, so:

- Follow the steps above and extract the whole new package into the beta package's root folder. Files that the beta package does not have (for example `LICENSES\`, and from 0.36.0 `ModAVD.exe`) are put in along with the rest.
- You do not need to fetch the components again. It does no harm to run `tools\modavd.exe components fetch` on the command line: it reports that both components are already complete and skips them.

Old instances from the beta package can be started with the new version directly.

## Going back to an older version

::: warning Uninstall the bridge first
Before going back to a version earlier than 0.36.0, run `tools\modavd.exe bridge <number> uninstall` once on each instance, and swap the package only when the result says 没装 (not installed).

If you go back without uninstalling first, that instance may end up with a system property pointing to a library that no longer exists. Then every app that only has an arm64 build fails to run, and nothing in the interface shows why.
:::

## When the version is too old

AUTO-MAS checks the emulator's version number (`Pkg.BuildId`). If it is too old, AUTO-MAS refuses to start the emulator and tells you to update. Follow the steps above to switch to the new version.

## How to read the version number

Since `0.32.1` the version number is written as `0.<build number>.<repackage count>`:

- 0 means it is still in the beta stage;
- the build number is the mas-N in `Pkg.BuildId`, for example `0.36.0` is mas-36;
- the last number counts how many times the package was repackaged without recompiling.

The emulator in `0.32.1` is the same as the earlier release `37.2.10-mas32`, only in the new package format.
