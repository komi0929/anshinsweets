'use client';

import Link from 'next/link';
import { useState } from 'react';
import { APP_NAME } from '@/lib/constants';

export default function StoreRegisterPage() {
  const [email, setEmail] = useState('');
  const [storeName, setStoreName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValid = email && storeName && password && password === passwordConfirm && agreeTerms && password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError('');
    // In production: POST /api/auth/register
    await new Promise(r => setTimeout(r, 1000));
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
            <Link href="/store/login" className="navbar-link">ログイン</Link>
          </div>
        </div>
      </nav>

      <main className="container container-narrow" style={{ padding: 'var(--space-3xl) var(--space-md)' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.5rem', textAlign: 'center', marginBottom: 'var(--space-sm)' }} className="animate-fadeIn">
            🏪 店舗アカウント登録
          </h1>
          <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }} className="animate-fadeIn stagger-1">
            完全無料。最短5分で登録完了！
          </p>

          <form onSubmit={handleSubmit} className="animate-fadeInUp stagger-2">
            <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="input-label" htmlFor="store-email">メールアドレス *</label>
              <input
                id="store-email"
                className="input-field"
                type="email"
                required
                placeholder="store@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="input-label" htmlFor="store-name">店舗名 *</label>
              <input
                id="store-name"
                className="input-field"
                type="text"
                required
                placeholder="パティスリー・ソレイユ"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
              <label className="input-label" htmlFor="store-password">パスワード *（8文字以上）</label>
              <input
                id="store-password"
                className="input-field"
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 'var(--space-lg)' }}>
              <label className="input-label" htmlFor="store-password-confirm">パスワード確認 *</label>
              <input
                id="store-password-confirm"
                className="input-field"
                type="password"
                required
                placeholder="••••••••"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                style={password && passwordConfirm && password !== passwordConfirm
                  ? { borderColor: 'var(--color-danger)' } : {}}
              />
              {password && passwordConfirm && password !== passwordConfirm && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-danger)' }}>パスワードが一致しません</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div style={{
              background: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
              marginBottom: 'var(--space-lg)',
            }}>
              <div
                className="checkbox-wrapper"
                onClick={() => setAgreeTerms(!agreeTerms)}
              >
                <div className={`checkbox ${agreeTerms ? 'checked' : ''}`}>
                  {agreeTerms && '✓'}
                </div>
                <span className="checkbox-label" style={{ fontSize: '0.85rem' }}>
                  <Link href="/store/terms" style={{ textDecoration: 'underline' }} target="_blank">店舗利用規約</Link>
                  に同意します。掲載するアレルギー情報の正確性については、店舗が法的責任を負うことを理解しています。
                </span>
              </div>
            </div>

            {error && (
              <p style={{ color: 'var(--color-danger)', fontSize: '0.85rem', marginBottom: 'var(--space-md)', textAlign: 'center' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary btn-full btn-lg"
              disabled={!isValid || loading}
              id="register-submit"
            >
              {loading ? '登録中...' : '📝 無料で登録する'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-lg)' }}>
            すでにアカウントをお持ちですか？{' '}
            <Link href="/store/login" style={{ fontWeight: 600 }}>ログイン</Link>
          </p>
        </div>
      </main>
    </>
  );
}
