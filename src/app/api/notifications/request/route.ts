import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/notifications/request - Public: Create notification request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { allergen_filter, area, line_user_id } = body;

    if (!supabase) {
      return NextResponse.json({ success: true }); // Mock success
    }

    const { error } = await supabase.from('notification_requests').insert({
      line_user_id: line_user_id || null,
      allergen_filter: allergen_filter || {},
      area: area || null,
    });

    if (error) {
      console.error('[Notification Request] Error:', error);
      return NextResponse.json({ error: 'リクエストの送信に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Notification Request] Error:', err);
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 });
  }
}
