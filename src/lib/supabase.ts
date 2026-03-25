/**
 * Supabase Client - Real Database Connection
 * 
 * Uses actual Supabase when NEXT_PUBLIC_SUPABASE_URL is configured.
 * Falls back to mock data for local development without DB.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Product, Store, ProductAllergen } from './types';

// ===== SUPABASE CLIENT =====
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ===== DEMO DATA (fallback when Supabase is not configured) =====
const DEMO_STORES: Store[] = [
  {
    id: '00000001-0000-0000-0000-000000000001',
    email: 'patisserie@example.com',
    store_name: 'パティスリー・ソレイユ',
    description: 'アレルギー対応に特化した洋菓子店。すべてのお子さまに笑顔を届けたい。',
    address: '東京都渋谷区神宮前3-1-1',
    latitude: 35.6695,
    longitude: 139.7089,
    phone: '03-1234-5678',
    website_url: 'https://example.com/soleil',
    logo_url: 'https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=200&h=200&fit=crop&crop=center',
    cover_image_url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&h=400&fit=crop&crop=center',
    is_verified: true,
    created_at: '2025-12-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
    features: ['kids_friendly', 'stroller_ok', 'eat_in', 'takeout', 'allergy_consultation'],
    business_hours: '10:00〜19:00（火曜定休）',
    price_range: '￥400〜￥2,800',
    prefecture: '東京都',
  },
  {
    id: '00000001-0000-0000-0000-000000000002',
    email: 'sweets@example.com',
    store_name: 'こめこベーカリー',
    description: 'グルテンフリーの米粉パンとスイーツの専門店。',
    address: '神奈川県横浜市中区元町4-12-6',
    latitude: 35.4378,
    longitude: 139.6508,
    phone: '045-123-4567',
    website_url: 'https://example.com/komeko',
    logo_url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop&crop=center',
    cover_image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=800&h=400&fit=crop&crop=center',
    is_verified: true,
    created_at: '2025-11-15T00:00:00Z',
    updated_at: '2026-02-20T00:00:00Z',
    features: ['takeout', 'delivery', 'gluten_free_dedicated'],
    business_hours: '9:00〜18:00（水曜定休）',
    price_range: '￥300〜￥1,500',
    prefecture: '神奈川県',
  },
  {
    id: '00000001-0000-0000-0000-000000000003',
    email: 'vegan@example.com',
    store_name: 'ヴィーガンスイーツ HANA',
    description: '植物性素材だけで作る、からだにやさしいスイーツ。嵐山の自然に囲まれた隠れ家的な空間。',
    address: '京都府京都市右京区嵯峨天龍寺芒ノ馬場町1-5',
    latitude: 35.0142,
    longitude: 135.6806,
    phone: '075-555-1234',
    website_url: 'https://example.com/hana',
    logo_url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop&crop=center',
    cover_image_url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=400&fit=crop&crop=center',
    is_verified: true,
    created_at: '2025-10-01T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
    features: ['kids_friendly', 'eat_in', 'takeout', 'vegan_dedicated', 'parking'],
    business_hours: '11:00〜20:00（月曜定休）',
    price_range: '￥500〜￥3,200',
    prefecture: '京都府',
  },
];

const DEMO_PRODUCTS: Product[] = [
  {
    id: '00000002-0000-0000-0000-000000000001',
    store_id: '00000001-0000-0000-0000-000000000001',
    product_name: '米粉のふわふわショートケーキ',
    product_url: 'https://example.com/soleil/products/shortcake',
    image_url: '/demo/shortcake.png',
    ai_summary: '米粉と豆乳クリームで作る、ふわっと軽い口どけのケーキ',
    is_published: true,
    allergen_consent: true,
    last_confirmed_at: '2026-03-10T00:00:00Z',
    created_at: '2026-01-05T00:00:00Z',
    updated_at: '2026-03-10T00:00:00Z',
  },
  {
    id: '00000002-0000-0000-0000-000000000002',
    store_id: '00000001-0000-0000-0000-000000000001',
    product_name: 'アレルギー対応チョコレートトリュフ',
    product_url: 'https://example.com/soleil/products/truffle',
    image_url: '/demo/truffle.png',
    ai_summary: 'カカオ70%の濃厚トリュフ。乳・卵・小麦不使用の贅沢な一粒',
    is_published: true,
    allergen_consent: true,
    last_confirmed_at: '2026-03-15T00:00:00Z',
    created_at: '2026-02-01T00:00:00Z',
    updated_at: '2026-03-15T00:00:00Z',
  },
  {
    id: '00000002-0000-0000-0000-000000000003',
    store_id: '00000001-0000-0000-0000-000000000002',
    product_name: '米粉のもちもちバナナマフィン',
    product_url: 'https://example.com/komeko/products/muffin',
    image_url: '/demo/muffin.png',
    ai_summary: '完熟バナナの自然な甘さが引き立つ、グルテンフリーマフィン',
    is_published: true,
    allergen_consent: true,
    last_confirmed_at: '2026-02-28T00:00:00Z',
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-02-28T00:00:00Z',
  },
  {
    id: '00000002-0000-0000-0000-000000000004',
    store_id: '00000001-0000-0000-0000-000000000002',
    product_name: '豆乳クリームのロールケーキ',
    product_url: 'https://example.com/komeko/products/roll',
    image_url: '/demo/rollcake.png',
    ai_summary: 'ふんわり米粉生地と濃厚豆乳クリームのハーモニー',
    is_published: true,
    allergen_consent: true,
    last_confirmed_at: '2026-03-01T00:00:00Z',
    created_at: '2026-02-10T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
  },
  {
    id: '00000002-0000-0000-0000-000000000005',
    store_id: '00000001-0000-0000-0000-000000000003',
    product_name: 'ヴィーガンいちごタルト',
    product_url: 'https://example.com/hana/products/tart',
    image_url: '/demo/tart.png',
    ai_summary: '旬のいちごとカシューナッツクリームの贅沢ヴィーガンタルト',
    is_published: true,
    allergen_consent: true,
    last_confirmed_at: '2026-03-12T00:00:00Z',
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-12T00:00:00Z',
  },
  {
    id: '00000002-0000-0000-0000-000000000006',
    store_id: '00000001-0000-0000-0000-000000000003',
    product_name: 'オーツミルクのティラミス',
    product_url: 'https://example.com/hana/products/tiramisu',
    image_url: '/demo/tiramisu.png',
    ai_summary: 'オーツミルクと豆腐クリームで再現した本格ティラミス',
    is_published: true,
    allergen_consent: true,
    last_confirmed_at: '2025-08-01T00:00:00Z',
    created_at: '2025-07-15T00:00:00Z',
    updated_at: '2025-08-01T00:00:00Z',
  },
];

/** デモアレルゲンデータ: レコードが存在 = そのアレルゲンを含む */
const DEMO_ALLERGENS: ProductAllergen[] = [
  // 米粉のふわふわショートケーキ → 大豆を含む
  { id: 'pa-001', product_id: '00000002-0000-0000-0000-000000000001', allergen_code: 'soybean' },
  // アレルギー対応チョコレートトリュフ → アレルゲンなし（レコードなし）
  // 米粉のもちもちバナナマフィン → 卵・バナナを含む
  { id: 'pa-002', product_id: '00000002-0000-0000-0000-000000000003', allergen_code: 'egg' },
  { id: 'pa-003', product_id: '00000002-0000-0000-0000-000000000003', allergen_code: 'banana' },
  // 豆乳クリームのロールケーキ → 大豆を含む
  { id: 'pa-004', product_id: '00000002-0000-0000-0000-000000000004', allergen_code: 'soybean' },
  // ヴィーガンいちごタルト → カシューナッツを含む
  { id: 'pa-005', product_id: '00000002-0000-0000-0000-000000000005', allergen_code: 'cashew' },
  // オーツミルクのティラミス → 小麦・大豆を含む
  { id: 'pa-006', product_id: '00000002-0000-0000-0000-000000000006', allergen_code: 'wheat' },
  { id: 'pa-007', product_id: '00000002-0000-0000-0000-000000000006', allergen_code: 'soybean' },
];

