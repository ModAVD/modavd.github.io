# AUTO-MAS integration

**What to change**: the part of [AUTO-MAS](https://github.com/AUTO-MAS-Project/AUTO-MAS) that manages ModAVD instances (creating instances, start and stop, updating the package). It is planned to change from AUTO-MAS's own Python implementation to calling the `modavd` CLI. The change goes to the AUTO-MAS repository, and AUTO-MAS's maintainers decide whether to accept it.

## Environment

Follow AUTO-MAS's own development guidelines (Python environment, generated frontend files, test requirements).

## Hardware

In addition to AUTO-MAS's own development environment. If you need to start instances, it is best to also install a game for real runs.

| | Recommended | Minimum |
|---|---|---|
| CPU | 8 cores, 16 threads | 4 cores, 8 threads |
| Memory | 32 GB | 16 GB |
| Free disk space | 100 GB | 50 GB |

## Integration points

- stdout is a single line of JSON and the log goes to stderr; collect the two separately;
- go by `error.code`;
- the first boot installs the execution bridge and restarts one or two more times, so allow a longer time limit;
- shut down with `modavd stop`, which syncs first and then stops;
- adb uses only the root folder's private server and never touches 5037.

The contract for the commands and the machine-readable output is in [the ModAVDManager README](https://github.com/ModAVD/ModAVDManager/blob/main/README.en.md#command-line).

## Suggested models

Sonnet 5.5 or GPT-6.1 Sol writes; for subprocesses, time limits and mutual exclusion during updates, Opus 5.5 or GPT-6 Astra reviews.
