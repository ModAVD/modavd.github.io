# ModAVD documentation site

[简体中文](README.md) | **English**

<!-- README.md and README.en.md match section by section: if you change one, change the other in the same PR. -->

The source of the documentation site for [ModAVD](https://github.com/ModAVD/ModAVD), published at <https://modavd.github.io/> (English version: <https://modavd.github.io/en/>). It is built with [VitePress](https://vitepress.dev/).

- Pages are Markdown files under `docs/`, and Chinese is the primary language. English pages are under `docs/en/`, at the same paths as the Chinese pages. The navigation and sidebar are in `docs/.vitepress/config.mts`, and both languages use one table of pages.
- Every page has an "Edit this page on GitHub" link at the bottom; make your change and open a PR. How to write pages is described on the site under "Contributing → Documentation and this site".
- If you change a page in one language, change the other language in the same PR. If you only write one of the two, say so in the PR and the maintainer will add the other.

## Preview locally

You need Node.js 24.

```powershell
npm ci --ignore-scripts
npm run dev       # local preview
npm run build     # builds docs/.vitepress/dist; dead links fail the build
python scripts/i18n.py        # checks the Chinese and English pages and headings, same as CI
python scripts/privacy.py .   # privacy scan, same as CI
```

## CI

- `check.yml`: on a PR it builds the whole site (dead-link check), checks that the Chinese and English pages match (`scripts/i18n.py`: every page exists in both languages, headings have the same levels and order, site links do not cross languages, and every anchor resolves; a page changed in one language only gets a warning), and runs the privacy scan.
- `deploy.yml`: after a merge into `main` it builds the site and publishes it to GitHub Pages.
- Third-party actions are always pinned to a full 40-character commit SHA; no `pull_request_target`, no self-hosted runners.

## License

The documentation is published under the Apache License 2.0; see [LICENSE](LICENSE). Copyright 2026 qiyinxi.
