# arm64 执行桥

让只有 arm64 版本、带加固的游戏能在 ModAVD 的 x86_64 系统镜像上跑起来。现在只对《阴阳师》的 7 个渠道包生效。0.36.0 起随 Release 主包提供，装在 `sdk\emulator\resources\modavd\`。

::: info 不碰游戏
执行桥**不修改、不打补丁、不绕过游戏或它的加固库，也不干预任何完整性或防篡改校验**。这是转译层的兼容性工程：让游戏自己装的钩子正确执行并返回。Intel Houdini 本来就是这么做的，同一个游戏在 Houdini 上就能跑。Google 的转译层二进制我们一个字节都不改。
:::

## 为什么需要它

x86_64 镜像靠 Google 的转译层跑 arm64 应用：系统库保持原生 x86_64，只转译应用自带的 arm64 库。

游戏的加固库会把系统库里一些函数入口改成指向它自己的 arm64 代码。真机上两边都是 arm64，没问题；在 x86_64 镜像上，原生代码一跳进 arm64 代码就崩，因为转译层只支持「转译代码调原生」，不支持反过来。执行桥用转译层自己导出的接口补上了这条路。原理详见[开发：arm64 执行桥](../develop/bridge)。

## 只对名单里的游戏生效

- 名单现在是《阴阳师》的 7 个渠道包。
- 名单外的应用在进程启动后把执行桥改过的地方都撤回原样，行为和没装桥时一样。

## 装进实例

- **0.36.0 起不用自己装**：用管理器 `ModAVD.exe` 或命令行 `tools\modavd.exe start` 开机时，新建的和已有的实例都会自动带好桥。开机流程做完后桥还没装就装上，没生效就关机冷启动，最多三轮。第一次开机要多 1–2 分钟。
- 装好以后照常用 AUTO-MAS 开机，桥一直在。
- 只用 AUTO-MAS 开机、从没用管理器开过的实例，这一版还不会自动装：用管理器把它开一次机就行。
- 桥装在实例自己的 system / vendor 覆盖层里，不动 Google 的原始镜像。

## 不想要桥

- 新建时用 `tools\modavd.exe create --no-bridge`；
- 对已有实例运行 `tools\modavd.exe bridge <编号> uninstall`，之后开机都不再自动装（再 `install` 就恢复）；
- `start --no-bridge` 只管这一次；
- 只读检查用 `bridge <编号> verify`（实例要开着）。

::: warning 退回旧版本之前
退回 0.36.0 以前的版本之前，先在每一台实例上运行一次 `tools\modavd.exe bridge <编号> uninstall`，看到结果是「没装」再换包。不先卸就退版，那台实例上所有只有 arm64 版本的应用都会跑不起来。
:::

源码在 ModAVD 仓库的 [`bridge/`](https://github.com/ModAVD/ModAVD/tree/main/bridge)，按 AGPL-3.0-or-later 发布。
