# 第7章：2台のPCで同じ環境を使う

> 「会社のデスクトップで作業して、出先ではノートPC。どちらでも同じClaude Code環境を使いたい。」

これは私が最初にぶつかった課題の一つです。Claude Codeのスキルやメモリは `~/.claude/` フォルダに保存されますが、このフォルダはPC固有。そのままでは2台目のPCでは何もない状態からやり直しです。

この章では、**Dropboxを使って2台のPCで同じClaude Code環境を共有する方法**を説明します。

## 全体の仕組み

核心はシンプルです：**Dropboxに本体を置き、各PCからリンク（ジャンクション）を張る。**

```
Dropbox（同期の中心）
├── Claude-skills/        ← スキル置き場
├── Claude-commands/      ← カスタムコマンド置き場
├── claude-memory/        ← メモリ置き場
└── claude-update.bat     ← 自動更新バッチ
```

各PCの `~/.claude/skills` は、実体ファイルではなく Dropbox 内のフォルダへの **ショートカット**（正確にはジャンクション）です。どちらのPCで編集しても、Dropbox経由でもう一方に反映されます。

## 共有するもの・しないもの

すべてを共有する必要はありません。**共有すべきもの**と**PC固有で良いもの**を分けます。

### 共有するもの（Dropbox経由）

| 何を | なぜ |
|------|------|
| **スキル** | `/ohayo` や `/daily-plan` を両方のPCで使いたい |
| **メモリ** | Claude が覚えている情報を共有したい |
| **カスタムコマンド** | 自作コマンドを両方で使いたい |
| **自動更新バッチ** | Claude Code のバージョンを揃えたい |

### PC固有で良いもの（共有不要）

| 何を | なぜ |
|------|------|
| CLAUDE.md | ファイルパスがPCごとに異なるため |
| launch.json | プレビューサーバーのパスがPCごとに異なるため |
| settings.json | 自動生成される |
| credentials | 認証情報はPCごとに異なる |
| sessions / plans / cache | セッション固有。自動生成される |

## セットアップ手順

### 前提条件

以下が両方のPCにインストール済みであること：

1. **Node.js**（Claude Codeの実行に必要）
2. **Claude Code**（`npm install -g @anthropic-ai/claude-code`）
3. **Dropbox**（同期済み）

### ステップ1：Dropboxにフォルダを作る（1台目のPCで1回だけ）

すでにスキルやメモリがある場合は、それをDropboxに移動します。

```
Dropbox/
├── Claude-skills/        ← ~/.claude/skills の中身をここに移動
├── Claude-commands/      ← ~/.claude/commands の中身をここに移動
└── claude-memory/        ← メモリファイルをここに移動
```

### ステップ2：ジャンクションを作る（各PCで実行）

ジャンクションとは「このフォルダは実はあっちのフォルダです」とWindowsに教える仕組みです。

PowerShellで以下を実行します：

```powershell
# 既存のフォルダがあれば先にリネーム（バックアップ）
Rename-Item "$env:USERPROFILE\.claude\skills" "skills_backup" -ErrorAction SilentlyContinue

# ジャンクションを作成
New-Item -ItemType Junction -Path "$env:USERPROFILE\.claude\skills" -Target "$env:USERPROFILE\Dropbox\Claude-skills"
New-Item -ItemType Junction -Path "$env:USERPROFILE\.claude\commands" -Target "$env:USERPROFILE\Dropbox\Claude-commands"
```

::: tip ポイント
ジャンクションは管理者権限なしで作れます。`mklink /J` コマンドもありますが、PowerShellの `New-Item` の方が確実です。
:::

### ステップ3：メモリのジャンクションを作る

メモリのリンク先は少し複雑です。プロジェクトフォルダのパスから算出されます。

**算出ルール：** パスの区切り文字を `--` に変換し、ドライブレターから `:` を除去

| プロジェクトフォルダ | ディレクトリ名 |
|---------------------|---------------|
| `C:\Users\fumit\Desktop\claude` | `C--Users-fumit-Desktop-claude` |
| `D:\fumitaka\Dropbox\dev\Claude` | `D--fumitaka-Dropbox-dev-Claude` |

```powershell
# 例：ノートPCの場合
New-Item -ItemType Junction `
  -Path "$env:USERPROFILE\.claude\projects\C--Users-fumit-Desktop-claude\memory" `
  -Target "$env:USERPROFILE\Dropbox\claude-memory"
```

