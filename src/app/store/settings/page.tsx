'use client';

import Link from 'next/link';
import { useState } from 'react';
import { APP_NAME } from '@/lib/constants';

export default function StoreSettingsPage() {
  const [storeName, setStoreName] = useState('パティスリー・ソレイユ');
  const [description, setDescription] = useState('アレルギー対応に特化した洋菓子店。すべてのお子さまに笑顔を届けたい。');
  const [address, setAddress] = useState('東京都渋谷区神宮前3-1-1');
  const [phone, setPhone] = useState('03-1234-5678');
  const [website, setWebsite] = useState('https://example.com/soleil');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/store/dashboard" className="navbar-logo">
            <span className="navbar-logo-emoji">🍰</span>
            <span>{APP_NAME} 管理</span>
          </Link>
          <div className="navbar-links">
            <Link href="/store/dashboard" className="navbar-link">← ダッシュボード</Link>
          </div>
        </div>
      </nav>

      <main className="container container-narrow" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        <h1 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-sm)' }} className="animate-fadeIn">
          🏪 店舗基本情報設定
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }} className="animate-fadeIn stagger-1">
          店舗の基本情報を編集できます。住所はGoogle Maps APIで入力補助されます。
        </p>

        {/* Basic Info */}
        <div className="form-section animate-fadeInUp stagger-2">
          <h2 className="form-section-title">📋 基本情報</h2>

          <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
            <label className="input-label" htmlFor="settings-name">店舗名 *</label>
            <input
              id="settings-name"
              className="input-field"
              type="text"
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
            <label className="input-label" htmlFor="settings-description">店舗紹介</label>
            <textarea
              id="settings-description"
              className="input-field"
              rows={3}
              placeholder="お店の特徴やこだわりを教えてください"
              value={description}
              onChange={e => setDescription(e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>

        {/* Location */}
        <div className="form-section animate-fadeInUp stagger-3">
          <h2 className="form-section-title">📍 所在地</h2>

          <div style={{
            background: 'var(--color-info-bg)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-md)',
            fontSize: '0.8rem',
            color: 'var(--color-info)',
          }}>
            💡 Google Maps APIによる入力補助が利用できます（下書きとしてオートフィルされます）。
            最終的な住所は必ず目視で確認・修正してください。
          </div>

          <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
            <label className="input-label" htmlFor="settings-address">住所 *</label>
            <input
              id="settings-address"
              className="input-field"
              type="text"
              placeholder="Google Mapsで検索..."
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
              ※ オートフィルされた住所を必ず確認してください
            </p>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label" htmlFor="settings-phone">電話番号</label>
              <input
                id="settings-phone"
                className="input-field"
                type="tel"
                placeholder="03-1234-5678"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="settings-website">Webサイト</label>
              <input
                id="settings-website"
                className="input-field"
                type="url"
                placeholder="https://..."
                value={website}
                onChange={e => setWebsite(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Map Preview */}
        <div className="form-section animate-fadeInUp stagger-4">
          <h2 className="form-section-title">🗺️ 地図プレビュー</h2>
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, var(--color-bg-secondary), var(--color-border-light))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 'var(--space-sm)',
            color: 'var(--color-text-muted)',
            fontSize: '0.85rem',
          }}>
            <span style={{ fontSize: '2.5rem', opacity: 0.5 }}>🗺️</span>
            <span>Google Maps APIキー設定後に表示されます</span>
          </div>
        </div>

        {/* Save */}
        <div style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-3xl)' }}>
          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleSave}
            disabled={saving || !storeName}
            id="save-settings"
          >
            {saving ? '保存中...' : '💾 設定を保存'}
          </button>
        </div>

        {saved && (
          <div className="toast">✅ 店舗情報を保存しました</div>
        )}
      </main>
    </>
  );
}
