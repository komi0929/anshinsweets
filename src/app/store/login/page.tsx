'use client';

import Link from 'next/link';
import { useState } from 'react';
import { APP_NAME } from '@/lib/constants';

export default function StoreLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // In production: POST /api/auth/login
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    window.location.href = '/store/dashboard';
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

          <form onSubmit={handleSubmit} className="animate-fadeInUp stagger-2">
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

            {error && (
              <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: 'var(--space-md)', textAlign: 'center' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={!email || !password || loading}
              id="login-submit"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-lg)' }}>
            アカウントをお持ちでないですか？{' '}
            <Link href="/store/register" style={{ fontWeight: 600 }}>無料登録</Link>
          </p>

          {/* Demo hint */}
          <div style={{
            marginTop: 'var(--space-xl)',
            background: 'var(--color-info-bg)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            fontSize: '0.8rem',
            color: 'var(--color-info)',
            textAlign: 'center',
          }}>
            💡 デモ: 任意のメール/パスワードでログインできます
          </div>
        </div>
      </main>
    </>
  );
}
