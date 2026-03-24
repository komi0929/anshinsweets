import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken, extractToken } from '@/lib/auth';

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/products/[id] - Public: Get product detail
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!supabase) {
      return NextResponse.json({ error: 'データベース未接続' }, { status: 503 });
    }

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        store:stores(id, store_name, address, phone, website_url),
        allergens:product_allergens(*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: '商品が見つかりません' }, { status: 404 });
    }

    return NextResponse.json({ product: data });
  } catch (err) {
    console.error('[Product GET] Error:', err);
    return NextResponse.json({ error: 'データの取得に失敗しました' }, { status: 500 });
  }
}

// PUT /api/products/[id] - Auth: Update product
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const auth = await verifyToken(extractToken(request.headers.get('authorization')) || '');
    if (!auth) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!supabase) {
      return NextResponse.json({ error: 'データベース未接続' }, { status: 503 });
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('products')
      .select('store_id')
      .eq('id', id)
      .single();

    if (!existing || existing.store_id !== auth.storeId) {
      return NextResponse.json({ error: 'この商品を編集する権限がありません' }, { status: 403 });
    }

    const body = await request.json();
    const { product_name, product_url, ai_summary, image_url, category, is_published, allergens, allergen_consent } = body;

    // Update product
    const { data: product, error } = await supabase
      .from('products')
      .update({
        ...(product_name && { product_name }),
        ...(product_url && { product_url }),
        ...(ai_summary !== undefined && { ai_summary }),
        ...(image_url !== undefined && { image_url }),
        ...(category && { category }),
        ...(is_published !== undefined && { is_published }),
        ...(allergen_consent !== undefined && { allergen_consent }),
        last_confirmed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Update allergens if provided (only insert allergens that are contained)
    if (allergens && typeof allergens === 'object') {
      // Delete old allergens
      await supabase.from('product_allergens').delete().eq('product_id', id);

      // Insert new ones (only where value is true = contained)
      const allergenRecords = Object.entries(allergens)
        .filter(([, contains]) => Boolean(contains))
        .map(([code]) => ({
          product_id: id,
          allergen_code: code,
        }));

      if (allergenRecords.length > 0) {
        await supabase.from('product_allergens').insert(allergenRecords);
      }
    }

    return NextResponse.json({ product });
  } catch (err) {
    console.error('[Product PUT] Error:', err);
    return NextResponse.json({ error: '商品の更新に失敗しました' }, { status: 500 });
  }
}

// DELETE /api/products/[id] - Auth: Delete product
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const auth = await verifyToken(extractToken(request.headers.get('authorization')) || '');
    if (!auth) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    const { id } = await context.params;
    if (!supabase) {
      return NextResponse.json({ error: 'データベース未接続' }, { status: 503 });
    }

    // Verify ownership
    const { data: existing } = await supabase
      .from('products')
      .select('store_id')
      .eq('id', id)
      .single();

    if (!existing || existing.store_id !== auth.storeId) {
      return NextResponse.json({ error: 'この商品を削除する権限がありません' }, { status: 403 });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Product DELETE] Error:', err);
    return NextResponse.json({ error: '商品の削除に失敗しました' }, { status: 500 });
  }
}