### ステップ4：自動更新を設定する（任意）

Claude Codeのバージョンを自動で最新に保つバッチファイルを作ります。

```bat
npm update -g @anthropic-ai/claude-code
```

これをDropboxに `claude-update.bat` として保存し、Windowsのタスクスケジューラで毎日実行するように設定します。

## 自動セットアップ：/pc-setup コマンド

上記の手順を毎回手動でやるのは面倒です。そこで、すべてを1コマンドで実行するスキルを作りました。

```
/pc-setup
```

これを実行すると以下が自動で行われます：

1. Dropboxパスの自動検出
2. skills → Dropbox/Claude-skills のジャンクション作成
3. memory → Dropbox/claude-memory のジャンクション作成
4. commands → Dropbox/Claude-commands のジャンクション作成
5. 自動更新タスクスケジューラの登録
6. CLAUDE.md の作成（未存在時）
7. launch.json の作成（未存在時）

新しいPCでは、Claude Codeを起動して `/pc-setup` を実行するだけで環境が整います。

## スキル内のパスの書き方

2台のPCでDropboxの場所が違う場合があります：

| PC | Dropboxパス |
|----|-----------|
| ノートPC | `C:\Users\fumit\Dropbox` |
| デスクトップPC | `D:\fumitaka\Dropbox` |

スキルの中にパスを直接書くと、もう一方のPCでは動きません。

**解決策：** スキル内では `<Dropbox>` と記述し、実行時に自動検出させます。

```
検出順序: %USERPROFILE%\Dropbox → D:\fumitaka\Dropbox
```

## 重要：ソースコードはDropboxに置かない

::: danger 実体験からの教訓
Dropboxの中にgitリポジトリ（ソースコード）を置くと、以下の深刻な問題が起きます：

1. **スマートシンクでファイルが読めなくなる** — 「オンラインのみ」になったファイルをgitが読めず、リポジトリが壊れる
2. **ファイルロックの競合** — Dropboxの同期プロセスがgitのファイルを掴み、コミットやプッシュがハングする
3. **node_modulesの大量同期** — 数万ファイルの同期が発生し、Dropboxもgitも不安定になる

実際にリポジトリが完全に壊れ、再構築が必要になりました。
:::

### 正しい構成

```
C:/dev/                    ← ソースコードはローカルに置く
├── lifelog/
├── sns-manager/
└── playbook/

Dropbox/                   ← Dropboxはドキュメント用
├── Claude-skills/         ← Claude Codeの設定共有はOK
├── 写真・PDF・Excel/     ← git管理しないファイル
```

### 2台のPCでコードを共有する方法

GitHubが同期の役割を果たします。Dropboxは不要です。

```
デスクトップ（C:/dev/myapp/）
    ↓ git push
  GitHub（クラウド上のマスターコピー）
    ↓ git pull
ノートPC（C:/dev/myapp/）
```

- `git pull` — GitHubから最新を取得（自分で実行した時だけ）
- `git push` — GitHubに反映（自分で実行した時だけ）
- Dropboxのような自動同期は一切なし → だからファイルが壊れない

**GitHubが常に最新のマスターコピーを持っている**ので、どちらのPCが壊れても `git clone` で復元できます。

## よくあるトラブル

| 症状 | 原因 | 対処法 |
|------|------|--------|
| ジャンクションが作れない | 既存フォルダが残っている | 先にリネームか削除してから作成 |
| Dropboxファイルが Permission denied | 同期直後のファイルロック | 少し待ってから再試行 |
| スキルのパスが通らない | Dropboxパスの検出ミス | `ls "$USERPROFILE/Dropbox"` で確認 |
| バッチファイルで文字化け | cmd.exeのデフォルトがShift-JIS | `chcp 65001` でUTF-8に切り替え |

## まとめ

| やること | 方法 |
|---------|------|
| スキル・メモリ・コマンドを共有 | Dropbox + ジャンクション |
| 新PCのセットアップ | `/pc-setup` を実行 |
| パスの違いを吸収 | `<Dropbox>` 変数で自動検出 |
| Claude Codeを最新に保つ | 自動更新バッチ + タスクスケジューラ |

一度仕組みを作れば、新しいPCでも **1コマンドで同じ環境が手に入る** ようになります。

[第8章：MCPで外部サービスに繋げる →](./08-mcp)
