# ModAVD 文档站

[ModAVD（魔改 AVD）](https://github.com/ModAVD/ModAVD) 的文档站源码，发布在 <https://modavd.github.io/>。用 [VitePress](https://vitepress.dev/) 编译。

- 页面是 `docs/` 下的 Markdown；导航和侧边栏在 `docs/.vitepress/config.mts`。
- 每页底部有「在 GitHub 上改这一页」，改完提 PR 就行。写法见站内的「参与开发 → 文档和本站」。

## 本地预览

要 Node.js 24。

```powershell
npm ci --ignore-scripts
npm run dev       # 本地预览
npm run build     # 编出 docs/.vitepress/dist，有死链会报错
python scripts/privacy.py .   # 隐私扫描，和 CI 一样
```

## CI

- `check.yml`：PR 上编译整站（查死链）、跑隐私扫描。
- `deploy.yml`：合进 `main` 后编译并发布到 GitHub Pages。
- 第三方 action 一律钉到 40 位提交 SHA；不用 `pull_request_target`，不用自托管 runner。

## 许可证

文档按 Apache License 2.0 发布，见 [LICENSE](LICENSE)。Copyright 2026 qiyinxi。
