-- =====================================================
-- Anshin Sweets Finder - Database Schema
-- Supabase SQL Migration
-- =====================================================
-- Run this in Supabase SQL Editor to set up the database.
-- デモデータはSEEDセクションにあり、一括削除可能です。

-- ===== EXTENSIONS =====
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== TABLES =====

-- 店舗テーブル
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  store_name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  website_url TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 商品テーブル
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_url TEXT NOT NULL,
  image_url TEXT,
  ai_summary TEXT,
  category TEXT DEFAULT 'other',
  is_published BOOLEAN DEFAULT false,
  allergen_consent BOOLEAN DEFAULT false,
  last_confirmed_at TIMESTAMPTZ DEFAULT now(),
  is_demo BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 商品アレルゲン情報テーブル
CREATE TABLE IF NOT EXISTS product_allergens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  allergen_code TEXT NOT NULL,
  is_free BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(product_id, allergen_code)
);

-- 通知リクエストテーブル
CREATE TABLE IF NOT EXISTS notification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  line_user_id TEXT,
  allergen_filter JSONB DEFAULT '{}',
  area TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ECクリック追跡テーブル
CREATE TABLE IF NOT EXISTS ec_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  referrer TEXT,
  clicked_at TIMESTAMPTZ DEFAULT now()
);

-- リンクヘルスチェックテーブル
CREATE TABLE IF NOT EXISTS link_health_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  status_code INTEGER,
  is_alive BOOLEAN DEFAULT true,
  checked_at TIMESTAMPTZ DEFAULT now()
);

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_products_store_id ON products(store_id);
CREATE INDEX IF NOT EXISTS idx_products_is_published ON products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_demo ON products(is_demo);
CREATE INDEX IF NOT EXISTS idx_product_allergens_product_id ON product_allergens(product_id);
CREATE INDEX IF NOT EXISTS idx_product_allergens_code ON product_allergens(allergen_code);
CREATE INDEX IF NOT EXISTS idx_ec_clicks_product_id ON ec_clicks(product_id);
CREATE INDEX IF NOT EXISTS idx_stores_is_demo ON stores(is_demo);

-- ===== UPDATED_AT TRIGGER =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===== ROW LEVEL SECURITY =====

-- Enable RLS on all tables
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ec_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_health_checks ENABLE ROW LEVEL SECURITY;

-- Public read access for published products and verified stores
CREATE POLICY "Anyone can view verified stores"
  ON stores FOR SELECT
  USING (is_verified = true);

CREATE POLICY "Anyone can view published products"
  ON products FOR SELECT
  USING (is_published = true);

CREATE POLICY "Anyone can view product allergens"
  ON product_allergens FOR SELECT
  USING (true);

-- Public insert for notification requests and ec_clicks
CREATE POLICY "Anyone can create notification requests"
  ON notification_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can create ec click records"
  ON ec_clicks FOR INSERT
  WITH CHECK (true);

-- ============================================
-- DEMO DATA SEED (is_demo = true for easy cleanup)
-- To remove all demo data, run:
--   DELETE FROM stores WHERE is_demo = true;
-- (CASCADE will clean products and allergens)
-- ============================================

INSERT INTO stores (id, email, store_name, description, address, latitude, longitude, phone, website_url, is_verified, is_demo) VALUES
  ('00000001-0000-0000-0000-000000000001', 'patisserie@example.com', 'パティスリー・ソレイユ', 'アレルギー対応に特化した洋菓子店。すべてのお子さまに笑顔を届けたい。', '東京都渋谷区神宮前3-1-1', 35.6695, 139.7089, '03-1234-5678', 'https://example.com/soleil', true, true),
  ('00000001-0000-0000-0000-000000000002', 'sweets@example.com', 'こめこベーカリー', 'グルテンフリーの米粉パンとスイーツの専門店。', '東京都世田谷区三軒茶屋2-5-10', 35.6437, 139.6700, '03-9876-5432', 'https://example.com/komeko', true, true),
  ('00000001-0000-0000-0000-000000000003', 'vegan@example.com', 'ヴィーガンスイーツ HANA', '植物性素材だけで作る、からだにやさしいスイーツ。', '東京都目黒区自由が丘1-8-3', 35.6078, 139.6685, '03-5555-1234', 'https://example.com/hana', true, true);

