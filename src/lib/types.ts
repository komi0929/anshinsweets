/**
 * Shared TypeScript types for Allergy-Free Sweets Finder
 */

/** 店舗 */
export type Store = {
  id: string;
  email: string;
  store_name: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone: string | null;
  website_url: string | null;
  logo_url: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  // Rich metadata (optional, displayed on mini-page)
  features?: string[];
  business_hours?: string;
  price_range?: string;
  prefecture?: string;
};

/** 商品 */
export type Product = {
  id: string;
  store_id: string;
  product_name: string;
  product_url: string;
  image_url: string | null;
  ai_summary: string | null;
  is_published: boolean;
  allergen_consent: boolean;
  last_confirmed_at: string;
  created_at: string;
  updated_at: string;
  store?: Store;
  allergens?: ProductAllergen[];
};

/** 商品アレルゲン情報（レコードが存在 = そのアレルゲンを含む） */
export type ProductAllergen = {
  id: string;
  product_id: string;
  allergen_code: string;
};

/** 通知リクエスト */
export type NotificationRequest = {
  id: string;
  line_user_id: string | null;
  allergen_filter: Record<string, boolean>;
  area: string | null;
  created_at: string;
};

/** ECクリック追跡 */
export type ECClick = {
  id: string;
  product_id: string;
  referrer: string | null;
  clicked_at: string;
};

/** 検索フィルタ状態 */
export type SearchFilter = {
  myAllergens: string[];
  category?: string;
  area?: string;
  sortBy?: 'newest' | 'distance';
};

/** アレルゲンプロフィール（localStorage保存） */
export type AllergenProfile = {
  childName?: string;
  myAllergens: string[];
  updatedAt: string;
};

/** AI抽出結果 */
export type AIExtractionResult = {
  productName: string;
  summary: string;
  isFood: boolean;
  error?: string;
};

/** 店舗認証トークンペイロード */
export type StoreAuthPayload = {
  storeId: string;
  email: string;
  storeName: string;
};
