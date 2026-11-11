import { defineConfig, type DefaultTheme } from 'vitepress'

const repo = 'https://github.com/ModAVD/modavd.github.io'
const origin = 'https://modavd.github.io'

type Lang = 'zh' | 'en'

// 页面标题，两种语言放在同一张表里：新加页面时两边一起写。
// [链接, 中文标题, 英文标题]
type Page = [link: string, zh: string, en: string]

const guide: Page[] = [
  ['/guide/', '这是什么', 'What is ModAVD'],
  ['/guide/install', '安装', 'Install'],
  ['/guide/upgrade', '升级', 'Upgrade'],
  ['/guide/playstore', 'Google Play 商店', 'Google Play Store'],
  ['/guide/changes', '和官方模拟器有什么不同', 'How ModAVD differs from the official emulator'],
  ['/guide/feedback', '反馈问题', 'Report a problem'],
  ['/guide/false-positive', '杀毒软件误报怎么办', 'What to do when antivirus software flags ModAVD'],
  ['/guide/privacy', '隐私', 'Privacy'],
  ['/guide/license', '许可证与源码', 'Licenses and source code'],
]

const components: Page[] = [
  ['/components/manager', '管理器和命令行', 'The manager and CLI'],
  ['/components/app-proxy', '按应用走代理', 'Per-app proxy'],
  ['/components/bridge', 'arm64 执行桥', 'The arm64 execution bridge'],
  ['/components/ime', '宿主输入法', 'The host IME'],
]

const develop: { group: [zh: string, en: string]; pages: Page[] }[] = [
  {
    group: ['开始', 'Getting started'],
    pages: [
      ['/develop/', '参与 ModAVD', 'Contributing to ModAVD'],
      ['/develop/overview', '分区一览和通用要求', 'Areas and common requirements'],
      ['/develop/ai', '用 AI 工具协助', 'Using AI tools'],
    ],
  },
  {
    group: ['各分区', 'Areas'],
    pages: [
      ['/develop/emulator', '模拟器本体', 'The emulator itself'],
      ['/develop/build', '从源码构建', 'Building from source'],
      ['/develop/bridge', 'arm64 执行桥', 'The arm64 execution bridge'],
      ['/develop/manager', '管理器和命令行', 'The manager and CLI'],
      ['/develop/ime', '宿主输入法', 'The host IME'],
      ['/develop/package', '随包脚本', 'Bundled scripts'],
      ['/develop/docs', '文档和本站', 'Documentation and this site'],
      ['/develop/automas', 'AUTO-MAS 对接', 'AUTO-MAS integration'],
      ['/develop/testing', '游戏实测和兼容性报告', 'Game testing and compatibility reports'],
    ],
  },
  {
    group: ['查问题', 'Investigating problems'],
    pages: [
      ['/develop/adapt-game', '适配新游戏', 'Adapting a new game'],
      ['/develop/performance', '卡顿、掉帧怎么查', 'Investigating stutter and frame drops'],
      ['/develop/troubleshooting', '常见问题怎么查', 'Investigating common problems'],
    ],
  },
]

const label = {
  zh: {
    guide: '使用', components: '组件', develop: '参与开发', download: '下载', fullPackage: 'ModAVD（整包）',
    description: '基于 AOSP Android Emulator 的安卓模拟器',
  },
  en: {
    guide: 'Guide', components: 'Components', develop: 'Contributing', download: 'Download', fullPackage: 'ModAVD (full package)',
    description: 'An Android emulator built from the AOSP Android Emulator',
  },
}

function nav(lang: Lang): DefaultTheme.NavItem[] {
  const p = lang === 'en' ? '/en' : ''
  const l = label[lang]
  return [
    { text: l.guide, link: `${p}/guide/`, activeMatch: `${p}/guide/` },
    { text: l.components, link: `${p}/components/manager`, activeMatch: `${p}/components/` },
    { text: l.develop, link: `${p}/develop/`, activeMatch: `${p}/develop/` },
    {
      text: l.download,
      items: [
        { text: l.fullPackage, link: 'https://github.com/ModAVD/ModAVD/releases' },
        { text: 'ModAVDManager', link: 'https://github.com/ModAVD/ModAVDManager/releases' },
        { text: 'ModAVDHostIME', link: 'https://github.com/ModAVD/ModAVDHostIME/releases' },
      ],
    },
  ]
}

function sidebar(lang: Lang): DefaultTheme.Sidebar {
  const p = lang === 'en' ? '/en' : ''
  const items = (pages: Page[]) => pages.map(([link, zh, en]) => ({ text: lang === 'en' ? en : zh, link: p + link }))
  const i = lang === 'en' ? 1 : 0
  return {
    [`${p}/guide/`]: [{ text: label[lang].guide, items: items(guide) }],
    [`${p}/components/`]: [{ text: label[lang].components, items: items(components) }],
    [`${p}/develop/`]: develop.map(({ group, pages }) => ({ text: group[i], items: items(pages) })),
  }
}

// <link rel="alternate" hreflang> 指向同一页的另一种语言
function alternates(relativePath: string): [string, Record<string, string>][] {
  if (!relativePath.endsWith('.md') || relativePath === '404.md') return []
  const url = (path: string) => origin + '/' + path.replace(/\.md$/, '').replace(/(^|\/)index$/, '$1')
  const zh = relativePath.replace(/^en\//, '')
  return [
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: url(zh) }],
    ['link', { rel: 'alternate', hreflang: 'en', href: url('en/' + zh) }],
  ]
}

export default defineConfig({
  title: 'ModAVD',
  cleanUrls: true,
  lastUpdated: true,
  // 不往外取字体、统计脚本，页面只用本站自己的文件
  head: [['meta', { name: 'theme-color', content: '#3c6fb4' }]],
  transformHead: ({ pageData }) => alternates(pageData.relativePath),

  // 中文（根）和英文（/en/）各一份导航、侧边栏和界面文字，页面一一对应
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      description: label.zh.description,
      themeConfig: {
        nav: nav('zh'),
        sidebar: sidebar('zh'),
        editLink: { pattern: `${repo}/edit/main/docs/:path`, text: '在 GitHub 上改这一页' },
        footer: { message: 'Android 是 Google LLC 的商标。', copyright: '文档按 Apache License 2.0 发布' },
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
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      description: label.en.description,
      themeConfig: {
        nav: nav('en'),
        sidebar: sidebar('en'),
        editLink: { pattern: `${repo}/edit/main/docs/:path`, text: 'Edit this page on GitHub' },
        footer: { message: 'Android is a trademark of Google LLC.', copyright: 'Documentation is published under the Apache License 2.0' },
        outline: { level: [2, 3], label: 'On this page' },
        docFooter: { prev: 'Previous page', next: 'Next page' },
        lastUpdated: { text: 'Last updated' },
        returnToTopLabel: 'Back to top',
        sidebarMenuLabel: 'Menu',
        darkModeSwitchLabel: 'Appearance',
        lightModeSwitchTitle: 'Switch to light theme',
        darkModeSwitchTitle: 'Switch to dark theme',
        langMenuLabel: 'Language',
        notFound: {
          title: 'PAGE NOT FOUND',
          quote: 'There is no page at this address; it may have been renamed or moved.',
          linkText: 'Take me home',
        },
      },
    },
  },

  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/ModAVD' }],

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
  },
})
