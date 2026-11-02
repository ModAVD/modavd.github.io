# Using AI tools

You can use AI tools to write code and investigate problems. There are only two rules:

- **Have the AI test its own changes**: compile, run the unit tests, and if you can start an instance, start one and look at the result. State in the PR what you tested and what the result was.
- **Do not give accounts, keys or private paths to AI tools.**

## Choosing a model by task

| Task | Claude | GPT (Codex) |
|---|---|---|
| The emulator itself, the execution bridge, root causes of crashes | Opus 5.5, reasoning set high | GPT-6 Astra, High or Extra High |
| Ordinary features and UI of the manager, the IME, CI, scripts | Sonnet 5.5 | GPT-6.1 Sol, Medium |
| Anything security-related, such as package updates, signing, release workflows and permissions | Sonnet 5.5 writes, Opus 5.5 reviews, a person reviews last | GPT-6.1 Sol writes, GPT-6 Astra reviews, a person reviews last |
| Running tests, reading logs, watching progress, writing docs | Sonnet 5.5 | GPT-6.1 Terra |
| Tidying logs, bulk reformatting, checking lists | Haiku 5.5 | GPT-6 Luna |
| Review before merging a PR | Opus 5.5, not the same session that wrote the code | GPT-6 Astra, likewise not the same session that wrote the code |

- Model names are as of October 2026. Both vendors update quickly; after a new generation, choose by the same tiers: give hard work to the strongest model with reasoning set high; give work with clear rules to a mid-tier model; give pure shuffling to a cheap model.
- On the GPT side, GPT-6.1 Sol is close to Astra and a good deal cheaper, which suits long coding sessions; when the budget is tight, the emulator itself and the bridge can also use Sol with Extra High.
- More specific advice for each area is in [Areas](./overview) and in the "Suggested models" section of each area's page.

## Prompting the AI

- Tell it the rules to follow directly: sync before you shut down the emulator; use the private port for adb and never touch 5037; do not change game files or bypass the game's protection; do not pull gacha or buy anything in the game.
- Have it gather evidence before it draws conclusions. The misjudgments in the past (taking a fork deadlock for a slow network, taking files damaged by a hard kill for a CDN that could not be reached) all came from guessing without looking at the actual scene. See [How to investigate common problems](./troubleshooting).
- When comparing performance, have it run alternating rounds; a single run of each does not count.
