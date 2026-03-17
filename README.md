# anshinsweets - あんしんスイーツ

アレルギー対応スイーツ特化ポータルアプリ

## 概要

食物アレルギーを持つ子どもの親御さんのために、アレルギー対応スイーツの検索・発見を支援する情報ポータルです。

### 主な機能
- 🔍 特定原材料等28品目に対応したアレルゲン除外フィルタ
- 📱 LINE LIFFプラットフォーム対応（モバイルファースト）
- 🏪 店舗ダッシュボード（商品管理・アナリティクス）
- 🛡️ アレルギー情報は店舗手動入力のみ（AI自動判定なし）
- ⚡ EC送客特化（商品販売は行わず、店舗ECへ誘導）

## 技術スタック
- **Frontend**: Next.js 16 (App Router) / TypeScript
- **Database**: Supabase (PostgreSQL + RLS)
- **Styling**: Vanilla CSS (Design System)
- **Deployment**: Vercel

## セットアップ

```bash
npm install
npm run dev
```

`.env.local` に以下を設定:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## ライセンス
Private