INSERT INTO products (id, store_id, product_name, product_url, ai_summary, category, is_published, allergen_consent, last_confirmed_at, is_demo) VALUES
  ('00000002-0000-0000-0000-000000000001', '00000001-0000-0000-0000-000000000001', '米粉のふわふわショートケーキ', 'https://example.com/soleil/products/shortcake', '米粉と豆乳クリームで作る、ふわっと軽い口どけのケーキ', 'cake', true, true, '2026-03-10T00:00:00Z', true),
  ('00000002-0000-0000-0000-000000000002', '00000001-0000-0000-0000-000000000001', 'アレルギー対応チョコレートトリュフ', 'https://example.com/soleil/products/truffle', 'カカオ70%の濃厚トリュフ。乳・卵・小麦不使用の贅沢な一粒', 'chocolate', true, true, '2026-03-15T00:00:00Z', true),
  ('00000002-0000-0000-0000-000000000003', '00000001-0000-0000-0000-000000000002', '米粉のもちもちバナナマフィン', 'https://example.com/komeko/products/muffin', '完熟バナナの自然な甘さが引き立つ、グルテンフリーマフィン', 'other', true, true, '2026-02-28T00:00:00Z', true),
  ('00000002-0000-0000-0000-000000000004', '00000001-0000-0000-0000-000000000002', '豆乳クリームのロールケーキ', 'https://example.com/komeko/products/roll', 'ふんわり米粉生地と濃厚豆乳クリームのハーモニー', 'cake', true, true, '2026-03-01T00:00:00Z', true),
  ('00000002-0000-0000-0000-000000000005', '00000001-0000-0000-0000-000000000003', 'ヴィーガンいちごタルト', 'https://example.com/hana/products/tart', '旬のいちごとカシューナッツクリームの贅沢ヴィーガンタルト', 'cake', true, true, '2026-03-12T00:00:00Z', true),
  ('00000002-0000-0000-0000-000000000006', '00000001-0000-0000-0000-000000000003', 'オーツミルクのティラミス', 'https://example.com/hana/products/tiramisu', 'オーツミルクと豆腐クリームで再現した本格ティラミス', 'other', true, true, '2025-08-01T00:00:00Z', true);

INSERT INTO product_allergens (product_id, allergen_code, is_free) VALUES
  -- 米粉ショートケーキ: 卵・乳・小麦不使用
  ('00000002-0000-0000-0000-000000000001', 'egg', true),
  ('00000002-0000-0000-0000-000000000001', 'milk', true),
  ('00000002-0000-0000-0000-000000000001', 'wheat', true),
  ('00000002-0000-0000-0000-000000000001', 'soybean', false),
  -- チョコトリュフ: 乳・卵・小麦・大豆不使用
  ('00000002-0000-0000-0000-000000000002', 'egg', true),
  ('00000002-0000-0000-0000-000000000002', 'milk', true),
  ('00000002-0000-0000-0000-000000000002', 'wheat', true),
  ('00000002-0000-0000-0000-000000000002', 'soybean', true),
  -- バナナマフィン: 小麦・乳不使用、卵使用
  ('00000002-0000-0000-0000-000000000003', 'egg', false),
  ('00000002-0000-0000-0000-000000000003', 'milk', true),
  ('00000002-0000-0000-0000-000000000003', 'wheat', true),
  ('00000002-0000-0000-0000-000000000003', 'banana', false),
  -- ロールケーキ: 卵・乳・小麦不使用
  ('00000002-0000-0000-0000-000000000004', 'egg', true),
  ('00000002-0000-0000-0000-000000000004', 'milk', true),
  ('00000002-0000-0000-0000-000000000004', 'wheat', true),
  ('00000002-0000-0000-0000-000000000004', 'soybean', false),
  -- いちごタルト: 乳・卵・小麦不使用、カシューナッツ使用
  ('00000002-0000-0000-0000-000000000005', 'egg', true),
  ('00000002-0000-0000-0000-000000000005', 'milk', true),
  ('00000002-0000-0000-0000-000000000005', 'wheat', true),
  ('00000002-0000-0000-0000-000000000005', 'cashew', false),
  -- ティラミス: 卵・乳不使用、小麦使用
  ('00000002-0000-0000-0000-000000000006', 'egg', true),
  ('00000002-0000-0000-0000-000000000006', 'milk', true),
  ('00000002-0000-0000-0000-000000000006', 'wheat', false),
  ('00000002-0000-0000-0000-000000000006', 'soybean', false);

-- =====================================================
-- DEMO DATA CLEANUP FUNCTION
-- Call: SELECT cleanup_demo_data();
-- =====================================================
CREATE OR REPLACE FUNCTION cleanup_demo_data()
RETURNS TEXT AS $$
DECLARE
  deleted_stores INTEGER;
  deleted_products INTEGER;
BEGIN
  -- Count before delete
  SELECT COUNT(*) INTO deleted_stores FROM stores WHERE is_demo = true;
  SELECT COUNT(*) INTO deleted_products FROM products WHERE is_demo = true;
  
  -- CASCADE delete: stores -> products -> product_allergens
  DELETE FROM stores WHERE is_demo = true;
  
  RETURN format('Cleaned up %s demo stores and %s demo products', deleted_stores, deleted_products);
END;
$$ LANGUAGE plpgsql;
