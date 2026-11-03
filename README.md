# ModAVD 文档站

**简体中文** | [English](README.en.md)

<!-- README.md 和 README.en.md 逐节对应：改了其中一份，请在同一个 PR 里把另一份也改了。 -->

[ModAVD（魔改 AVD）](https://github.com/ModAVD/ModAVD) 的文档站源码，发布在 <https://modavd.github.io/>（英文版在 <https://modavd.github.io/en/>）。用 [VitePress](https://vitepress.dev/) 编译。

- 页面是 `docs/` 下的 Markdown，中文是主语言；英文页在 `docs/en/` 下，路径和中文页一一对应。导航和侧边栏在 `docs/.vitepress/config.mts`，两种语言用同一张页面表。
- 每页底部有「在 GitHub 上改这一页」，改完提 PR 就行。写法见站内的「参与开发 → 文档和本站」。
- 改了一种语言的页面，在同一个 PR 里把另一种也改了；只会写一种语言的，在 PR 里说一声，由维护者补上。
- 发现写错了又不想自己改，到 ModAVD 仓库的 [Issues](https://github.com/ModAVD/ModAVD/issues) 提，选上「文档站」；本仓库只收 PR。

## 本地预览

要 Node.js 24。

```powershell
npm ci --ignore-scripts
npm run dev       # 本地预览
npm run build     # 编出 docs/.vitepress/dist，有死链会报错
python scripts/i18n.py        # 核对中英页面和标题，和 CI 一样
python scripts/privacy.py .   # 隐私扫描，和 CI 一样
```

## CI

- `check.yml`：PR 上编译整站（查死链）、核对中英页面（`scripts/i18n.py`：每页都有两种语言，标题的层级和顺序相同，站内链接不串语言，锚点都找得到；只改了一种语言的页面会标出提醒）、跑隐私扫描。
- `deploy.yml`：合进 `main` 后编译并发布到 GitHub Pages。
- 第三方 action 一律钉到 40 位提交 SHA；不用 `pull_request_target`，不用自托管 runner。

## 许可证

文档按 Apache License 2.0 发布，见 [LICENSE](LICENSE)。Copyright 2026 qiyinxi。