// ===== API FUNCTIONS =====
// Uses Supabase if available, falls back to mock data

/**
 * Backward compat: Old DB records have is_free column.
 * is_free=true meant "NOT contained", is_free=false meant "IS contained".
 * New model: record exists = contained. Filter accordingly during transition.
 */
function filterContainedAllergens(allergens: Record<string, unknown>[]): ProductAllergen[] {
  return allergens
    .filter(a => {
      // New records won't have is_free. Old records: is_free=false means contained.
      const isFree = (a as Record<string, unknown>).is_free;
      return isFree === undefined || isFree === null || isFree === false;
    })
    .map(a => ({
      id: (a as Record<string, unknown>).id as string,
      product_id: (a as Record<string, unknown>).product_id as string,
      allergen_code: (a as Record<string, unknown>).allergen_code as string,
    }));
}

// Demo enrichment: overlay local images/metadata on Supabase data that doesn't have them yet
function enrichProduct(p: Product): Product {
  if (!p.image_url) {
    const demoMatch = DEMO_PRODUCTS.find(d => d.id === p.id);
    if (demoMatch?.image_url) {
      return { ...p, image_url: demoMatch.image_url };
    }
  }
  return p;
}

function enrichStore(s: Store): Store {
  const demoMatch = DEMO_STORES.find(d => d.id === s.id);
  if (demoMatch) {
    return {
      ...s,
      features: s.features || demoMatch.features,
      business_hours: s.business_hours || demoMatch.business_hours,
      price_range: s.price_range || demoMatch.price_range,
      prefecture: s.prefecture || demoMatch.prefecture,
    };
  }
  // Auto-detect prefecture from address if not set
  if (!s.prefecture && s.address) {
    const match = s.address.match(/^(北海道|.{2,3}[都道府県])/);
    if (match) return { ...s, prefecture: match[1] };
  }
  return s;
}

