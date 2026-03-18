import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createToken, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードは必須です' },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'データベース未接続' },
        { status: 503 }
      );
    }

    // Find store by email
    const { data: store, error } = await supabase
      .from('stores')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !store) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, store.password_hash || '');
    if (!isValid) {
      return NextResponse.json(
        { error: 'メールアドレスまたはパスワードが正しくありません' },
        { status: 401 }
      );
    }

    // Create JWT
    const token = await createToken({
      storeId: store.id,
      email: store.email,
      storeName: store.store_name,
    });

    return NextResponse.json({
      token,
      store: {
        id: store.id,
        email: store.email,
        store_name: store.store_name,
      },
    });
  } catch (err) {
    console.error('[Login] Error:', err);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
