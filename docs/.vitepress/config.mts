import { defineConfig } from 'vitepress'

const repo = 'https://github.com/ModAVD/modavd.github.io'

export default defineConfig({
  lang: 'zh-CN',
  title: 'ModAVD',
  description: '给 Windows 上的挂机脚本用的安卓模拟器',
  cleanUrls: true,
  lastUpdated: true,
  // 不往外取字体、统计脚本，页面只用本站自己的文件
  head: [['meta', { name: 'theme-color', content: '#3c6fb4' }]],

  locales: {
    root: { label: '简体中文', lang: 'zh-CN' },
    en: {
      label: 'English',
      lang: 'en-US',
      description: 'An Android emulator for unattended automation scripts on Windows',
      themeConfig: {
        nav: [{ text: 'GitHub', link: 'https://github.com/ModAVD/ModAVD' }],
        sidebar: { '/en/': [{ text: 'English', items: [{ text: 'Overview', link: '/en/' }] }] },
      },
    },
  },

  themeConfig: {
    nav: [
      { text: '使用', link: '/guide/', activeMatch: '/guide/' },
      { text: '组件', link: '/components/manager', activeMatch: '/components/' },
      { text: '参与开发', link: '/develop/', activeMatch: '/develop/' },
      {
        text: '下载',
        items: [
          { text: 'ModAVD（整包）', link: 'https://github.com/ModAVD/ModAVD/releases' },
          { text: 'ModAVDManager', link: 'https://github.com/ModAVD/ModAVDManager/releases' },
          { text: 'ModAVDHostIME', link: 'https://github.com/ModAVD/ModAVDHostIME/releases' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '使用',
          items: [
            { text: '这是什么', link: '/guide/' },
            { text: '安装', link: '/guide/install' },
            { text: '升级', link: '/guide/upgrade' },
            { text: '和官方模拟器有什么不同', link: '/guide/changes' },
            { text: '反馈问题', link: '/guide/feedback' },
            { text: '隐私', link: '/guide/privacy' },
            { text: '许可证与源码', link: '/guide/license' },
          ],
        },
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: '管理器和命令行', link: '/components/manager' },
            { text: 'arm64 执行桥', link: '/components/bridge' },
            { text: '宿主输入法', link: '/components/ime' },
          ],
        },
      ],
      '/develop/': [
        {
          text: '开始',
          items: [
            { text: '参与 ModAVD', link: '/develop/' },
            { text: '分区一览和通用要求', link: '/develop/overview' },
            { text: '用 AI 工具协助', link: '/develop/ai' },
          ],
        },
        {
          text: '各分区',
          items: [
            { text: '模拟器本体', link: '/develop/emulator' },
            { text: '从源码构建', link: '/develop/build' },
            { text: 'arm64 执行桥', link: '/develop/bridge' },
            { text: '管理器和命令行', link: '/develop/manager' },
            { text: '宿主输入法', link: '/develop/ime' },
            { text: '随包脚本', link: '/develop/package' },
            { text: '文档和本站', link: '/develop/docs' },
            { text: 'AUTO-MAS 对接', link: '/develop/automas' },
            { text: '游戏实测和兼容性报告', link: '/develop/testing' },
          ],
        },
        {
          text: '查问题',
          items: [
            { text: '适配新游戏', link: '/develop/adapt-game' },
            { text: '卡顿、掉帧怎么查', link: '/develop/performance' },
            { text: '常见问题怎么查', link: '/develop/troubleshooting' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/ModAVD' }],

    editLink: {
      pattern: `${repo}/edit/main/docs/:path`,
      text: '在 GitHub 上改这一页',
    },

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '没有找到',
                resetButtonTitle: '清除',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        },
      },
    },

    footer: {
      message: '非官方项目，与 Google 没有关联。Android 是 Google LLC 的商标。',
      copyright: '文档按 Apache License 2.0 发布',
    },

    outline: { level: [2, 3], label: '本页内容' },
    docFooter: { prev: '上一页', next: '下一页' },
    lastUpdated: { text: '最后更新' },
    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '目录',
    darkModeSwitchLabel: '深色模式',
    lightModeSwitchTitle: '切换到浅色',
    darkModeSwitchTitle: '切换到深色',
    langMenuLabel: '语言',
    notFound: { title: '页面不存在', quote: '这个地址没有页面，可能是改名或挪走了。', linkText: '回首页' },
  },
})
