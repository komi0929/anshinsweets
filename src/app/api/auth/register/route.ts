import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createToken, hashPassword } from '@/lib/auth';
import { isValidEmail } from '@/lib/validation';

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

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'メールアドレスの形式が正しくありません' },
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
      // Prevent email enumeration: do not reveal that address is already registered
      return NextResponse.json(
        { error: '登録処理を受け付けました。メールをご確認ください。' },
        { status: 200 }
      );
    }

    // Hash password and create store
    const passwordHash = await hashPassword(password);

    // TODO: Generate email verification token when email service is ready
    // const verificationToken = crypto.randomUUID();

    const { data: store, error } = await supabase
      .from('stores')
      .insert({
        email,
        store_name,
        password_hash: passwordHash,
        is_verified: false, // Require email verification
        // verification_token: verificationToken, // TODO: Add column to DB
      })
      .select()
      .single();

    // TODO: In production, send verification email here:
    // await sendVerificationEmail(email, verificationToken);
    // For now, auto-verify for demo purposes:
    if (store) {
      await supabase.from('stores').update({ is_verified: true }).eq('id', store.id);
    }

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
