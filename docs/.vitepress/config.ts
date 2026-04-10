import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '経営者のAI開発プレイブック',
  description: 'プログラミング未経験の経営者が、Claude × VS Code で自社アプリを作るための実践ガイド',
  lang: 'ja',
  head: [
    ['meta', { property: 'og:title', content: '経営者のAI開発プレイブック' }],
    ['meta', { property: 'og:description', content: 'コードが書けなくても、アプリは作れる。51歳からのAI開発実践ガイド。' }],
    ['meta', { property: 'og:type', content: 'website' }],
  ],
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: 'ホーム', link: '/' },
      { text: 'ガイド', link: '/guide/' },
      { text: 'フィードバック', link: '/guide/feedback' },
      {
        text: '章から選ぶ',
        items: [
          { text: '\u26a0\ufe0f プロンプトの出し方（最重要）', link: '/guide/prompt-craft' },
          { text: '序章：2週間の記録', link: '/guide/00-journey' },
          { text: '第1章：なぜ自分で作るのか', link: '/guide/01-why' },
          { text: '第2章：VS Codeを司令塔にする', link: '/guide/02-vscode' },
          { text: '第3章：Gitでセーブポイントを作る', link: '/guide/03-git' },
          { text: '第4章：Claude Codeと開発する', link: '/guide/04-claude-code' },
          { text: '第5章：最初のアプリを作る', link: '/guide/05-first-app' },
          { text: '第6章：プロジェクトを管理する', link: '/guide/06-project-management' },
          { text: '第7章：2台のPCで同じ環境を使う', link: '/guide/07-multi-pc' },
          { text: '第8章：MCPでClaude Codeを外部サービスに繋げる', link: '/guide/08-mcp' },
          { text: '筆者について — Code Runner F', link: '/guide/about-author' },
          { text: '付録：トラブルシューティング', link: '/guide/99-troubleshooting' },
        ]
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'はじめに',
          items: [
            { text: 'このプレイブックについて', link: '/guide/' },
            { text: '2週間の記録 — ゼロから8プロジェクトへ', link: '/guide/00-journey' },
          ]
        },
        {
          text: '基礎を整える',
          items: [
            { text: '第1章：なぜ自分で作るのか', link: '/guide/01-why' },
            { text: '第2章：VS Codeを司令塔にする', link: '/guide/02-vscode' },
            { text: '第3章：Gitでセーブポイントを作る', link: '/guide/03-git' },
          ]
        },
        {
          text: '最重要',
          items: [
            { text: '\u26a0\ufe0f プロンプトの出し方', link: '/guide/prompt-craft' },
          ]
        },
        {
          text: '作って動かす',
          items: [
            { text: '第4章：Claude Codeと開発する', link: '/guide/04-claude-code' },
            { text: '第5章：最初のアプリを作る', link: '/guide/05-first-app' },
          ]
        },
        {
          text: '運用する',
          items: [
            { text: '第6章：プロジェクトを管理する', link: '/guide/06-project-management' },
            { text: '第7章：2台のPCで同じ環境を使う', link: '/guide/07-multi-pc' },
            { text: '第8章：MCPで外部サービスに繋げる', link: '/guide/08-mcp' },
          ]
        },
        {
          text: '付録',
          items: [
            { text: 'トラブルシューティング', link: '/guide/99-troubleshooting' },
            { text: '筆者について — Code Runner F', link: '/guide/about-author' },
            { text: '変更履歴', link: '/guide/changelog' },
            { text: 'フィードバック', link: '/guide/feedback' },
          ]
        },
      ]
    },
    socialLinks: [
      { icon: 'facebook', link: 'https://www.facebook.com/furuyafumitaka/' },
      { icon: 'github', link: 'https://github.com/fumitakafuruya-ai/playbook' }
    ],
    footer: {
      message: '<a href="https://www.facebook.com/furuyafumitaka/" target="_blank">古屋 文隆（Fumitaka Furuya）</a>',
      copyright: 'Copyright &copy; 2026 Fumitaka Furuya. All rights reserved.'
    },
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: '目次'
    },
    docFooter: {
      prev: '前のページ',
      next: '次のページ'
    },
    lastUpdated: {
      text: '最終更新',
    },
    returnToTopLabel: 'トップへ戻る',
    sidebarMenuLabel: 'メニュー',
  }
})
