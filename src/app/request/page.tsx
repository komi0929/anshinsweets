'use client';

import Link from 'next/link';
import { useState } from 'react';
import { APP_NAME } from '@/lib/constants';

export default function RequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [area, setArea] = useState('');

  const handleSubmit = () => {
    // In production, this would post to the notification_requests table
    setSubmitted(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <span className="navbar-logo-emoji">🍰</span>
            <span>{APP_NAME}</span>
          </Link>
          <div className="navbar-links">
            <Link href="/" className="navbar-link">ホーム</Link>
          </div>
        </div>
      </nav>

      <main className="container container-narrow" style={{ padding: 'var(--space-3xl) var(--space-md)', textAlign: 'center' }}>
        {!submitted ? (
          <div className="animate-fadeInUp">
            <div style={{ fontSize: '5rem', marginBottom: 'var(--space-lg)' }}>🍰💬</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)', color: 'var(--color-primary-dark)' }}>
              ご希望のスイーツが<br />見つかりませんでしたか？
            </h1>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.8,
              marginBottom: 'var(--space-xl)',
              maxWidth: 500,
              margin: '0 auto var(--space-xl)',
            }}>
              ご安心ください。あなたの条件に合ったお店が登録され次第、
              LINEでお知らせいたします。お知らせを受け取りませんか？
            </p>

            <div style={{ maxWidth: 400, margin: '0 auto', marginBottom: 'var(--space-xl)' }}>
              <div className="input-group" style={{ marginBottom: 'var(--space-md)', textAlign: 'left' }}>
                <label className="input-label" htmlFor="request-area">お住まいのエリア（任意）</label>
                <input
                  id="request-area"
                  className="input-field"
                  type="text"
                  placeholder="例：東京都渋谷区"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn btn-cta btn-lg"
              onClick={handleSubmit}
              id="submit-request"
            >
              📩 通知を受け取る
            </button>

            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-md)' }}>
              ※ LINE LIFF連携時、お使いのLINEアカウントに通知が届きます
            </p>
          </div>
        ) : (
          <div className="animate-fadeInUp">
            <div style={{ fontSize: '5rem', marginBottom: 'var(--space-lg)' }}>✅</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)', color: 'var(--color-safe)' }}>
              リクエストを受け付けました！
            </h1>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.8,
              marginBottom: 'var(--space-xl)',
              maxWidth: 500,
              margin: '0 auto var(--space-xl)',
            }}>
              あなたの条件に合ったスイーツが登録され次第、<br />
              LINEでお知らせいたします。楽しみにお待ちください 🍰
            </p>
            <Link href="/" className="btn btn-primary" id="back-to-home">
              ホームに戻る
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
