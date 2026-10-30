# 模拟器本体

**改什么**：AOSP 模拟器的 qemu、gfxstream（图形）、crashpad 三个仓库上的补丁。每个版本的补丁在 ModAVD 仓库的 `patches/<仓库>/<系列>/`，对应清单在 `manifests/`。

## 环境

详见[从源码构建](./build)：

- Visual Studio 2022 生成工具 17.14：C++ 桌面生成工具、ATL、MFC、Windows 10 SDK 19041 / Windows 11 SDK 22621；
- Python 3.12、Git for Windows、[repo 工具](https://gerrit.googlesource.com/git-repo/)，都放进 PATH；
- 打开 Windows 开发人员模式（Git 和 repo 要创建符号链接）；
- Git 关闭换行转换、打开符号链接和长路径（`core.autocrlf=false`、`core.symlinks=true`、`core.longpaths=true`）；
- 选一个短的源码目录，留足空间：源码加编译产物约 **124 GB**，建议放在 SSD 上。

## 硬件

| | 推荐 | 最低 |
|---|---|---|
| CPU | 16 核 32 线程：全量编译约 1.5 小时 | 8 核 16 线程：全量预计 3 小时以上（按核数估算，没实测） |
| 内存 | 32 GB：编译完能直接开实例测游戏 | 16 GB：要调低编译并行数，编译时别开实例（估计值） |
| 硬盘可用空间 | 200 GB，SSD：含编译产物、测试实例和一个游戏 | 140 GB：源码加产物约 124 GB，再加一台不装游戏的实例 |

增量编译比全量快得多。

## 拿源码、改补丁 {#patches}

1. 先开 issue，写清要改什么、为什么。
2. 拿源码：在 ModAVD 仓库目录里运行 `python scripts/checks.py patches --work <一个还不存在的目录>`。它从 android.googlesource.com 浅取 AOSP 基准，回放 `patches/` 里当前版本的补丁，每条补丁系列生成一个仓库，如 `qemu-mas36`。
3. 进要改的仓库，**先把提交身份改成你自己的**，因为脚本给这几个仓库设的是维护者的身份：

   ```
   git config user.name "<你的名字或化名>"
   git config user.email "<你的 GitHub noreply 邮箱>"
   ```

4. 改完提交，用 `git format-patch -<提交数>` 导出。把 `.patch` 附在 issue 里，或者开一个只加 `incoming/<主题>/*.patch` 的 PR。这类 PR 不合并：补丁收进下一版后关闭，并写明是哪一版。
5. 不要求你会编译或跑回归。维护者审完会在自己的电脑上编、测。

只回放补丁不需要编译环境；要编出能跑的模拟器，照[从源码构建](./build)。

## 验证

- 编出来以后，在装了 WHPX 和 Vulkan 驱动的机器上开实例，跑真实游戏；
- 图形相关的改动要在不同显卡上看。维护者只有 AMD CPU 加 NVIDIA 显卡这一种配置，所以这部分特别缺人；
- 改到磁盘 IO 路径、关机流程的（块设备、写盘、sync 相关，数据盘格式，客体回写参数），维护者会跑硬杀回归。

## 上游

通用的修复以后可能投 google/gfxstream 或 AOSP Gerrit，上游要求作者本人签 Google CLA，到时会先问你。

## 模型建议

Opus 5.5 或 GPT-6 Astra，推理开高（GPT 选 High 或 Extra High）。崩溃根因、WHPX、gfxstream 的同步问题，都要在很大的代码库里长时间试错，判断错了代价高。改动最后由人审。
