# 第8章：MCPでClaude Codeを外部サービスに繋げる

## 「AIが外部サービスを直接操作する」時代

Claude Codeはコードを書くだけではありません。  
**MCP（Model Context Protocol）** という仕組みを使うと、Claude CodeがZoom・Gmail・Google Calendar・Notionなどを**直接**操作できるようになります。

ブラウザを開いて、ログインして、フォームを入力して——という手作業が、**ひと言で完了**します。

## MCPとは何か

MCP（Model Context Protocol）は、Anthropicが策定したオープンな規格です。  
一言で言うと「**AIと外部サービスをつなぐ接続口**」です。

```
Claude Code ←──MCP──→ Zoom
Claude Code ←──MCP──→ Gmail
Claude Code ←──MCP──→ Google Calendar
Claude Code ←──MCP──→ Notion
```

USBのように、対応するサービスであれば**誰でも自由にMCPサーバーを作れる**オープンな規格です。すでに数百種類のMCPサーバーが公開されています。

## CLIとMCPの違い

| | CLI（コマンドライン） | MCP |
|---|---|---|
| 何をするか | ファイル操作・コード実行・Git操作 | 外部サービスの操作 |
| 例 | `npm run dev` `git commit` | ZoomでMTG作成、Gmailで下書き保存 |
| 接続先 | ローカルのファイルシステム | インターネット上のAPIサービス |
| 設定場所 | ターミナル | `claude_desktop_config.json` |

CLIがPCの中を操作するとすれば、MCPはインターネット上のサービスを操作します。  
この2つが揃ったとき、Claude Codeは**デジタル秘書**として機能し始めます。

## 導入済みMCPの例

以下は実際に使用しているMCPの一覧です：

| MCPサーバー | できること |
|---|---|
| Gmail | メール検索・下書き作成・送信 |
| Google Calendar | 予定の追加・確認・更新 |
| Google Tasks | タスクの管理 |
| Google Drive | ファイル検索・取得 |
| Notion | ページ作成・データベース操作 |
| Zoom | ミーティング作成・削除・一覧取得 |
| Canva | デザイン作成・編集 |
| Chatwork | メッセージ送信・チャット管理 |

これらすべてに、Claude Codeがテキスト1行で指示できます。

---

## 事例：定例会議の準備を5分 → 2秒に短縮

### 背景

ある会員制コミュニティでは、週1回の定例会議のたびに幹事役が以下の作業を手作業で行っていました：

1. Zoomのスケジューリングページを開く
2. 会議名・日時・時間・各種設定（録画・ミュート等）を入力
3. ミーティングID・パスコード・URLをコピー
4. Gmailを開いてメールを作成
5. 60名近くの宛先を毎回入力（To・CC）
6. 本文にZoom情報を貼り付けて下書き保存

**毎週5分前後かかっていた作業**です。年間で計算すると約4時間。ミスも発生しやすく（会場名の入力間違いなど）、精神的なストレスにもなっていました。

### MCP導入後

Zoom MCPを自作し、Claude Codeに接続しました。  
今では以下を貼り付けるだけです：

```
/rotary-zoom

定例会議 第○○○回
日時  2026年4月15日(水)
場所  〇〇ホール
題目  ○○について
卓話者　〇〇株式会社代表　山田太郎
```

**結果：2秒で完了。**

Claude Codeが自動で：
- Zoom APIを叩いてミーティングを作成
- ミーティングID・パスコード・URLを取得
- Gmail下書きに60名分の宛先と本文を組み立てて保存

確認して「送信」を押すだけになりました。

### 効果の比較

| | 導入前 | 導入後 |
|---|---|---|
| Zoom作成 | 2〜3分 | **1秒** |
| Gmail下書き作成 | 2〜3分 | **1秒** |
| 合計 | **約5分** | **約2秒** |
| 会場名ミス | 発生あり | **ゼロ** |
| 宛先漏れ | 発生あり | **ゼロ** |

**週1回の作業が年間で4時間 → 約2分に。** しかも精度も上がりました。

---

## Zoom MCPのセットアップ方法

実際にZoom MCPを自作してClaude Codeに繋げた手順を紹介します。  
「自作」といっても、コードはClaude Codeが書いてくれます。

### ステップ1：Zoom Developer Portalでアプリを作る

1. [marketplace.zoom.us](https://marketplace.zoom.us) にサインイン
2. 右上「Develop」→「Build App」を選択
3. **「Server-to-Server OAuth」** を選択してアプリを作成
4. 「App Credentials」タブで以下をコピー：
   - Account ID
   - Client ID
   - Client Secret
5. 「Scopes」タブで **「Meetings」カテゴリをSelect All**
6. 「Activation」タブでアプリを有効化

### ステップ2：MCPサーバーのコードを作成

Claude Codeに「Zoom APIを使ったMCPサーバーを作って」と依頼すると、必要なコードを書いてくれます。  
保存先の例：`~/.claude/mcp/zoom/index.mjs`

### ステップ3：設定ファイルに登録

`%APPDATA%/Claude/claude_desktop_config.json` に以下を追加：

```json
{
  "mcpServers": {
    "zoom": {
      "command": "node",
      "args": ["C:\\Users\\{ユーザー名}\\.claude\\mcp\\zoom\\index.mjs"],
      "env": {
        "ZOOM_ACCOUNT_ID": "取得したAccount ID",
        "ZOOM_CLIENT_ID": "取得したClient ID",
        "ZOOM_CLIENT_SECRET": "取得したClient Secret"
      }
    }
  }
}
```

### ステップ4：Claude Desktopを再起動

再起動後、Claude Codeから `zoom_create_meeting` などのツールが使えるようになります。

::: tip ポイント
Zoomに限らず、REST APIを持つサービスであれば同じ手順でMCPサーバーを自作できます。「〇〇をClaude Codeから操作したい」という要望があれば、まずMCPサーバーの作成をClaude Codeに相談してみてください。
:::

---

## 既製のMCPを使う方法

Zoom以外の多くのサービスは、既製のMCPサーバーが公開されています。  
Claude Desktopの **「設定 → MCP」** 画面から、GUIで簡単に追加できます。

::: info 主なMCPの探し方
- Claude Desktopの設定画面（一番簡単）
- [Anthropic公式MCPリスト](https://modelcontextprotocol.io/)
- GitHub検索：`mcp-server + サービス名`
:::

---

## MCPとスキルを組み合わせる

MCPは「外部サービスへの接続口」、スキルは「よく使う手順書」です。  
この2つを組み合わせると、**複数のサービスをまたいだ自動化**が実現します。

```
/rotary-zoom（スキル）
  └→ zoom_create_meeting（Zoom MCP）
  └→ gmail_create_draft（Gmail MCP）
```

「ひと言 → 複数サービスを横断して処理完了」——これがClaude Codeの真価です。

## まとめ

| 概念 | 役割 |
|---|---|
| Claude Code | 司令塔。指示を受けて実行する |
| CLI | PCの中（ファイル・コード・Git）を操作する |
| MCP | 外部サービス（Zoom・Gmail等）を操作する接続口 |
| スキル | よく使う手順を1コマンドに登録したもの |

この4つが揃うと、**デジタル秘書**の完成です。

## 次の章へ

[付録：トラブルシューティング →](./99-troubleshooting)
