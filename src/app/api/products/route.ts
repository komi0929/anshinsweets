import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken, extractToken } from '@/lib/auth';

// GET /api/products - Public: Get all published products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const myAllergens = searchParams.get('exclude')?.split(',').filter(Boolean) || [];
    const category = searchParams.get('category') || '';

    if (!supabase) {
      return NextResponse.json({ error: 'データベース未接続' }, { status: 503 });
    }

    let query = supabase
      .from('products')
      .select(`
        *,
        store:stores(id, store_name, address),
        allergens:product_allergens(*)
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: products, error } = await query;
    if (error) throw error;

    // Filter: exclude products that contain any of the user's allergens
    let result = products || [];
    if (myAllergens.length > 0) {
      result = result.filter((product: Record<string, unknown>) => {
        const allergens = (product.allergens || []) as Array<{ allergen_code: string }>;
        return !myAllergens.some(code =>
          allergens.some(a => a.allergen_code === code)
        );
      });
    }

    return NextResponse.json({ products: result, total: result.length });
  } catch (err) {
    console.error('[Products GET] Error:', err);
    return NextResponse.json({ error: 'データの取得に失敗しました' }, { status: 500 });
  }
}

// POST /api/products - Auth: Create a new product
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyToken(extractToken(request.headers.get('authorization')) || '');
    if (!auth) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'データベース未接続' }, { status: 503 });
    }

    const body = await request.json();
    const { product_name, product_url, ai_summary, image_url, category, allergens, allergen_consent } = body;

    if (!product_name || !product_url) {
      return NextResponse.json({ error: '商品名とURLは必須です' }, { status: 400 });
    }

    if (!allergen_consent) {
      return NextResponse.json({ error: 'アレルギー情報の法的責任に同意が必要です' }, { status: 400 });
    }

    // Create product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        store_id: auth.storeId,
        product_name,
        product_url,
        ai_summary: ai_summary || null,
        image_url: image_url || null,
        category: category || 'other',
        is_published: true,
        allergen_consent: true,
        last_confirmed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Insert allergen records (only for allergens that are contained)
    if (allergens && typeof allergens === 'object') {
      const allergenRecords = Object.entries(allergens)
        .filter(([, contains]) => Boolean(contains))
        .map(([code]) => ({
          product_id: product.id,
          allergen_code: code,
        }));

      if (allergenRecords.length > 0) {
        const { error: allergenError } = await supabase
          .from('product_allergens')
          .insert(allergenRecords);
        if (allergenError) console.error('[Products POST] Allergen insert error:', allergenError);
      }
    }

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error('[Products POST] Error:', err);
    return NextResponse.json({ error: '商品の登録に失敗しました' }, { status: 500 });
  }
}
