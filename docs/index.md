---
layout: home

hero:
  name: ModAVD
  text: 魔改 AVD
  tagline: 基于 AOSP Android Emulator 的安卓模拟器，加了一批补丁后自己编译。目前支持 Windows，以后计划支持更多平台。
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
  - title: 开窗口用，也能无头跑
    details: 可以开窗口当普通模拟器用，也可以不开窗口运行，由自带的管理器、命令行或 AUTO-MAS 这类自动化工具拉起、用完关掉。
  - title: 扛得住强行结束
    details: 数据盘以直写方式交给安卓，强行结束模拟器不会弄坏虚拟磁盘的元数据；崩溃处理不再随机退出。
  - title: 少占资源
    details: 安卓释放的内存还给 Windows；新实例第一次开机不再临时占满数据盘上限；图形暂存缓冲按需增长。
  - title: 不向 Google 上传数据
    details: 模拟器不向 Google 上传使用统计和崩溃报告，不向 Google 检查更新，也不从 Google 下载特性开关。安卓和应用照常联网。
  - title: arm64 游戏也能跑
    details: 随包的 arm64 执行桥让只有 arm64 版本、带加固的游戏（《阴阳师》各渠道包）在 x86_64 镜像上跑起来。
  - title: 补丁全部公开
    details: QEMU、gfxstream、Crashpad 的改动以补丁形式公开，每个 Release 附完整的对应源码。
---
