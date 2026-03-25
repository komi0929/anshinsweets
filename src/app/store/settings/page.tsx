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
  const [businessHours, setBusinessHours] = useState('10:00〜19:00（火曜定休）');
  const [priceRange, setPriceRange] = useState('￥400〜￥2,800');
  const [features, setFeatures] = useState<string[]>(['kids_friendly', 'stroller_ok', 'eat_in', 'takeout', 'allergy_consultation']);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>('https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&h=400&fit=crop&crop=center');
  const [logoImage, setLogoImage] = useState<string | null>('https://images.unsplash.com/photo-1486427944544-d2c246c4df14?w=200&h=200&fit=crop&crop=center');

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleImageUpload = (type: 'cover' | 'logo') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      alert('画像ファイルを選択してください');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('ファイルサイズは5MB以下にしてください');
      return;
    }
    const url = URL.createObjectURL(file);
    if (type === 'cover') setCoverImage(url);
    else setLogoImage(url);
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
          🧁 店舗基本情報設定
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }} className="animate-fadeIn stagger-1">
          店舗の基本情報を編集できます。住所はGoogle Maps APIで入力補助されます。
        </p>

        {/* Photo Upload Section */}
        <div className="form-section animate-fadeInUp stagger-2">
          <h2 className="form-section-title">📷 お店の写真</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
            お店の魅力を伝える写真を登録しましょう。一覧や詳細ページに表示されます。
          </p>

          {/* Cover Image */}
          <div style={{ marginBottom: 'var(--space-lg)' }}>
            <label className="input-label">カバー画像（横長推奨: 800×400px）</label>
            <div
              style={{
                width: '100%', height: 180, borderRadius: 'var(--radius-lg)',
                background: coverImage
                  ? `url(${coverImage}) center/cover no-repeat`
                  : 'linear-gradient(135deg, var(--color-bg-secondary), var(--color-border-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 'var(--space-sm)',
                border: '2px dashed var(--color-border)',
                cursor: 'pointer', position: 'relative', overflow: 'hidden',
                transition: 'border-color 0.2s ease',
              }}
              onClick={() => document.getElementById('cover-upload')?.click()}
            >
              {!coverImage && (
                <>
                  <span style={{ fontSize: '2rem', opacity: 0.4 }}>📷</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    クリックして画像をアップロード
                  </span>
                </>
              )}
              {coverImage && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity 0.2s ease',
                }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
                >
                  <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
                    📷 画像を変更
                  </span>
                </div>
              )}
            </div>
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload('cover')}
            />
            {coverImage && (
              <button
                onClick={() => setCoverImage(null)}
                style={{
                  background: 'none', border: 'none', color: 'var(--color-danger)',
                  fontSize: '0.8rem', cursor: 'pointer', marginTop: 'var(--space-xs)',
                }}
              >
                ✕ カバー画像を削除
              </button>
            )}
          </div>

          {/* Logo Image */}
          <div>
            <label className="input-label">ロゴ画像（正方形推奨: 200×200px）</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div
                style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: logoImage
                    ? `url(${logoImage}) center/cover no-repeat`
                    : 'linear-gradient(135deg, var(--color-primary-50), var(--color-primary))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', flexShrink: 0,
                  border: '3px solid var(--color-border-light)',
                  cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                {!logoImage && '🍰'}
              </div>
              <div style={{ flex: 1 }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  type="button"
                >
                  📷 ロゴをアップロード
                </button>
                {logoImage && (
                  <button
                    onClick={() => setLogoImage(null)}
                    style={{
                      background: 'none', border: 'none', color: 'var(--color-danger)',
                      fontSize: '0.8rem', cursor: 'pointer', marginLeft: 'var(--space-sm)',
                    }}
                  >
                    ✕ 削除
                  </button>
                )}
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                  JPEG/PNG、5MB以下
                </p>
              </div>
            </div>
            <input
              id="logo-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload('logo')}
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className="form-section animate-fadeInUp stagger-3">
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
            <span>住所を入力すると、お店のページに地図が自動表示されます</span>
          </div>
        </div>

        {/* Business Info */}
        <div className="form-section animate-fadeInUp stagger-4">
          <h2 className="form-section-title">🕐 営業情報</h2>

          <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
            <label className="input-label" htmlFor="settings-hours">営業時間</label>
            <input
              id="settings-hours"
              className="input-field"
              type="text"
              placeholder="例: 10:00〜19:00（火曜定休）"
              value={businessHours}
              onChange={e => setBusinessHours(e.target.value)}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
            <label className="input-label" htmlFor="settings-price">価格帯</label>
            <input
              id="settings-price"
              className="input-field"
              type="text"
              placeholder="例: ¥400〜¥2,800"
              value={priceRange}
              onChange={e => setPriceRange(e.target.value)}
            />
          </div>
        </div>

        {/* Feature Badges - Simple Toggles */}
        <div className="form-section animate-fadeInUp stagger-5">
          <h2 className="form-section-title">✨ お店の特徴（タップで選択）</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
            該当するものをタップするだけ。お客様のお店ページにバッジとして表示されます。
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { code: 'kids_friendly', emoji: '👶', label: 'キッズ歓迎' },
              { code: 'stroller_ok', emoji: '🍼', label: 'ベビーカーOK' },
              { code: 'eat_in', emoji: '🪑', label: 'イートイン' },
              { code: 'takeout', emoji: '🛍️', label: 'テイクアウト' },
              { code: 'delivery', emoji: '🚚', label: '配送対応' },
              { code: 'parking', emoji: '🅿️', label: '駐車場あり' },
              { code: 'allergy_consultation', emoji: '💬', label: 'アレルギー相談OK' },
              { code: 'gluten_free_dedicated', emoji: '🌾', label: 'グルテンフリー専門' },
              { code: 'vegan_dedicated', emoji: '🌱', label: 'ヴィーガン専門' },
            ].map(item => (
              <button
                key={item.code}
                className={`allergen-chip ${features.includes(item.code) ? 'selected' : ''}`}
                onClick={() => {
                  setFeatures(prev =>
                    prev.includes(item.code)
                      ? prev.filter(f => f !== item.code)
                      : [...prev, item.code]
                  );
                }}
                style={{ padding: '6px 14px' }}
              >
                <span style={{ fontSize: '1rem' }}>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <div style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-lg)' }}>
          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleSave}
            disabled={saving || !storeName}
            id="save-settings"
          >
            {saving ? '保存中...' : '✅ 設定を保存'}
          </button>
        </div>

        {/* Preview Link */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'var(--space-3xl)',
        }}>
          <Link
            href="/shop/00000001-0000-0000-0000-000000000001"
            target="_blank"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: '0.9rem', color: 'var(--color-primary)',
              textDecoration: 'underline', textUnderlineOffset: 3,
              fontWeight: 600,
            }}
          >
            👁️ お店のページをプレビューする →
          </Link>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-xs)' }}>
            ユーザーに公開されるページの表示を確認できます
          </p>
        </div>

        {saved && (
          <div className="toast">✅ 店舗情報を保存しました</div>
        )}
      </main>
    </>
  );
}
