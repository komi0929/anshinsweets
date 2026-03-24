'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { MANDATORY_ALLERGENS, ALLERGEN_EMOJI } from '@/lib/allergens';
import { STORAGE_KEYS, APP_NAME } from '@/lib/constants';

export default function RequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [area, setArea] = useState('');
  const [myAllergens, setMyAllergens] = useState<string[]>([]);
  const [childName, setChildName] = useState('');

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALLERGEN_PROFILE);
      if (data) {
        const profile = JSON.parse(data);
        setMyAllergens(profile.myAllergens || []);
        setChildName(profile.childName || '');
      }
    } catch { /* ignore */ }
  }, []);

  const handleSubmit = () => {
    // In production: POST to notification_requests with LINE LIFF user ID
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
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>🔔</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)', color: 'var(--color-primary-dark)' }}>
              新着スイーツをLINEでお知らせ
            </h1>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.8,
              marginBottom: 'var(--space-xl)',
              maxWidth: 500,
              margin: '0 auto var(--space-xl)',
            }}>
              {childName ? `${childName}ちゃんが` : 'お子さまが'}安全に食べられる新しいスイーツが登録されたら、<br />
              LINEでリアルタイムにお知らせします。
            </p>

            {/* Current Allergen Profile Summary */}
            {myAllergens.length > 0 && (
              <div style={{
                background: 'var(--color-safe-bg)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-md)',
                marginBottom: 'var(--space-xl)',
                maxWidth: 400, margin: '0 auto var(--space-xl)',
              }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-safe)', fontWeight: 600, marginBottom: 8 }}>
                  🛡️ 現在の除外対象: {myAllergens.length}品目
                </p>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {myAllergens.map(code => (
                    <span key={code} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                      background: 'white', borderRadius: 16, padding: '3px 8px',
                      fontSize: '0.75rem', fontWeight: 600,
                      border: '1px solid var(--color-border)',
                    }}>
                      {ALLERGEN_EMOJI[code]} {MANDATORY_ALLERGENS.find(a => a.code === code)?.name || code}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 6 }}>
                  上記を含まない商品が登録されたときにお知らせ
                </p>
              </div>
            )}

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

            {/* LINE CTA */}
            <button
              className="btn btn-lg"
              onClick={handleSubmit}
              id="submit-request"
              style={{
                background: '#06C755', color: 'white', border: 'none',
                fontWeight: 700, fontSize: '1rem', padding: '14px 32px',
                borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 400,
              }}
            >
              <span style={{ fontSize: '1.2rem', marginRight: 8 }}>💬</span>
              LINEで通知を受け取る
            </button>

            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-md)' }}>
              ※ LINE LIFF連携時、お使いのLINEアカウントに通知が届きます<br />
              ※ 通知はいつでも解除できます
            </p>
          </div>
        ) : (
          <div className="animate-fadeInUp">
            <div style={{ fontSize: '5rem', marginBottom: 'var(--space-lg)' }}>✅</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)', color: 'var(--color-safe)' }}>
              通知設定が完了しました！
            </h1>
            <p style={{
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.8,
              marginBottom: 'var(--space-xl)',
              maxWidth: 500,
              margin: '0 auto var(--space-xl)',
            }}>
              {childName ? `${childName}ちゃんが` : 'お子さまが'}安全に食べられる新しいスイーツが登録されたら、<br />
              LINEでリアルタイムにお知らせします 🍰
            </p>
            <div style={{
              background: '#F0FDF4', borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-lg)', maxWidth: 400, margin: '0 auto var(--space-xl)',
            }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', marginBottom: 8 }}>
                📋 通知条件:
              </p>
              {myAllergens.length > 0 && (
                <p style={{ fontSize: '0.8rem', color: '#15803D', marginBottom: 4 }}>
                  除外: {myAllergens.map(c => ALLERGEN_EMOJI[c]).join(' ')}
                </p>
              )}
              {area && (
                <p style={{ fontSize: '0.8rem', color: '#15803D' }}>
                  エリア: {area}
                </p>
              )}
            </div>
            <div style={{
              background: '#FEF3C7', borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)', maxWidth: 400, margin: '0 auto var(--space-lg)',
              fontSize: '0.8rem', color: '#92400E', lineHeight: 1.6,
            }}>
              ⚠️ デモ版のため、実際のLINE通知は送信されません。<br/>
              本番環境ではLINE LIFFと連携して通知が届きます。
            </div>
            <Link href="/" className="btn btn-primary" id="back-to-home">
              ホームに戻る
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
