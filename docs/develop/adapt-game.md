# 适配新游戏

想让一个现在起不来或跑不好的游戏在 ModAVD 上用起来，按下面的顺序做。适配没有单独的代码目录：查清原因以后，改动落在执行桥、模拟器本体或自动化脚本的某一处。以前查过的具体案例见[常见问题怎么查](./troubleshooting)。

## 准备

- 用最新版 ModAVD，新建一台专门的实例，登测试账号。适配过程要反复装卸、强杀，不要用平时挂机的实例。旧版缺很多东西，例如 0.32 还没有 arm64 执行桥。
- adb 用 `mas-avd.json` 里的私有端口：`adb -P <端口> -s emulator-<控制台端口> ...`。下面要 root 的命令写成 `shell su 0 <命令>`。
- 硬件同[游戏实测](./testing#硬件)，再加这个游戏的硬盘空间。

## 第一步：摸清这个游戏 {#step1}

- 包名、渠道（官服、B 服、各应用商店）、游戏版本。包名用 `shell pm list packages | findstr <关键词>` 查。
- 它是不是只有 arm64：`shell dumpsys package <包名> | findstr primaryCpuAbi`。`arm64-v8a` 要走转译；`x86_64` 或 `x86` 是原生跑。
- 它带不带加固或反作弊：解开 APK，看 `lib/` 下的库名。
- 有没有现成的自动化脚本（MAA 系列、M9A、SRC 这类）。这决定以后能不能进发版回归。

## 第二步：复现，抓证据 {#step2}

- 启动前 `logcat -c`，再 `logcat -b all -v threadtime > 启动.txt`，然后启动游戏，复现以后停。
- 崩了的话，取 `/data/tombstones/` 里最新的那份：`shell su 0 ls -t /data/tombstones`。
- 模拟器日志在根目录的 `logs\` 里。「收集问题信息.bat」会把日志一起打包。
- 重点看这几样：
  - `Fatal signal`：崩在哪个库、哪个线程；
  - `FATAL EXCEPTION`；
  - `ANR in`；
  - 模拟器日志里的 `VK_ERROR`、`DEVICE_LOST`。
- 记清卡在哪一步，是每次都这样还是偶尔。

## 第三步：按原因找能动的地方 {#step3}

先试不用重新编译的办法，确定方向再动代码。

| 原因 | 先试（不用重新编译） | 真要改的话改哪 |
|---|---|---|
| 只有 arm64，崩在转译层或刚启动就退 | 让执行桥临时对它生效：先确认实例装好了桥，再 `shell su 0 setprop modavd.gate.target <包名>`，然后冷启动游戏。这个属性会整体替换名单，不持久，客体重启就没了。看 logcat 里有没有 `shim-ctor OK`、游戏能不能过 | 能过：PR 把包名加进 `bridge/companion/jni/native_to_guest_companion.cc` 的 `kDefaultGateTargets`。还是不行：这是转译层和执行桥的深水区，开 issue 附上 tombstone 和启动 logcat |
| 图形：黑屏、花屏、Vulkan 报错、设备丢失 | 两个默认关闭的环境变量开关（`ANDROID_EMU_VK_HIDE_REBAR=1`、`ANDROID_EMU_VK_ASTC_BC3=1`，见[和官方模拟器有什么不同](../guide/changes#graphics)）；换分辨率（720p / 1080p 两档）；排查时可以用 `modavd bridge <编号> uninstall` 卸桥对比，卸桥会把 GL 传输恢复成原来的 | 模拟器本体的 gfxstream 补丁，见[模拟器本体](./emulator) |
| 卡顿、掉帧 | 按[卡顿、掉帧怎么查](./performance)先找到瓶颈在哪条线程、哪一段；再对比几个现成的开关：GL 传输 asg / pipe、`ANDROID_EMU_VK_HIDE_REBAR=1`、Vulkan 特性开关 | 瓶颈在图形往返：改本体的 gfxstream；在转译：开 issue 讨论；在游戏主线程本身：先接受，或调低画质 |
| 检测到模拟器、root，或进游戏后被踢 | — | 不做。ModAVD 不绕过游戏的保护，也不改游戏文件。记下提示原文，开 issue 说明情况就行 |
| 网络请求超时、热更新失败 | 换网络；查游戏数据目录里有没有 0 字节的文件（硬杀留下的） | 一般不在 ModAVD 里改 |
| 游戏能跑，但自动化脚本认不出画面、点不准 | 看脚本用的截图方式、输入方式和分辨率设置 | 改在脚本那边（例如给它加一个 ModAVD 用的资源覆盖层），不改 ModAVD |

## 第四步：交付 {#step4}

- 先开 issue「适配：<游戏名>（<渠道>）」，写清前三步查到的东西和打算怎么改。
- 加执行桥名单：PR 只改 `kDefaultGateTargets`，附上这几样证据：
  - 加名单前后的启动 logcat；
  - 名单里原有的游戏（阴阳师）照常；
  - 一个名单外的游戏照常，日志里有「撤回」那一行。

  载荷由维护者重编、固定哈希，随下一版发。
- 改图形：照[模拟器本体](./emulator#patches)交补丁。
- 不要求你跑全套回归，维护者会在自己的机器上编、测。

## 第五步：适配好以后 {#after}

- 在「兼容性报告」帖里记一笔：游戏、渠道、版本、怎么跑起来的、帧率大概多少。
- 有自动化脚本、又有不耗资源的任务的，维护者会把它加进发版回归，并存下帧率基准。

## 规矩

用测试账号；不改游戏文件，不绕过游戏的保护；不抽卡、不买东西；遇到更新提示先停下；关模拟器先 sync。

## 模型建议

- 第一、二步和第三步的分类，读 logcat 和模拟器日志：Sonnet 5.5 或 GPT-6.1 Sol；
- 查转译层、执行桥、图形问题的根因：Opus 5.5 或 GPT-6 Astra，推理开高。
