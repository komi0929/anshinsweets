import { NextResponse, NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createToken } from '@/lib/auth';

/**
 * Google OAuth callback handler
 * 
 * Flow:
 * 1. Frontend calls Supabase Auth signInWithOAuth({ provider: 'google' })
 * 2. After Google consent, redirected back to this endpoint
 * 3. We extract the Supabase session, find/create the store, issue our JWT
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code || !supabase) {
      return NextResponse.redirect(new URL('/store/login?error=auth_failed', request.url));
    }

    // Exchange code for session
    const { data: sessionData, error: sessionError } = await supabase.auth.exchangeCodeForSession(code);

    if (sessionError || !sessionData?.user) {
      console.error('[Google Auth] Session error:', sessionError);
      return NextResponse.redirect(new URL('/store/login?error=auth_failed', request.url));
    }

    const googleUser = sessionData.user;
    const email = googleUser.email;
    const displayName = googleUser.user_metadata?.full_name || googleUser.user_metadata?.name || 'マイストア';

    if (!email) {
      return NextResponse.redirect(new URL('/store/login?error=no_email', request.url));
    }

    // Check if store exists
    let { data: store } = await supabase
      .from('stores')
      .select('*')
      .eq('email', email)
      .single();

    // Auto-create store if first Google login
    if (!store) {
      const { data: newStore, error: createError } = await supabase
        .from('stores')
        .insert({
          email,
          store_name: displayName,
          is_verified: true,
          google_auth_id: googleUser.id,
        })
        .select()
        .single();

      if (createError) {
        console.error('[Google Auth] Store creation error:', createError);
        return NextResponse.redirect(new URL('/store/login?error=create_failed', request.url));
      }
      store = newStore;
    } else if (!store.google_auth_id) {
      // Link Google account to existing store
      await supabase
        .from('stores')
        .update({ google_auth_id: googleUser.id })
        .eq('id', store.id);
    }

    // Create our JWT
    const token = await createToken({
      storeId: store.id,
      email: store.email,
      storeName: store.store_name,
    });

    // Redirect to dashboard with token in hash (client-side will pick it up)
    const redirectUrl = new URL('/store/dashboard', request.url);
    redirectUrl.hash = `token=${token}&store=${encodeURIComponent(JSON.stringify({
      id: store.id,
      email: store.email,
      store_name: store.store_name,
    }))}`;

    return NextResponse.redirect(redirectUrl);
  } catch (err) {
    console.error('[Google Auth] Error:', err);
    return NextResponse.redirect(new URL('/store/login?error=server_error', request.url));
  }
}
