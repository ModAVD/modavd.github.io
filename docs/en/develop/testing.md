# Game testing and compatibility reports

## The easiest way to help

Install on your own computer by following [Installation](../guide/install), run one round of daily tasks in AUTO-MAS, and then:

1. Double-click `复制配置信息.bat` (copies your system and game info);
2. Paste the output into the pinned "兼容性报告" (compatibility report) issue in the Issues of the ModAVD repository, and fill in the last three lines;
3. Add one sentence on whether it runs.

These configurations are missing most: Intel CPU, AMD or Intel GPU, laptops with dual GPUs, Windows 10, and 16 GB of RAM. For compatibility reports, low-end machines are in fact the most wanted. As long as you meet the [requirements](../guide/#requirements), you are welcome to test.

## Hardware

When you run game tests yourself:

| | Recommended | Minimum |
|---|---|---|
| CPU | 8 cores, 16 threads | 4 cores, 8 threads |
| RAM | 32 GB | 16 GB |
| Free disk space | 30–80 GB per game | Same |

What each game's instance looks like in practice on the maintainer's machine:

| Game | RAM of the test instance | Disk used by the instance |
|---|---|---|
| *Onmyoji* | 6 GB | 26 GB |
| *Arknights* | 4 GB | 38 GB |
| *Arknights: Endfield* | 8 GB | 56 GB |
| *Reverse: 1999* | 6 GB | 67 GB |
| *Honkai: Star Rail* | 6 GB | 77 GB |

The frame rate is strongly affected by other emulators open at the same time.

## Rules

- Do not pull gacha, buy anything or use stamina items;
- Operate in the game with scripts only;
- Stop when the game shows an update prompt;
- Use a test account, and run sync before shutting down the emulator.

## The maintainer's pre-release regression tests

- On the maintainer's machine, real tasks are run with each game's automation scripts (MAA, M9A, SRC, MaaEnd, MaaYYs), not by leaving the game unattended on the title screen;
- Games always run on instances with the bridge installed and routed by package name, the same as users' instances;
- The items are picked by what changed in this version: a change to the emulator itself runs the full set, and a change only to the manager, the IME or the bundled scripts runs just the few relevant items;
- The frame rate is compared with the baseline of the previous release, with a tolerance for each game. When more than 2 other emulators run on the same machine, it is only recorded and not judged;
- It needs a logged-in test account, 32 GB or more of RAM, and few other emulators open on the same machine.

A game that has an automation script and tasks that do not consume resources can be added to the regression tests once it has been made to work; see [Making a new game work](./adapt-game#after).

## Suggested models

Sonnet 5.5 or GPT-6.1 Terra to run tests and read logs; Haiku 5.5 or GPT-6 Luna to tidy up logs and sum up numbers.
