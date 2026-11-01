---
layout: home

hero:
  name: ModAVD
  text: 魔改 AVD
  tagline: 面向 Windows 的安卓模拟器，重点优化无人值守自动化，也可以独立管理实例。基于 AOSP Android Emulator，加了一批补丁后自己编译。
  actions:
    - theme: brand
      text: 安装
      link: /guide/install
    - theme: alt
      text: 这是什么
      link: /guide/
    - theme: alt
      text: 参与开发
      link: /develop/

features:
  - title: 面向无人值守
    details: 通常不开窗口运行，由 AUTO-MAS 等自动化工具拉起、跑完关掉；也可以用随包的管理器或命令行直接管理实例，需要看画面或手动登录时可带窗口启动。
  - title: 扛得住强行结束
    details: 数据盘以直写方式交给安卓，降低强行结束时 qcow2 元数据损坏的风险；仍应先 sync，崩溃处理也不再随机退出。
  - title: 少占资源
    details: 安卓释放的内存还给 Windows；新实例第一次开机不再临时占满数据盘上限；图形暂存缓冲按需增长。
  - title: 当前版本减少宿主侧外传
    details: 已发布的 0.36.0 模拟器构建禁用使用统计、崩溃上传、更新检查和特性开关下载；位置页等用户主动打开的功能、安卓客体和第三方应用仍按各自需要联网。
  - title: arm64 游戏也能跑
    details: 随包的 arm64 执行桥目前已在《阴阳师》官服上实测；其他渠道包因同一游戏和加固纳入名单，其他只有 arm64 的游戏仍需逐个验证。
  - title: 补丁全部公开
    details: QEMU、gfxstream、Crashpad 的改动以补丁形式公开，每个 Release 附完整的对应源码。
---
