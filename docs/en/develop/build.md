# Building from source

The examples below use `0.36.0` (build number mas-36). For other versions, use that version's repository manifests and patches; do not mix source and binaries from different versions.

The matching source bundle is in the [0.36.0 Release](https://github.com/ModAVD/ModAVD/releases/tag/v0.36.0). Its `SOURCES.txt` explains where each source file comes from and what it is for. From 0.32.1 the version is written `0.<N>.<P>` (tag `v0.32.1`), and N is the build number mas-N: the manifest is still called `manifest-masN.xml`, and the patch folders are still named masN.

For the hardware requirements, see [the emulator itself](./emulator#hardware).

## Environment

- Windows x86_64; Visual Studio 2022 Build Tools **17.14**, with the C++ desktop build tools, ATL, MFC, and the Windows 10 SDK 19041 / Windows 11 SDK 22621 installed.
- Turn on Windows Developer Mode, so that Git and repo can create symbolic links.
- Python 3.12, Git for Windows, and the [repo tool](https://gerrit.googlesource.com/git-repo/). Put Python, Git and repo on the terminal PATH.
- Use a short source root folder, and leave enough space for all the AOSP projects, the prebuilt libraries, the intermediate build files and the outputs. Below, `$src` stands for the source folder you choose, and `$modavd` for the location of the ModAVD repository.

The commands below run in PowerShell 7. On Windows, repo can be used through `repo.cmd`, which calls its Python launch script; for upstream's notes, see `external/qemu/android/docs/WINDOWS-DEV.md` in the source.

Set up your own Git commit identity. Turn off line-ending conversion and turn on symbolic links and long paths; the settings below affect only the current terminal and its child processes:

```powershell
$env:GIT_CONFIG_COUNT = '3'
$env:GIT_CONFIG_KEY_0 = 'core.autocrlf'
$env:GIT_CONFIG_VALUE_0 = 'false'
$env:GIT_CONFIG_KEY_1 = 'core.symlinks'
$env:GIT_CONFIG_VALUE_1 = 'true'
$env:GIT_CONFIG_KEY_2 = 'core.longpaths'
$env:GIT_CONFIG_VALUE_2 = 'true'
```

## Getting the exact version

First clone the ModAVD repository and check out the release tag of that version. The release tag of mas30 predates `manifests/`; to build mas30 you can check out the mas32 tag, which also contains the manifest and patches for mas30. Note the absolute location of the repository folder:

```powershell
git clone https://github.com/ModAVD/ModAVD.git
Set-Location ModAVD
git checkout v0.36.0
$modavd = (Get-Location).Path
```

The manifests are in `manifests/`, and the source bundle contains the same files:

- `manifest-mas36.xml` records the full target commits used at build time (there is one `manifest-<version>.xml` per version).
- `manifest-aosp-base.xml` replaces the three patch repositories with the public AOSP base; all other projects stay the same.

::: warning Do not run repo sync directly on the target manifest
The three local commits in qemu, gfxstream and Crashpad are not on the AOSP servers. Use the target manifest as the reference for the version, run `repo init` / `repo sync` with the matching public base manifest, and then replay the patches to get the target source tree.
:::

Run this in the short-path source folder you chose (first set `$src` to the absolute path of this folder):

```powershell
New-Item -ItemType Directory -Path $src
Set-Location $src
repo init -u https://android.googlesource.com/platform/manifest -b emu-main-dev --depth=1
if ($LASTEXITCODE) { throw 'repo init failed' }
Copy-Item "$modavd/manifests/manifest-aosp-base.xml" .repo/manifests/manifest-aosp-base.xml
repo init -u https://android.googlesource.com/platform/manifest -b emu-main-dev -m manifest-aosp-base.xml --depth=1
if ($LASTEXITCODE) { throw 'pinned repo init failed' }
repo sync -c --no-clone-bundle -j4
if ($LASTEXITCODE) { throw 'repo sync failed' }
```

The prebuilt tools and libraries in the manifest are also build inputs and should be synced along with the rest. Do not substitute the heads of moving branches for the pinned revisions.

## Replaying the patches

For the base, the folders, the number of patches and the license of each patch, see [patches/BASE.md](https://github.com/ModAVD/ModAVD/blob/main/patches/BASE.md). Apply them in file-name order with `git am --keep-cr`, which keeps the CR bytes the patches already contain:

```powershell
$series = @(
    @{ Repo = 'external/qemu'; Patches = 'qemu/mas36' },
    @{ Repo = 'hardware/google/gfxstream'; Patches = 'gfxstream/mas35' },
    @{ Repo = 'external/crashpad'; Patches = 'crashpad/module-version22' }
)
foreach ($s in $series) {
    $repo = Join-Path $src $s.Repo
    git -C $repo switch -c modavd-mas36
    if ($LASTEXITCODE) { throw "branch failed: $($s.Repo)" }
    $patches = @(Get-ChildItem (Join-Path "$modavd/patches" $s.Patches) -Filter '*.patch' |
        Sort-Object Name | ForEach-Object FullName)
    git -C $repo am --keep-cr @patches
    if ($LASTEXITCODE) { throw "patch replay failed: $($s.Repo)" }
}
```

The authorship of the patches has been unified. Replaying produces different commit IDs, so compare the source trees instead of requiring the local commit IDs to equal the private commits in the target manifest. `git -C <repo> rev-parse 'HEAD^{tree}'` should give the same values as the table below (`patches/series.json` in the ModAVD repository also records these trees):

| Repository | mas36 target tree |
| --- | --- |
| qemu | `5483e1bf05ebb3cd7549aed2adcde998bf1c4703` |
| gfxstream | `51288846bdcb9054d899ffc8458d6744d6206e32` |
| Crashpad | `0a3c056231f5257034514ae8d83192de388351f0` |

You can also skip the replay and fetch tag `v0.36.0` from the already-patched repositories [ModAVDQemu](https://github.com/ModAVD/ModAVDQemu), [ModAVDGfxstream](https://github.com/ModAVD/ModAVDGfxstream) and [ModAVDCrashpad](https://github.com/ModAVD/ModAVDCrashpad); the source trees are the ones in the table above:

```powershell
$tags = @(
    @{ Repo = 'external/qemu'; Url = 'https://github.com/ModAVD/ModAVDQemu.git' },
    @{ Repo = 'hardware/google/gfxstream'; Url = 'https://github.com/ModAVD/ModAVDGfxstream.git' },
    @{ Repo = 'external/crashpad'; Url = 'https://github.com/ModAVD/ModAVDCrashpad.git' }
)
foreach ($t in $tags) {
    $repo = Join-Path $src $t.Repo
    git -C $repo fetch $t.Url v0.36.0
    if ($LASTEXITCODE) { throw "fetch failed: $($t.Repo)" }
    git -C $repo switch -c modavd-mas36 FETCH_HEAD
    if ($LASTEXITCODE) { throw "branch failed: $($t.Repo)" }
}
```

All other projects should stay at the revisions recorded in the target manifest.

## Build

Start from the synced source root, and use this version's prebuilt libraries and tools. The command below skips cleaning, rebuilding the prebuilt libraries and the test tasks, does a release build, and keeps the incremental build folder.

```powershell
$env:PYTHONUTF8 = '1'
$env:CMAKE_BUILD_PARALLEL_LEVEL = '12' # no more than 16; lower it according to the available memory
$env:PATH = "${env:ProgramFiles(x86)}/Microsoft Visual Studio/Installer;$env:PATH"
$out = Join-Path $src 'objs'
$dist = Join-Path $src 'dist'
Set-Location (Join-Path $src 'external/qemu')
python android/build/python/cmake.py --out $out --dist $dist `
  --task-disable clean --task-disable removeleftover --task-disable prebuilts `
  --task-disable ctest --task-disable emugentest --task-disable genentriestest `
  --task-disable coveragereport --task-disable packagesamples `
  --task-disable zipintegrationtests --task-disable integrationtest
if ($LASTEXITCODE) { throw 'build failed' }
```

The ready-to-use emulator folder is at `$out/distribution/emulator/`, and the distribution archive is at `$dist/`.

To install it as your own SDK, copy `emulator/` in full, and set `Pkg.BuildId` in its `source.properties` to the matching build number, for example `mas-36`. What is built here is the emulator program; adb, the system images, the instances and the game data are managed separately.

This flow uses the AOSP prebuilt dependencies pinned by the manifest. If you need to modify, rebuild or relink third-party libraries such as Qt and GLib, the source bundle has the matching source, patches and build files; handle them according to `SOURCES.txt` and the project notes in `LICENSES/NOTICE.txt` of the main package.
