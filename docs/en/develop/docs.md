# Documentation and this site

## Where the documentation is

| Content | Where to change it |
|---|---|
| This site (user guide, component introductions, contributing) | `docs/` in the [modavd.github.io](https://github.com/ModAVD/modavd.github.io) repository |
| The README, `CONTRIBUTING` and `AGENTS` of each repository (Chinese `X.md`, English `X.en.md`, matching section by section) | Each repository itself |
| Release notes, patch notes (`release/`, `patches/BASE.md`), the repository list | The ModAVD repository. They are exported by the release tool, so **do not edit them by hand**; if you find a problem, open an issue first |

Every page has "Edit this page on GitHub" at the bottom. Click through, edit directly, and send a PR.

## Previewing this site locally

You need Node.js 24. In the repository root:

```powershell
npm ci --ignore-scripts
npm run dev       # local preview, refreshes automatically on change
npm run build     # builds the static pages; dead links cause an error
python scripts/i18n.py   # checks the pages and headings of the Chinese and English sides
```

- The pages are Markdown under `docs/`. The English pages are under `docs/en/`, with paths matching the Chinese pages one to one. The sidebar and navigation are in `docs/.vitepress/config.mts`, with the titles of both languages in one table (`[link, Chinese title, English title]`), so a new page adds one row.
- Callouts use `::: tip`, `::: warning`, `::: danger` and `::: info`.
- Links inside the site are relative paths without `.md`, for example `[Installation](../guide/install)`. For files in other repositories, write the full GitHub address.
- Do not add analytics scripts, and do not load fonts or images from other websites.
- For image and icon changes, open an issue first with the source and the license.

## Checks

CI on a PR will:

- build the whole site, and fail on dead links;
- check the Chinese and English sides against each other (`python scripts/i18n.py`): every page exists in both languages, headings have the same levels and order, links inside the site do not lead to the other language, and every `#anchor` can be found. A page changed in only one language is flagged as a reminder;
- run the privacy scan (`python scripts/privacy.py .`), which fails if the docs contain paths such as a local user directory.

After a merge into `main`, the site is published to GitHub Pages automatically.

## Writing style

- Chinese is the main language, and the English pages match it page by page. If you change a Chinese page, change the matching English page in the same PR. If you cannot write English, say so in the PR and the maintainer will add it.
- In Chinese, use short sentences and wording that users understand. In English, write natural English that follows the meaning, not word for word.
- Take terms from the [table of terms](https://github.com/ModAVD/ModAVDManager/blob/main/internal/i18n/README.md#terms). For the manager's buttons and menus, English pages use the names shown in the manager's English interface, not the Chinese text with a translation in brackets. For a word that is not in the table, use the name in the code or the Chinese original rather than inventing a translation; once it comes up often, add a row to the table.
- Say from which version something exists and from which version it changed.
- Use tables and lists where you can instead of long paragraphs.
- Write commands in full so they can be copied as they are, and mark the parts of a path to replace with `<placeholder>`.

## Hardware

No limit. Anything that can run Node.js and Python is fine.

## Suggested models

Sonnet 5.5 or GPT-6.1 Terra; for bulk formatting changes, Haiku 5.5 or GPT-6 Luna.
