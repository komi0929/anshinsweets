import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createToken, hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, store_name } = body;

    if (!email || !password || !store_name) {
      return NextResponse.json(
        { error: 'メールアドレス、パスワード、店舗名は必須です' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'パスワードは8文字以上で入力してください' },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'データベース未接続' },
        { status: 503 }
      );
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('stores')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 409 }
      );
    }

    // Hash password and create store
    const passwordHash = await hashPassword(password);

    const { data: store, error } = await supabase
      .from('stores')
      .insert({
        email,
        store_name,
        password_hash: passwordHash,
        is_verified: true, // Auto-verify for now
      })
      .select()
      .single();

    if (error) {
      console.error('[Register] Supabase error:', error);
      return NextResponse.json(
        { error: '登録に失敗しました' },
        { status: 500 }
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
    console.error('[Register] Error:', err);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