/** Category keywords for client-side category matching (DB has no category column) */
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  cake: ['ケーキ', 'ショート', 'ロール', 'シフォン', 'タルト'],
  cookie: ['クッキー', 'サブレ', 'ビスケット', 'マカロン'],
  chocolate: ['チョコ', 'トリュフ', 'ガナッシュ', 'カカオ', 'ブラウニー'],
  pudding: ['プリン', 'ゼリー'],
  icecream: ['アイス', 'ジェラート', 'シャーベット', 'ソルベ'],
  bread: ['パン', 'マフィン', 'スコーン', 'ベーグル'],
  japanese: ['和菓子', '大福', 'どら焼き', '羊羹', '饅頭'],
  other: [],
};

export const PAGE_SIZE = 12;

export type ProductsResult = {
  products: Product[];
  totalCount: number;
  hasMore: boolean;
};

export type ProductFilters = {
  myAllergens?: string[];
  search?: string;
  category?: string;
  prefecture?: string;
  limit?: number;
  offset?: number;
};

function matchesCategory(product: Product, category: string): boolean {
  if (!category || category === '') return true;
  const keywords = CATEGORY_KEYWORDS[category];
  if (!keywords || keywords.length === 0) {
    // 'other' — match anything not matching other categories
    if (category === 'other') {
      return !Object.entries(CATEGORY_KEYWORDS).some(([key, kws]) =>
        key !== 'other' && kws.some(kw => product.product_name.includes(kw))
      );
    }
    return true;
  }
  return keywords.some(kw => product.product_name.includes(kw));
}

export async function getProducts(filters?: ProductFilters): Promise<ProductsResult> {
  const limit = filters?.limit ?? PAGE_SIZE;
  const offset = filters?.offset ?? 0;
  const search = filters?.search?.trim() || '';
  const category = filters?.category || '';
  const prefecture = filters?.prefecture || '';

  if (supabase) {
    try {
      // Build query
      let query = supabase
        .from('products')
        .select(`
          *,
          store:stores(*),
          allergens:product_allergens(*)
        `, { count: 'exact' })
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      // Text search on product_name
      if (search) {
        query = query.ilike('product_name', `%${search}%`);
      }

      const { data: products, error } = await query;

      if (error) throw error;
      if (!products) return { products: [], totalCount: 0, hasMore: false };

      let result = (products as unknown as (Product & { allergens: Record<string, unknown>[]; store?: Store })[]).map(p => {
        const enriched = enrichProduct({
          ...p,
          allergens: filterContainedAllergens(p.allergens || []),
        } as Product);
        return {
          ...enriched,
          store: p.store ? enrichStore(p.store) : undefined,
        };
      }) as Product[];

      // Filter: exclude products that contain any of the user's allergens
      if (filters?.myAllergens && filters.myAllergens.length > 0) {
        result = result.filter(product => {
          const allergens = (product.allergens || []) as ProductAllergen[];
          return !filters.myAllergens!.some(code =>
            allergens.some(a => a.allergen_code === code)
          );
        });
      }

      // Category filter (client-side since DB has no category column)
      if (category) {
        result = result.filter(p => matchesCategory(p, category));
      }

      // Prefecture filter (filter by store's prefecture)
      if (prefecture) {
        result = result.filter(p => {
          const store = p.store as Store | undefined;
          return store?.prefecture === prefecture || store?.address?.includes(prefecture);
        });
      }

      const totalCount = result.length;
      const paged = result.slice(offset, offset + limit);

      return {
        products: paged,
        totalCount,
        hasMore: offset + limit < totalCount,
      };
    } catch (err) {
      console.error('[Supabase] getProducts error, falling back to mock:', err);
    }
  }

  // Mock fallback
  let products = DEMO_PRODUCTS.filter(p => p.is_published);

  // Text search
  if (search) {
    products = products.filter(p =>
      p.product_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.ai_summary && p.ai_summary.toLowerCase().includes(search.toLowerCase()))
    );
  }

  // Allergen filter
  if (filters?.myAllergens && filters.myAllergens.length > 0) {
    products = products.filter(product => {
      const productAllergens = DEMO_ALLERGENS.filter(a => a.product_id === product.id);
      return !filters.myAllergens!.some(code =>
        productAllergens.some(a => a.allergen_code === code)
      );
    });
  }

  // Enrich with store & allergens
  let enriched = products.map(p => ({
    ...p,
    store: DEMO_STORES.find(s => s.id === p.store_id),
    allergens: DEMO_ALLERGENS.filter(a => a.product_id === p.id),
  })) as Product[];

  // Category filter
  if (category) {
    enriched = enriched.filter(p => matchesCategory(p, category));
  }

  // Prefecture filter
  if (prefecture) {
    enriched = enriched.filter(p => {
      const store = p.store as Store | undefined;
      return store?.prefecture === prefecture || store?.address?.includes(prefecture);
    });
  }

  const totalCount = enriched.length;
  const paged = enriched.slice(offset, offset + limit);

  return {
    products: paged,
    totalCount,
    hasMore: offset + limit < totalCount,
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          store:stores(*),
          allergens:product_allergens(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      const product = data as unknown as Product & { allergens: Record<string, unknown>[]; store?: Store };
      const enriched = enrichProduct({
        ...product,
        allergens: filterContainedAllergens(product.allergens || []),
      } as Product);
      return {
        ...enriched,
        store: product.store ? enrichStore(product.store) : undefined,
      } as Product;
    } catch (err) {
      console.error('[Supabase] getProductById error, falling back to mock:', err);
    }
  }

  // Mock fallback
  const product = DEMO_PRODUCTS.find(p => p.id === id);
  if (!product) return null;
  return {
    ...product,
    store: DEMO_STORES.find(s => s.id === product.store_id),
    allergens: DEMO_ALLERGENS.filter(a => a.product_id === product.id),
  };
}

