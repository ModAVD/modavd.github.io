# 随包脚本

**改什么**：随 ModAVD 包发的脚本，在 ModAVD 仓库的 [`package/`](https://github.com/ModAVD/ModAVD/tree/main/package)。三个 `.bat` 放在包的根目录，四个 `.ps1` 放在包的 `tools\` 里，和包里发出的文件逐字节相同。

| 文件 | 做什么 | 从哪一版起在包里 |
| --- | --- | --- |
| `补全组件.bat` → `fetch-components.ps1` | 先显示 Google《Android 软件开发套件许可协议》，同意后从官方渠道下载 adb 和系统镜像，校验 SHA-1 后装进 `sdk\`；能断点续传，镜像按顺序回落 | 37.2.10-mas30 |
| `收集问题信息.bat` → `collect-info.ps1` | 在桌面生成问题包，见[反馈问题](../guide/feedback) | 37.2.10-mas30 |
| `复制配置信息.bat` → `report-config.ps1` | 把电脑配置和各实例装的游戏包整理成一段文字，复制到剪贴板，贴到「兼容性报告」帖 | 0.35.0 |
| `modavd-bridge.ps1` | 给一台实例装上、卸掉或核对 arm64 执行桥，见[开发：arm64 执行桥](./bridge#怎么装进实例) | 0.36.0 |

## 写法上的规矩

- 要在 Windows 自带的 PowerShell 5.1 上也能跑，用户机器上默认是它：
  - `.ps1` 存成 UTF-8 带 BOM；
  - `.bat` 里只用 ASCII，换行用 CRLF；
  - `.gitattributes` 让这个目录原样保存，不做换行转换。提 PR 时请保持文件原来的换行和 BOM，仓库里的字节就是发布包里的字节。
- 不硬编码本机路径；adb 只走 ModAVD 根目录 `mas-avd.json` 里的私有端口，不碰 5037。
- 重启、关机前先 `adb shell sync`，再结束模拟器。
- 输出给用户贴到公开 issue 的内容，不能带用户名、电脑名、完整路径、游戏账号。

## 硬件

要在装好的 ModAVD 上真跑，要开一台实例：

| | 推荐 | 最低 |
|---|---|---|
| CPU | 8 核 16 线程 | 4 核 8 线程 |
| 内存 | 16 GB | 16 GB |
| 硬盘可用空间 | 30 GB | 20 GB |

## 验证

在 Windows 10 / 11、不同系统语言下，用 PowerShell 5.1 各跑一遍。

## 交付

先开 issue 说一声，再提 PR。合进来以后随下一版 Release 发出，发版说明里会写。许可证是 AGPL-3.0-or-later。

## 模型建议

Sonnet 5.5 或 GPT-6.1 Sol；换行、编码这类机械检查用 Haiku 5.5 或 GPT-6 Luna。
