# The emulator itself

**What you change**: the patches on three repositories of the AOSP emulator: qemu, gfxstream (graphics) and crashpad. The patches for each version are in `patches/<repo>/<series>/` of the ModAVD repository, and the matching manifests are in `manifests/`.

## Environment

For details, see [Building from source](./build):

- Visual Studio 2022 Build Tools 17.14: C++ desktop build tools, ATL, MFC, Windows 10 SDK 19041 / Windows 11 SDK 22621;
- Python 3.12, Git for Windows and the [repo tool](https://gerrit.googlesource.com/git-repo/), all on PATH;
- Turn on Windows Developer Mode (Git and repo need to create symbolic links);
- Turn off line-ending conversion in Git and turn on symbolic links and long paths (`core.autocrlf=false`, `core.symlinks=true`, `core.longpaths=true`);
- Pick a short source directory and leave plenty of space: source plus build output is about **124 GB**, and an SSD is recommended.

## Hardware

| | Recommended | Minimum |
|---|---|---|
| CPU | 16 cores, 32 threads: a full build takes about 1.5 hours | 8 cores, 16 threads: a full build is estimated at over 3 hours (estimated from the core count, not measured) |
| RAM | 32 GB: after building you can start an instance directly and test games | 16 GB: lower the build parallelism and do not run instances while building (estimate) |
| Free disk space | 200 GB, SSD: includes build output, test instances and one game | 140 GB: source plus output is about 124 GB, plus one instance with no games installed |

Incremental builds are much faster than full builds.

## Getting the source and changing patches {#patches}

1. Open an issue first, saying what to change and why.
2. Get the source: in the ModAVD repository directory, run `python scripts/checks.py patches --work <a dir that does not exist yet>`. It shallow-fetches the AOSP base from android.googlesource.com, replays the patches of the current version in `patches/`, and creates one repository per patch series, such as `qemu-mas36`.

   You can also clone the already patched repositories directly: [ModAVDQemu](https://github.com/ModAVD/ModAVDQemu), [ModAVDGfxstream](https://github.com/ModAVD/ModAVDGfxstream) and [ModAVDCrashpad](https://github.com/ModAVD/ModAVDCrashpad). The current version is on the `release/0.36` branch, and the source tree is the same as the replayed one, for example `git clone -b release/0.36 https://github.com/ModAVD/ModAVDQemu.git`. The full history is about 400 MB; add `--depth 100` if you only want the most recent commits.
3. Go into the repository you want to change and **first change the commit identity to your own**, because the script sets the maintainer's identity on these repositories:

   ```
   git config user.name "<your name or pseudonym>"
   git config user.email "<your GitHub noreply e-mail>"
   ```

4. Commit your changes and export them with `git format-patch -<count>`. Attach the `.patch` files to the issue, or open a PR that only adds `incoming/<topic>/*.patch`.
   - The patch is exactly what will be taken in: based on the current series, with your noreply e-mail as the author and no `Co-authored-by`. Do not put test scripts into the patch itself; put them in the PR description or in `incoming/<topic>/tests/`. CI checks these points.
   - The maintainer will say in the PR what needs to change, and you update it yourself. Once it is reviewed, it is merged, and merged means accepted: the maintainer takes it into the next release unchanged with `git am`, and your credit is kept. At release time the patch is merged into a new series in `patches/`, and this copy in `incoming/` is deleted.
5. You do not need to know how to build or run regression tests. After the review, the maintainer builds and tests on their own computer.

Replaying patches alone needs no build environment. To build an emulator that runs, follow [Building from source](./build).

## Verification

- After building, start an instance on a machine with WHPX and a Vulkan driver, and run real games;
- Graphics-related changes need to be checked on different GPUs. The maintainer has only one configuration, AMD CPU with NVIDIA GPU, so this part especially lacks people;
- For changes to the disk I/O path or the shutdown flow (block devices, disk writes, anything related to sync, the data disk format, guest writeback parameters), the maintainer will run the hard-kill regression.

## Upstream

General fixes may later be sent to google/gfxstream or AOSP Gerrit. Upstream requires the author to sign the Google CLA personally; you will be asked first.

## Suggested models

Opus 5.5 or GPT-6 Astra, with high reasoning effort (choose High or Extra High for GPT). Root causes of crashes, WHPX, and gfxstream synchronization problems all take long trial and error in a very large codebase, and a wrong judgment is costly. A human reviews the change in the end.
