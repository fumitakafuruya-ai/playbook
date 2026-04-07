# Playbook — 経営者のAI開発プレイブック
> **バージョン: v0.1** | 開始: 2026-04-07

## 概要
プログラミング未経験の経営者が、Claude × VS Code で自社アプリを作るための実践ガイド。
VitePressで構築したドキュメントサイト。

## 技術スタック
- VitePress（Markdownベースの静的サイトジェネレーター）
- Vercelでホスティング

## 起動方法
```
npm run dev
```
ブラウザで http://localhost:5173 を開く

## ファイル構成
- `docs/guide/` — 本文（6章 + 付録）
- `docs/.vitepress/config.ts` — サイト設定・サイドバー構成
- `docs/index.md` — トップページ

## 作業ルール
- コンテンツは全てMarkdownで書く
- 新しい章を追加したら config.ts のsidebarも更新する
