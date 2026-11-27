# modavd.github.io 维护规矩

**简体中文** | [English](AGENTS.en.md)

<!-- AGENTS.md 和 AGENTS.en.md 逐节对应：改了其中一份，请在同一个 PR 里把另一份也改了。AI 工具自己只会读 AGENTS.md。 -->

通用参与、分支、提交、隐私和发版规矩见 ModAVD 主仓库的 [AGENTS.md](https://github.com/ModAVD/ModAVD/blob/main/AGENTS.md)。本文件只补充文档站自己的约定。给人看的写法说明在站内「参与开发 → 文档和本站」（`docs/develop/docs.md`）。

## 目录

- `docs/` 是 VitePress 文档（VitePress 1.6.4，Node.js 24），中文页在 `docs/`，英文页在 `docs/en/`，路径一一对应。
- `docs/.vitepress/config.mts` 是站点配置；导航和侧边栏的页面标题两种语言写在同一张表里（`[链接, 中文标题, 英文标题]`），新加页面加一行。
- `docs/public/` 放图片等静态文件，两种语言共用。
- `scripts/` 保存检查脚本：`i18n.py`（中英对照）、`privacy.py`（隐私扫描），以及它们的测试。`privacy.py`、`repo_checks.py`、`test_repo_checks.py` 和 ModAVD 主仓库的逐字节相同，先在主仓库改再抄过来，CI 会比对；只有 `privacy-allowlist.json` 是本仓库自己的。

## 测试

- 本地：`npm ci --ignore-scripts`，然后 `npm run build`（有死链会失败）、`python scripts/i18n.py`、`python scripts/privacy.py .`。改了 `scripts/i18n.py` 再跑 `python -I -X utf8 scripts/test_i18n.py`。
- CI（`.github/workflows/check.yml`）在 PR 上做同样的事，并检查提交作者和 workflow 安全；`deploy.yml` 在合进 `main` 后发布到 GitHub Pages。

## 中英两种语言

中文是主语言，英文页逐页对应；改了一种语言的页面，同一个 PR 里把另一种也改了。`README.md`、`AGENTS.md` 和各自的 `.en.md` 也是这样。`python scripts/i18n.py` 核对：

- 出错（会让 CI 失败）：缺了某一种语言的页面；标题的层级、顺序、`{#id}` 不同；站内链接串到另一种语言；`#锚点` 找不到。
- 提醒（只标出来，不失败）：两边代码块数量不同；两边链到的网址、页面或图片不同（网址去掉 `#锚点`，README 的中英文件名视为同一个）；一边最近一次改动晚于另一边（「English page older than Chinese since <提交>」或反过来，按 `git log` 的提交时间）；PR 里只改了一种语言（`--base`）。提醒不要求马上改，但要么补上另一边，要么在 PR 里说明为什么不用。

## 做事

文档只放公开信息。不要提交账号、密钥、用户路径或测试数据。普通文档改动不添加发版公告条目（`changelog.d`）。
