import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '経営者のAI開発プレイブック',
  description: 'プログラミング未経験の経営者が、Claude × VS Code で自社アプリを作るための実践ガイド',
  lang: 'ja',
  themeConfig: {
    nav: [
      { text: 'ホーム', link: '/' },
      { text: 'ガイド', link: '/guide/' },
    ],
    sidebar: [
      {
        text: 'はじめに',
        items: [
          { text: 'このプレイブックについて', link: '/guide/' },
        ]
      },
      {
        text: '第1章：なぜ自分で作るのか',
        items: [
          { text: '経営者がコードを書く時代', link: '/guide/01-why' },
        ]
      },
      {
        text: '第2章：VS Codeを司令塔にする',
        items: [
          { text: 'インストールと日本語化', link: '/guide/02-vscode' },
        ]
      },
      {
        text: '第3章：Gitで「セーブポイント」を作る',
        items: [
          { text: 'コミット・プッシュ・同期', link: '/guide/03-git' },
        ]
      },
      {
        text: '第4章：Claude Codeと開発する',
        items: [
          { text: 'AIとのペアプログラミング', link: '/guide/04-claude-code' },
        ]
      },
      {
        text: '第5章：最初のアプリを作る',
        items: [
          { text: '1時間で動くWebアプリ', link: '/guide/05-first-app' },
        ]
      },
      {
        text: '第6章：プロジェクトを管理する',
        items: [
          { text: '複数プロジェクト管理術', link: '/guide/06-project-management' },
        ]
      },
      {
        text: '付録',
        items: [
          { text: 'トラブルシューティング', link: '/guide/99-troubleshooting' },
        ]
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/fumitakafuruya-ai/playbook' }
    ],
    search: {
      provider: 'local'
    },
    outline: {
      label: '目次'
    },
    docFooter: {
      prev: '前のページ',
      next: '次のページ'
    },
  }
})
