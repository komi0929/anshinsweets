import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/tracking/click - Public: Track EC click
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, referrer } = body;

    if (!product_id) {
      return NextResponse.json({ error: 'product_id is required' }, { status: 400 });
    }

    if (!supabase) {
      return NextResponse.json({ success: true }); // Silent success in dev
    }

    await supabase.from('ec_clicks').insert({
      product_id,
      referrer: referrer || null,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Click Tracking] Error:', err);
    return NextResponse.json({ success: true }); // Never fail user experience
  }
}
