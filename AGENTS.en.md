# Maintenance rules for modavd.github.io

[简体中文](AGENTS.md) | **English**

<!-- AGENTS.md and AGENTS.en.md match section by section: if you change one, change the other in the same PR. AI tools only read AGENTS.md on their own. -->

For general contribution, branch, commit, privacy and release rules, see [AGENTS.en.md](https://github.com/ModAVD/ModAVD/blob/main/AGENTS.en.md) of the main ModAVD repository. This file only adds what is specific to the docs site. The guide for people is on the site under "Contributing → Documentation and this site" (`docs/en/develop/docs.md`).

## Layout

- `docs/` is the VitePress documentation (VitePress 1.6.4, Node.js 24). Chinese pages are in `docs/`, English pages in `docs/en/`, at the same paths.
- `docs/.vitepress/config.mts` is the site configuration. Page titles for the navigation and sidebar are in one table for both languages (`[link, Chinese title, English title]`); add a row for a new page.
- `docs/public/` holds images and other static files, shared by both languages.
- `scripts/` holds the check scripts: `i18n.py` (Chinese/English comparison), `privacy.py` (privacy scan) and their tests. `privacy.py`, `repo_checks.py` and `test_repo_checks.py` are byte for byte the same as in the main ModAVD repository: change them there first and copy them here, CI compares them. Only `privacy-allowlist.json` belongs to this repository.

## Testing

- Locally: `npm ci --ignore-scripts`, then `npm run build` (fails on dead links), `python scripts/i18n.py` and `python scripts/privacy.py .`. After changing `scripts/i18n.py`, also run `python -I -X utf8 scripts/test_i18n.py`.
- CI (`.github/workflows/check.yml`) does the same on a PR and also checks commit authors and workflow security; `deploy.yml` publishes to GitHub Pages after a merge into `main`.

## Chinese and English

Chinese is the main language and the English pages match page by page; if you change a page in one language, change the other in the same PR. `README.md`, `AGENTS.md` and their `.en.md` files follow the same rule. `python scripts/i18n.py` checks:

- Errors (CI fails): a page is missing in one language; headings differ in level, order or `{#id}`; a link inside the site leads to the other language; a `#anchor` cannot be found.
- Warnings (shown, CI does not fail): the two versions have a different number of code blocks; they link to different URLs, pages or images (URLs are compared without the `#anchor`, and a README's Chinese and English file names count as the same); one side was last changed in a later commit than the other ("English page older than Chinese since <commit>" or the reverse, by commit time in `git log`); a PR changes only one language (`--base`). A warning does not have to be fixed at once, but either update the other side or say in the PR why not.

## Working rules

Documentation holds public information only. Do not commit accounts, keys, user paths or test data. Ordinary documentation changes do not add a release-notes entry (`changelog.d`).
