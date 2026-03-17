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
    logo_url: null,
    is_verified: true,
    created_at: '2025-12-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
  },
  {
    id: '00000001-0000-0000-0000-000000000002',
    email: 'sweets@example.com',
    store_name: 'こめこベーカリー',
    description: 'グルテンフリーの米粉パンとスイーツの専門店。',
    address: '東京都世田谷区三軒茶屋2-5-10',
    latitude: 35.6437,
    longitude: 139.6700,
    phone: '03-9876-5432',
    website_url: 'https://example.com/komeko',
    logo_url: null,
    is_verified: true,
    created_at: '2025-11-15T00:00:00Z',
    updated_at: '2026-02-20T00:00:00Z',
  },
  {
    id: '00000001-0000-0000-0000-000000000003',
    email: 'vegan@example.com',
    store_name: 'ヴィーガンスイーツ HANA',
    description: '植物性素材だけで作る、からだにやさしいスイーツ。',
    address: '東京都目黒区自由が丘1-8-3',
    latitude: 35.6078,
    longitude: 139.6685,
    phone: '03-5555-1234',
    website_url: 'https://example.com/hana',
    logo_url: null,
    is_verified: true,
    created_at: '2025-10-01T00:00:00Z',
    updated_at: '2026-01-15T00:00:00Z',
  },
];

const DEMO_PRODUCTS: Product[] = [
  {
    id: '00000002-0000-0000-0000-000000000001',
    store_id: '00000001-0000-0000-0000-000000000001',
    product_name: '米粉のふわふわショートケーキ',
    product_url: 'https://example.com/soleil/products/shortcake',
    image_url: null,
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
    image_url: null,
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
    image_url: null,
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
    image_url: null,
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
    image_url: null,
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
    image_url: null,
    ai_summary: 'オーツミルクと豆腐クリームで再現した本格ティラミス',
    is_published: true,
    allergen_consent: true,
    last_confirmed_at: '2025-08-01T00:00:00Z',
    created_at: '2025-07-15T00:00:00Z',
    updated_at: '2025-08-01T00:00:00Z',
  },
];

const DEMO_ALLERGENS: ProductAllergen[] = [
  { id: 'pa-001', product_id: '00000002-0000-0000-0000-000000000001', allergen_code: 'egg', is_free: true },
  { id: 'pa-002', product_id: '00000002-0000-0000-0000-000000000001', allergen_code: 'milk', is_free: true },
  { id: 'pa-003', product_id: '00000002-0000-0000-0000-000000000001', allergen_code: 'wheat', is_free: true },
  { id: 'pa-004', product_id: '00000002-0000-0000-0000-000000000001', allergen_code: 'soybean', is_free: false },
  { id: 'pa-005', product_id: '00000002-0000-0000-0000-000000000002', allergen_code: 'egg', is_free: true },
  { id: 'pa-006', product_id: '00000002-0000-0000-0000-000000000002', allergen_code: 'milk', is_free: true },
  { id: 'pa-007', product_id: '00000002-0000-0000-0000-000000000002', allergen_code: 'wheat', is_free: true },
  { id: 'pa-008', product_id: '00000002-0000-0000-0000-000000000002', allergen_code: 'soybean', is_free: true },
  { id: 'pa-009', product_id: '00000002-0000-0000-0000-000000000003', allergen_code: 'egg', is_free: false },
  { id: 'pa-010', product_id: '00000002-0000-0000-0000-000000000003', allergen_code: 'milk', is_free: true },
  { id: 'pa-011', product_id: '00000002-0000-0000-0000-000000000003', allergen_code: 'wheat', is_free: true },
  { id: 'pa-012', product_id: '00000002-0000-0000-0000-000000000003', allergen_code: 'banana', is_free: false },
  { id: 'pa-013', product_id: '00000002-0000-0000-0000-000000000004', allergen_code: 'egg', is_free: true },
  { id: 'pa-014', product_id: '00000002-0000-0000-0000-000000000004', allergen_code: 'milk', is_free: true },
  { id: 'pa-015', product_id: '00000002-0000-0000-0000-000000000004', allergen_code: 'wheat', is_free: true },
  { id: 'pa-016', product_id: '00000002-0000-0000-0000-000000000004', allergen_code: 'soybean', is_free: false },
  { id: 'pa-017', product_id: '00000002-0000-0000-0000-000000000005', allergen_code: 'egg', is_free: true },
  { id: 'pa-018', product_id: '00000002-0000-0000-0000-000000000005', allergen_code: 'milk', is_free: true },
  { id: 'pa-019', product_id: '00000002-0000-0000-0000-000000000005', allergen_code: 'wheat', is_free: true },
  { id: 'pa-020', product_id: '00000002-0000-0000-0000-000000000005', allergen_code: 'cashew', is_free: false },
  { id: 'pa-021', product_id: '00000002-0000-0000-0000-000000000006', allergen_code: 'egg', is_free: true },
  { id: 'pa-022', product_id: '00000002-0000-0000-0000-000000000006', allergen_code: 'milk', is_free: true },
  { id: 'pa-023', product_id: '00000002-0000-0000-0000-000000000006', allergen_code: 'wheat', is_free: false },
  { id: 'pa-024', product_id: '00000002-0000-0000-0000-000000000006', allergen_code: 'soybean', is_free: false },
];

// ===== API FUNCTIONS =====
// Uses Supabase if available, falls back to mock data

export async function getProducts(filters?: { excludedAllergens?: string[] }): Promise<Product[]> {
  if (supabase) {
    try {
      // Fetch published products with store info
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          store:stores(*),
          allergens:product_allergens(*)
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!products) return [];

      let result = products as unknown as Product[];

      // Filter by excluded allergens
      if (filters?.excludedAllergens && filters.excludedAllergens.length > 0) {
        result = result.filter(product => {
          const allergens = (product.allergens || []) as ProductAllergen[];
          return filters.excludedAllergens!.every(code => {
            const allergen = allergens.find(a => a.allergen_code === code);
            return allergen ? allergen.is_free : true;
          });
        });
      }

      return result;
    } catch (err) {
      console.error('[Supabase] getProducts error, falling back to mock:', err);
    }
  }

  // Mock fallback
  let products = DEMO_PRODUCTS.filter(p => p.is_published);
  if (filters?.excludedAllergens && filters.excludedAllergens.length > 0) {
    products = products.filter(product => {
      const productAllergens = DEMO_ALLERGENS.filter(a => a.product_id === product.id);
      return filters.excludedAllergens!.every(code => {
        const allergen = productAllergens.find(a => a.allergen_code === code);
        return allergen ? allergen.is_free : true;
      });
    });
  }
  return products.map(p => ({
    ...p,
    store: DEMO_STORES.find(s => s.id === p.store_id),
    allergens: DEMO_ALLERGENS.filter(a => a.product_id === p.id),
  }));
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
      return data as unknown as Product;
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
      return (data || []) as unknown as Product[];
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
      return data as Store;
    } catch (err) {
      console.error('[Supabase] getStoreById error, falling back to mock:', err);
    }
  }

  return DEMO_STORES.find(s => s.id === id) || null;
}

export async function getAllStores(): Promise<Store[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_verified', true)
        .order('store_name');

      if (error) throw error;
      return (data || []) as Store[];
    } catch (err) {
      console.error('[Supabase] getAllStores error, falling back to mock:', err);
    }
  }

  return DEMO_STORES;
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
