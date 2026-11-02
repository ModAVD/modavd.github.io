---
layout: home

hero:
  name: ModAVD
  text: An Android emulator for Windows
  tagline: Built from the AOSP Android Emulator plus a set of patches, and compiled by the project itself. It runs on Windows today; more platforms are planned.
  actions:
    - theme: brand
      text: Install
      link: /en/guide/install
    - theme: alt
      text: What is ModAVD
      link: /en/guide/
    - theme: alt
      text: Contribute
      link: /en/develop/

features:
  - title: Windowed or headless
    details: Run it with a window as an ordinary emulator, or without one. The bundled manager, the CLI or an automation tool such as AUTO-MAS starts it and shuts it down when you are done.
  - title: Survives a force-kill
    details: The data disk is handed to Android write-through, so force-killing the emulator does not corrupt the virtual disk's metadata. Crash handling no longer exits at random.
  - title: Uses fewer resources
    details: Memory that Android frees goes back to Windows. A new instance no longer takes up the full data disk limit on its first boot. The graphics staging buffer grows on demand.
  - title: No data sent to Google
    details: The emulator does not upload usage statistics or crash reports to Google, does not check Google for updates, and does not download feature flags from Google. Android and its apps use the network as usual.
  - title: arm64-only games run too
    details: The bundled arm64 execution bridge lets games that only have an arm64 build and use app hardening (the Onmyoji channel builds) run on an x86_64 system image.
  - title: All patches are public
    details: The changes to QEMU, gfxstream and Crashpad are published as patches, and every release comes with the full matching source.
---
