# 文档和本站

## 文档在哪

| 内容 | 在哪改 |
|---|---|
| 本站（使用说明、组件介绍、参与开发） | [modavd.github.io](https://github.com/ModAVD/modavd.github.io) 仓库的 `docs/` |
| 各仓库自己的 README、`CONTRIBUTING`、`AGENTS`（中文 `X.md`、英文 `X.en.md`，逐节对应） | 各自的仓库 |
| 发版说明、补丁说明（`release/`、`patches/BASE.md`）、仓库清单 | ModAVD 仓库，由发版工具导出，**不要手改**，有问题先开 issue |

每页底部有「在 GitHub 上改这一页」，点进去直接改、提 PR 就行。

## 本地预览本站

要 Node.js 24。在仓库根目录：

```powershell
npm ci --ignore-scripts
npm run dev       # 本地预览，改了自动刷新
npm run build     # 编出静态页面，有死链会报错
python scripts/i18n.py   # 核对中英两边的页面和标题
```

- 页面是 `docs/` 下的 Markdown，英文页在 `docs/en/` 下，路径和中文页一一对应。侧边栏和导航在 `docs/.vitepress/config.mts`，两种语言的标题写在同一张表里（`[链接, 中文标题, 英文标题]`），新加页面加一行。
- 提示框用 `::: tip`、`::: warning`、`::: danger`、`::: info`。
- 站内链接写相对路径、不带 `.md`，例如 `[安装](../guide/install)`；链到别的仓库的文件写完整的 GitHub 地址。
- 不加统计脚本、不从别的网站取字体或图片。
- 图片、图标类改动先开 issue，写明来源和许可证。

## 检查

PR 上的 CI 会：

- 编译整站，有死链就失败；
- 核对中英两边（`python scripts/i18n.py`）：每页都有两种语言，标题的层级和顺序相同，站内链接不串到另一种语言，`#锚点` 都找得到；只改了一种语言的页面会标出提醒；另外两边代码块数量、链到的网址不同，或一边的最近改动晚于另一边，也会标出提醒（只提醒，不让 CI 失败）；
- 跑隐私扫描（`python scripts/privacy.py .`），文档里出现本机用户目录这类路径就失败。

合进 `main` 以后自动发布到 GitHub Pages。

## 写法

- 中文是主语言，英文页逐页对应。改了中文页，在同一个 PR 里把对应的英文页也改了；不会写英文的，在 PR 里说一声，由维护者补上。
- 中文，短句，写用户看得懂的说法。英文照意思写成自然的英文，不逐字硬译。
- 术语照[术语对照表](https://github.com/ModAVD/ModAVDManager/blob/main/internal/i18n/README.md#terms)写。管理器的按钮和菜单名，英文页照管理器英文界面上的写，不写中文原文加括号。表里没有的词，用代码里的名字或中文原文，不自己造译名；用得多了就往表里加一行。
- 写清楚是哪个版本起有的、哪个版本起变的。
- 能用表格、列表的就别写成大段。
- 命令写完整、能直接复制，路径用 `<占位符>` 标出要换的部分。

## 硬件

不限，能跑 Node.js 和 Python 就行。

## 模型建议

Sonnet 5.5 或 GPT-6.1 Terra；批量格式调整用 Haiku 5.5 或 GPT-6 Luna。
