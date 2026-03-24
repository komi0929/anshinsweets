-- ================================================================
-- あんしんスイーツ: stores テーブルに prefecture カラムを追加
-- Supabase SQL Editor で実行してください
-- ================================================================

-- 1. prefecture カラムを追加
ALTER TABLE stores ADD COLUMN IF NOT EXISTS prefecture TEXT;

-- 2. 既存データの address から都道府県を自動抽出して更新
UPDATE stores
SET prefecture = (
  CASE
    WHEN address LIKE '北海道%' THEN '北海道'
    WHEN address ~ '^.{2,3}[都道府県]' THEN (regexp_match(address, '^(.{2,3}[都道府県])'))[1]
    ELSE NULL
  END
)
WHERE prefecture IS NULL AND address IS NOT NULL;

-- 3. 結果確認
SELECT id, store_name, address, prefecture FROM stores;
