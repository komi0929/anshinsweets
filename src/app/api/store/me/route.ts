import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken, extractToken } from '@/lib/auth';

// GET /api/store/me - Auth: Get current store info
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyToken(extractToken(request.headers.get('authorization')) || '');
    if (!auth) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'データベース未接続' }, { status: 503 });
    }

    const { data: store, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', auth.storeId)
      .single();

    if (error || !store) {
      return NextResponse.json({ error: '店舗が見つかりません' }, { status: 404 });
    }

    // Get product count and click stats
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', auth.storeId);

    const { count: publishedCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('store_id', auth.storeId)
      .eq('is_published', true);

    // Get this month's click count
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: productIds } = await supabase
      .from('products')
      .select('id')
      .eq('store_id', auth.storeId);

    let monthlyClicks = 0;
    if (productIds && productIds.length > 0) {
      const ids = productIds.map(p => p.id);
      const { count } = await supabase
        .from('ec_clicks')
        .select('*', { count: 'exact', head: true })
        .in('product_id', ids)
        .gte('clicked_at', startOfMonth.toISOString());
      monthlyClicks = count || 0;
    }

    return NextResponse.json({
      store,
      stats: {
        totalProducts: productCount || 0,
        publishedProducts: publishedCount || 0,
        monthlyClicks,
      },
    });
  } catch (err) {
    console.error('[Store ME] Error:', err);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}

// PUT /api/store/me - Auth: Update store info
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyToken(extractToken(request.headers.get('authorization')) || '');
    if (!auth) {
      return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
    }

    if (!supabase) {
      return NextResponse.json({ error: 'データベース未接続' }, { status: 503 });
    }

    const body = await request.json();
    const { store_name, description, address, latitude, longitude, phone, website_url, logo_url } = body;

    const { data: store, error } = await supabase
      .from('stores')
      .update({
        ...(store_name && { store_name }),
        ...(description !== undefined && { description }),
        ...(address !== undefined && { address }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
        ...(phone !== undefined && { phone }),
        ...(website_url !== undefined && { website_url }),
        ...(logo_url !== undefined && { logo_url }),
      })
      .eq('id', auth.storeId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ store });
  } catch (err) {
    console.error('[Store PUT] Error:', err);
    return NextResponse.json({ error: '店舗情報の更新に失敗しました' }, { status: 500 });
  }
}
