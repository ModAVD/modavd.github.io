# AUTO-MAS 对接

**改什么**：[AUTO-MAS](https://github.com/AUTO-MAS-Project/AUTO-MAS) 里管理 ModAVD 实例的部分，正在从它自己的 Python 实现改成调用 `modavd` 命令行。

## 环境

按 AUTO-MAS 仓库自己的开发规范（Python 环境、前端生成物、测试要求）。

## 硬件

另加 AUTO-MAS 自己的开发环境。要开实例，最好再装一个游戏实跑。

| | 推荐 | 最低 |
|---|---|---|
| CPU | 8 核 16 线程 | 4 核 8 线程 |
| 内存 | 32 GB | 16 GB |
| 硬盘可用空间 | 100 GB | 50 GB |

## 对接要点

- stdout 是一行 JSON，日志在 stderr，两个要分开收；
- 以 `error.code` 为准；
- 第一次开机装执行桥会多重启一两次，时限要放宽；
- 关机走 `modavd stop`，它先 sync 再关；
- adb 只走根目录的私有 server，不碰 5037。

命令和机读输出的契约见 [ModAVDManager 的 README](https://github.com/ModAVD/ModAVDManager#命令行)。

## 模型建议

Sonnet 5.5 或 GPT-6.1 Sol 写；子进程、时限、更新期间的互斥这些地方，用 Opus 5.5 或 GPT-6 Astra 审。