export async function getStoreProducts(storeId: string): Promise<Product[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          allergens:product_allergens(*)
        `)
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map((p: Record<string, unknown>) => ({
        ...p,
        allergens: filterContainedAllergens((p.allergens || []) as Record<string, unknown>[]),
      })) as unknown as Product[];
    } catch (err) {
      console.error('[Supabase] getStoreProducts error, falling back to mock:', err);
    }
  }

  return DEMO_PRODUCTS
    .filter(p => p.store_id === storeId)
    .map(p => ({
      ...p,
      allergens: DEMO_ALLERGENS.filter(a => a.product_id === p.id),
    }));
}

export async function getStoreById(id: string): Promise<Store | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return enrichStore(data as Store);
    } catch (err) {
      console.error('[Supabase] getStoreById error, falling back to mock:', err);
    }
  }

  return DEMO_STORES.find(s => s.id === id) || null;
}

export async function getAllStores(filters?: { prefecture?: string }): Promise<Store[]> {
  const prefecture = filters?.prefecture || '';

  if (supabase) {
    try {
      let query = supabase
        .from('stores')
        .select('*')
        .eq('is_verified', true)
        .order('store_name');

      if (prefecture) {
        query = query.eq('prefecture', prefecture);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []).map((s: Store) => enrichStore(s));
    } catch (err) {
      console.error('[Supabase] getAllStores error, falling back to mock:', err);
    }
  }

  let stores = DEMO_STORES.map(s => enrichStore(s));
  if (prefecture) {
    stores = stores.filter(s => s.prefecture === prefecture || s.address?.includes(prefecture));
  }
  return stores;
}

// ===== STORE WITH PRODUCTS =====
export async function getStoreWithProducts(storeId: string): Promise<{ store: Store; products: Product[] } | null> {
  const store = await getStoreById(storeId);
  if (!store) return null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`*, allergens:product_allergens(*)`)
        .eq('store_id', storeId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const products = (data || []).map((p: Record<string, unknown>) => enrichProduct({
        ...p,
        store: enrichStore(store),
        allergens: filterContainedAllergens((p.allergens || []) as Record<string, unknown>[]),
      } as unknown as Product)) as unknown as Product[];
      return { store, products };
    } catch (err) {
      console.error('[Supabase] getStoreWithProducts error, falling back to mock:', err);
    }
  }

  // Mock fallback
  const products = DEMO_PRODUCTS
    .filter(p => p.store_id === storeId && p.is_published)
    .map(p => ({
      ...p,
      store,
      allergens: DEMO_ALLERGENS.filter(a => a.product_id === p.id),
    }));
  return { store, products };
}

// ===== EC CLICK TRACKING =====
export async function trackECClick(productId: string, referrer?: string): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('ec_clicks').insert({
      product_id: productId,
      referrer: referrer || null,
    });
  } catch (err) {
    console.error('[Supabase] trackECClick error:', err);
  }
}

// ===== NOTIFICATION REQUESTS =====
export async function createNotificationRequest(
  allergenFilter: Record<string, boolean>,
  area?: string
): Promise<boolean> {
  if (!supabase) return true; // mock success
  try {
    const { error } = await supabase.from('notification_requests').insert({
      allergen_filter: allergenFilter,
      area: area || null,
    });
    return !error;
  } catch {
    return false;
  }
}
