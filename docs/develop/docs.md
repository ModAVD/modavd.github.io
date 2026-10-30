# 文档和本站

## 文档在哪

| 内容 | 在哪改 |
|---|---|
| 本站（使用说明、组件介绍、参与开发） | [modavd.github.io](https://github.com/ModAVD/modavd.github.io) 仓库的 `docs/` |
| 各仓库自己的 README、`CONTRIBUTING.md` | 各自的仓库 |
| 发版说明、补丁说明（`release/`、`patches/BASE.md`）、仓库清单 | ModAVD 仓库，由发版工具导出，**不要手改**，有问题先开 issue |

每页底部有「在 GitHub 上改这一页」，点进去直接改、提 PR 就行。

## 本地预览本站

要 Node.js 24。在仓库根目录：

```powershell
npm ci --ignore-scripts
npm run dev       # 本地预览，改了自动刷新
npm run build     # 编出静态页面，有死链会报错
```

- 页面是 `docs/` 下的 Markdown，侧边栏和导航在 `docs/.vitepress/config.mts`。新加页面要在那里挂上。
- 提示框用 `::: tip`、`::: warning`、`::: danger`、`::: info`。
- 站内链接写相对路径、不带 `.md`，例如 `[安装](../guide/install)`；链到别的仓库的文件写完整的 GitHub 地址。
- 不加统计脚本、不从别的网站取字体或图片。
- 图片、图标类改动先开 issue，写明来源和许可证。

## 检查

PR 上的 CI 会：

- 编译整站，有死链就失败；
- 跑隐私扫描（`python scripts/privacy.py .`），文档里出现本机用户目录这类路径就失败。

合进 `main` 以后自动发布到 GitHub Pages。

## 写法

- 中文，短句，写用户看得懂的说法。
- 写清楚是哪个版本起有的、哪个版本起变的。
- 能用表格、列表的就别写成大段。
- 命令写完整、能直接复制，路径用 `<占位符>` 标出要换的部分。

## 硬件

不限，能跑 Node.js 和 Python 就行。

## 模型建议

Sonnet 5.5 或 GPT-6.1 Terra；批量格式调整用 Haiku 5.5 或 GPT-6 Luna。
