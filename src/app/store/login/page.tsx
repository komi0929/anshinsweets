'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { APP_NAME } from '@/lib/constants';
import { useStoreAuth } from '@/hooks/useStoreAuth';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

function StoreLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated, isLoading: authLoading } = useStoreAuth();

  // Compute error from query params (Google OAuth failure)
  const errParam = searchParams.get('error');
  const initialError = errParam === 'auth_failed' ? 'Googleログインに失敗しました。もう一度お試しください。'
    : errParam === 'no_email' ? 'メールアドレスを取得できませんでした。'
    : errParam === 'create_failed' ? 'アカウント作成に失敗しました。'
    : errParam === 'server_error' ? 'サーバーエラーが発生しました。' : '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState(initialError);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/store/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      router.push('/store/dashboard');
    } else {
      setError(result.error || 'ログインに失敗しました');
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!SUPABASE_URL) {
      setError('Google ログインが設定されていません');
      return;
    }
    setGoogleLoading(true);

    // Redirect to Supabase Google OAuth
    const redirectTo = `${window.location.origin}/api/auth/callback`;
    const googleAuthUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
    window.location.href = googleAuthUrl;
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/store" className="navbar-logo">
            <span className="navbar-logo-emoji">🍰</span>
            <span>{APP_NAME}</span>
          </Link>
          <div className="navbar-links">
            <Link href="/store/register" className="btn btn-sm btn-primary">新規登録</Link>
          </div>
        </div>
      </nav>

      <main className="container container-narrow" style={{ padding: 'var(--space-3xl) var(--space-md)' }}>
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: 'var(--space-sm)' }} className="animate-fadeIn">
            🔐 店舗ログイン
          </h1>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }} className="animate-fadeIn stagger-1">
            店舗ダッシュボードにアクセスします。
          </p>

          {error && (
            <div style={{
              background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 'var(--radius-md)',
              padding: 'var(--space-sm) var(--space-md)', color: '#DC2626',
              fontSize: '0.85rem', marginBottom: 'var(--space-md)', textAlign: 'center',
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Google Login Button */}
          <div className="animate-fadeInUp stagger-2">
            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                padding: '12px 20px',
                borderRadius: 'var(--radius-md)',
                border: '2px solid #E5E7EB',
                background: 'white',
                cursor: 'pointer',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#374151',
                transition: 'all 0.2s',
                marginBottom: 'var(--space-lg)',
                opacity: googleLoading ? 0.7 : 1,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? 'リダイレクト中...' : 'Googleでログイン'}
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              marginBottom: 'var(--space-lg)', color: 'var(--color-text-muted)', fontSize: '0.85rem',
            }}>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
              <span>または</span>
              <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleSubmit} className="animate-fadeInUp stagger-3">
            <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="input-label" htmlFor="login-email">メールアドレス</label>
              <input
                id="login-email"
                className="input-field"
                type="email"
                required
                placeholder="store@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 'var(--space-lg)' }}>
              <label className="input-label" htmlFor="login-password">パスワード</label>
              <input
                id="login-password"
                className="input-field"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={!email || !password || loading}
              id="login-submit"
            >
              {loading ? 'ログイン中...' : '✉️ メールでログイン'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-lg)' }}>
            アカウントをお持ちでないですか？{' '}
            <Link href="/store/register" style={{ fontWeight: 600 }}>無料登録</Link>
          </p>
        </div>
      </main>
    </>
  );
}

export default function StoreLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>読み込み中...</div>}>
      <StoreLoginContent />
    </Suspense>
  );
}
