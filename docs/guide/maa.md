# 用 MAA 连 ModAVD

单独装 MAA 的用户，按这一页配。用 AUTO-MAS 的不用看，AUTO-MAS 会自动配好。

MAA 支持 ModAVD 后，这一页会改成直接选 ModAVD。

## 原理

ModAVD 带一个 MuMu 兼容外壳，在 `<ModAVD 根目录>\mumu-shim\`。MAA 现在只认 MuMu 的截图接口，会到「MuMu 安装路径」下加载 `shell\sdk\external_renderer_ipc.dll`。所以在 MAA 里按 MuMu 配，截图就走 ModAVD 的共享内存，实测约 2 ms。点击还是走 MaaTouch，外壳不管输入。

## 准备

- ModAVD 0.40.1 起包里带 `mumu-shim` 目录。
- 更早的版本：先更新到 0.40.1；或者从 [ModAVDExtras 的 Release](https://github.com/ModAVD/ModAVDExtras/releases) 下载 v0.1.3 以后的 `external_renderer_ipc.dll`，放进 `<ModAVD 根目录>\mumu-shim\shell\sdk\`。
- 先把要连的实例开机。

## 设置

在 MAA 的「设置 → 连接设置」里，按顺序：

1. 「连接配置」选「MuMu 模拟器」。
2. 关掉「自动检测连接」。不关，MAA 会把连接地址改回 MuMu 的。
3. 勾上「启用 MuMu 截图增强」，在弹出的提示里点确定。
   - 「启用 MuMu 触控增强」不要勾。
4. 「MuMu 安装路径」填 `<ModAVD 根目录>\mumu-shim`，例如 `D:\ModAVD\mumu-shim`。
   - 路径下没有 `shell\sdk\external_renderer_ipc.dll` 时，MAA 会拒绝这个路径。
   - 勾上截图增强时 MAA 可能已按注册表填了真 MuMu 的路径，改成上面这个。
5. 勾上「MuMu 网络桥接模式」，在警告里点「确认」，再填「实例编号」：ModAVD 里的实例编号（0、1、2……，就是管理器卡片上的编号）。
   - 不勾的话，MAA 会按连接地址的端口去推 MuMu 的实例号，推出来是错的，截图会失败。
6. 「触控模式」选「MaaTouch（实验功能）」。
7. 「连接地址」填 `127.0.0.1:<端口>`，就是管理器卡片上显示的 adb 地址。默认是 `20001 + 10 × 编号`；根目录改过端口段的，以管理器显示的为准。
8. 「ADB 路径」填 `<ModAVD 根目录>\sdk\platform-tools\adb.exe`。

## 确认生效

MAA 连接成功后：

- `<ModAVD 根目录>\mumu-shim\avdshim.log` 里有 `connect index=<编号> port=<端口>`。
- MAA 日志的截图测速里，选中的是 MumuExtras。

## 出问题时

- `avdshim.log` 里写 `shared memory unavailable`：多半是「实例编号」填错了，或者实例没开。先看编号。
- MAA 提示找不到 `external_renderer_ipc.dll`：检查 `<ModAVD 根目录>\mumu-shim\shell\sdk\` 里有没有这个文件。
- 连接地址总被改回去：确认「自动检测连接」已关。