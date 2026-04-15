# プロジェクト設定

## このプロジェクトについて

**イベントアイデア帳** — 地域コミュニティのイベント企画書をAI生成・管理するシステム。

### ワークフロー
1. Claude Codeにイベント条件を伝えてMarkdownファイルを生成してもらう
2. `ideas/` に保存 → `git push` → Vercelが自動デプロイ
3. スマホのブラウザでURLを開いて企画書を閲覧・共有

### イベントアイデア生成の依頼フォーマット

以下のようにClaude Codeに伝えると企画書を生成してくれます：

```
「[季節]、[人数]人、[世代（例：子供〜高齢者の混合）]、[屋内/屋外]、
予算[金額]円/人でイベント案を作って」
```

例：
```
「夏、15人、大人のみ、屋内、予算1000円/人でイベント案を3つ作って」
「春、40人、子供〜高齢者混合、屋外、予算500円/人の日帰りイベントを考えて」
```

### 生成されたファイルの保存・デプロイ

```bash
git add ideas/
git commit -m "イベント案追加: [タイトル]"
git push
# → Vercelが自動デプロイ（通常1〜2分）
```

---

## スタック

- **フレームワーク**: Next.js 16 (App Router, SSG)
- **スタイリング**: Tailwind CSS v4 + @tailwindcss/typography
- **Markdownパース**: gray-matter + remark + remark-html
- **デプロイ**: Vercel (GitHub連携で自動デプロイ)
- **バージョン管理**: GitHub

### ファイル構造

```
ideas/              ← イベント企画書（Markdownファイル）を追加する場所
src/app/
  page.tsx          ← 一覧ページ（季節フィルタ付き）
  ideas/[slug]/
    page.tsx        ← 詳細ページ
src/lib/ideas.ts    ← Markdown読み込みヘルパー
src/components/
  SeasonFilter.tsx  ← 季節フィルタボタン（Client Component）
```

### Markdownファイルのフォーマット

```markdown
---
title: "イベントタイトル"
date: "YYYY-MM-DD"
season: "春" # 春/夏/秋/冬/通年
participants: 20 # 人数（数値）
ageGroups: ["子供", "大人", "高齢者"] # 対象世代
setting: "屋外" # 屋外/屋内/どちらでも
budgetPerPerson: 500 # 予算/人（円・数値）
duration: "3時間"
tags: ["タグ1", "タグ2"]
---

## 概要
...

## タイムライン
...

## 準備・持ち物リスト
...

## ミニゲーム・盛り上げアイデア
...

## 運営のポイント
...
```

ファイル名は `YYYY-MM-DD-タイトル.md` の形式（例：`2026-04-15-春の公園スポーツ大会.md`）

---

## 旧スタック設定（未使用）

- **データベース**: Supabase (未導入)
- **認証**: NextAuth.js v5 + Google OAuth（未導入）
- **ストレージ**: Cloudflare R2（未導入）
- **決済**: Stripe（未導入）

## 利用可能な MCP ツール

| サービス | MCP | 用途 |
|---------|-----|------|
| Supabase | `mcp__supabase__*` | DB操作・マイグレーション・Edge Functions |
| Cloudflare | `mcp__cloudflare__*` | R2ストレージ・Workers |
| Stripe | `mcp__stripe__*` | 商品・価格・サブスクリプション管理 |
| GitHub | `mcp__github__*` | リポジトリ・PR・Issue管理 |
| Vercel | `mcp__vercel__*` | デプロイ・環境変数管理 |
| Gemini | `mcp__gemini__*` | AI機能 |

## 自動セットアップ手順

このプロジェクトが空の場合、以下の手順で初期化を行います：

1. `npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"` を実行
2. 必要なパッケージをインストール:
   - `@supabase/supabase-js @supabase/ssr`
   - `next-auth@beta @auth/supabase-adapter`
   - `@aws-sdk/client-s3` (R2アクセス用)
   - `stripe @stripe/stripe-js`
3. Supabase プロジェクトをMCPで作成・設定
4. GitHub リポジトリをMCPで作成・接続
5. Vercel プロジェクトをMCPで作成・設定
6. 環境変数ファイル (`.env.local`) を生成
7. Stripe 商品・価格をMCPで設定

## 環境変数テンプレート

```.env.local
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NextAuth / Google OAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Gemini API
GEMINI_API_KEY=

# Vercel
VERCEL_TOKEN=
```

## コーディング規約

- TypeScript strict モード
- Tailwind CSS でスタイリング
- Server Components を優先、Client Components は最小限
- Supabase の RLS (Row Level Security) を必ず有効化
- API キーは環境変数で管理、コードに埋め込み禁止
- エラーハンドリングは Result 型パターンを推奨

## MCPを使った開発フロー

```
ユーザー要求
  → GitHub MCP でブランチ作成
  → コード実装
  → Supabase MCP でマイグレーション適用
  → GitHub MCP でPR作成
  → Vercel MCP でプレビューデプロイ確認
  → マージ → 本番デプロイ
```
