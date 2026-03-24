'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MANDATORY_ALLERGENS, RECOMMENDED_ALLERGENS, ALL_ALLERGENS, ALLERGEN_EMOJI } from '@/lib/allergens';
import { APP_NAME, AI_SUMMARY_MAX_LENGTH } from '@/lib/constants';


type AllergenLevel = 'none' | 'contains' | 'line';
type AllergenState = Record<string, AllergenLevel>;

export default function NewProductPage() {
  const [productUrl, setProductUrl] = useState('');
  const [productName, setProductName] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [allergenStates, setAllergenStates] = useState<AllergenState>({});
  const [consent, setConsent] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [extractStatus, setExtractStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // AI extraction (mock)
  const handleExtract = async () => {
    if (!productUrl) return;
    setExtracting(true);
    setExtractStatus('idle');
    // In production: POST /api/ai/extract
    await new Promise(r => setTimeout(r, 1500));
    setProductName('米粉のふわふわショートケーキ');
    setAiSummary('米粉と豆乳クリームで作る、ふわっと軽い口どけのケーキ');
    setExtractStatus('success');
    setExtracting(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleAllergen = (code: string) => {
    setAllergenStates(prev => {
      const current = prev[code] || 'none';
      const next: AllergenLevel = current === 'none' ? 'contains' : current === 'contains' ? 'line' : 'none';
      return { ...prev, [code]: next };
    });
  };

  const containsCount = Object.values(allergenStates).filter(v => v === 'contains').length;
  const lineCount = Object.values(allergenStates).filter(v => v === 'line').length;
  const canPublish = productName && productUrl && consent;

  const handleSave = async () => {
    if (!canPublish) return;
    setSaving(true);
    // In production: POST /api/products
    await new Promise(r => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
  };

  if (saved) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/store/dashboard" className="navbar-logo">
              <span className="navbar-logo-emoji">🍰</span>
              <span>{APP_NAME} 管理</span>
            </Link>
          </div>
        </nav>
        <main className="container container-narrow" style={{ padding: 'var(--space-3xl) var(--space-md)', textAlign: 'center' }}>
          <div className="animate-fadeInUp">
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>✅</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>商品を登録しました！</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
              アレルギー対応情報とともに公開されました。
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
              <Link href="/store/dashboard" className="btn btn-primary">ダッシュボードへ</Link>
              <Link href="/store/products/new" className="btn btn-secondary">もう1件追加</Link>
            </div>
          </div>
        </main>
      </>
    );
  }

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
          📦 新しい商品を登録
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }} className="animate-fadeIn stagger-1">
          商品URLをを貼り付けるだけで、AIが自動で紹介文を生成します。
          アレルギー情報は必ず手動で設定してください。
        </p>

        {/* Section 1: Product Info */}
        <div className="form-section animate-fadeInUp stagger-2">
          <h2 className="form-section-title">🔗 商品情報</h2>

          <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
            <label className="input-label" htmlFor="product-url">商品URL（ECサイト） *</label>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <input
                id="product-url"
                className="input-field"
                type="url"
                placeholder="https://your-shop.com/products/..."
                value={productUrl}
                onChange={e => setProductUrl(e.target.value)}
                style={{ flex: 1 }}
              />
              <button
                className="btn btn-secondary"
                onClick={handleExtract}
                disabled={!productUrl || extracting}
                id="extract-btn"
              >
                {extracting ? '抽出中...' : '✨ AI抽出'}
              </button>
            </div>
            {extractStatus === 'success' && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-safe)', marginTop: 4 }}>
                ✅ AIが商品情報を抽出しました
              </p>
            )}
            {extractStatus === 'error' && (
              <p style={{ fontSize: '0.8rem', color: 'var(--color-danger)', marginTop: 4 }}>
                ❌ 食品・スイーツに関連する商品ではないようです
              </p>
            )}
          </div>

          <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
            <label className="input-label" htmlFor="product-name">商品名 *</label>
            <input
              id="product-name"
              className="input-field"
              type="text"
              placeholder="米粉のふわふわショートケーキ"
              value={productName}
              onChange={e => setProductName(e.target.value)}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 'var(--space-md)' }}>
            <label className="input-label" htmlFor="ai-summary">
              魅力の一行（最大{AI_SUMMARY_MAX_LENGTH}文字） - AIが自動生成
            </label>
            <input
              id="ai-summary"
              className="input-field"
              type="text"
              maxLength={AI_SUMMARY_MAX_LENGTH}
              placeholder="AIが自動生成した紹介文が入ります"
              value={aiSummary}
              onChange={e => setAiSummary(e.target.value)}
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textAlign: 'right' }}>
              {aiSummary.length}/{AI_SUMMARY_MAX_LENGTH}文字
            </p>
          </div>
        </div>

        {/* Section 2: Image Upload */}
        <div className="form-section animate-fadeInUp stagger-3">
          <h2 className="form-section-title">📷 商品画像</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
            ※ 店舗が撮影した実物の写真のみアップロードしてください。AI生成画像は使用できません。
          </p>

          <div style={{
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            background: imagePreview ? 'transparent' : 'var(--color-bg-secondary)',
          }}>
            {imagePreview ? (
              <div style={{ position: 'relative' }}>
                <img
                  src={imagePreview}
                  alt="プレビュー"
                  style={{ maxHeight: 200, borderRadius: 'var(--radius-md)', margin: '0 auto' }}
                />
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  style={{ marginTop: 'var(--space-sm)' }}
                >
                  画像を削除
                </button>
              </div>
            ) : (
              <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-sm)', opacity: 0.5 }}>📷</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                  クリックして画像をアップロード
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                  JPG, PNG, WebP（最大5MB）
                </p>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>
            )}
          </div>
        </div>

        {/* Section 3: Allergen Settings - CRITICAL */}
        <div className="form-section animate-fadeInUp stagger-4">
          <h2 className="form-section-title">🛡️ アレルギー対応情報（手動設定必須）</h2>

          <div style={{
            background: 'var(--color-danger-bg)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            fontSize: '0.85rem',
          }}>
            <p style={{ fontWeight: 700, color: 'var(--color-danger)', marginBottom: 4 }}>
              ⚠️ 重要: アレルギー情報のAI自動判定は行いません
            </p>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              以下の各品目について、この商品の状態を設定してください。
              タップするたびに「含まない → 含む → 同一ライン製造」と切り替わります。
              <strong>誤った情報は生命に関わります。正確にチェックしてください。</strong>
            </p>
          </div>

          {/* Mandatory 8 */}
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 'var(--space-md)', color: 'var(--color-danger)' }}>
            🔴 特定原材料 8品目（表示義務）― 含まれるものにチェック
          </h3>
          <div className="allergen-grid" style={{ marginBottom: 'var(--space-xl)' }}>
            {MANDATORY_ALLERGENS.map(allergen => (
              <button
                key={allergen.code}
                className={`allergen-chip ${(allergenStates[allergen.code] || 'none') === 'contains' ? 'selected' : (allergenStates[allergen.code] || 'none') === 'line' ? 'selected' : ''}`}
                style={(allergenStates[allergen.code] || 'none') === 'line' ? { borderColor: '#F59E0B', background: '#FFFBEB' } : undefined}
                onClick={() => toggleAllergen(allergen.code)}
                id={`allergen-set-${allergen.code}`}
              >
                <span className="allergen-chip-icon">{ALLERGEN_EMOJI[allergen.code]}</span>
                <span>{allergen.name}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>
                  {(allergenStates[allergen.code] || 'none') === 'contains' ? '⚠️ 含む' : (allergenStates[allergen.code] || 'none') === 'line' ? '🏭 同一ライン' : '含まない'}
                </span>
              </button>
            ))}
          </div>

          {/* Recommended 20 */}
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 'var(--space-md)', color: 'var(--color-warning)' }}>
            🟡 特定原材料に準ずるもの 20品目（表示推奨）― 含まれるものにチェック
          </h3>
          <div className="allergen-grid" style={{ marginBottom: 'var(--space-lg)' }}>
            {RECOMMENDED_ALLERGENS.map(allergen => (
              <button
                key={allergen.code}
                className={`allergen-chip ${(allergenStates[allergen.code] || 'none') === 'contains' ? 'selected' : (allergenStates[allergen.code] || 'none') === 'line' ? 'selected' : ''}`}
                style={(allergenStates[allergen.code] || 'none') === 'line' ? { borderColor: '#F59E0B', background: '#FFFBEB' } : undefined}
                onClick={() => toggleAllergen(allergen.code)}
                id={`allergen-set-${allergen.code}`}
              >
                <span className="allergen-chip-icon">{ALLERGEN_EMOJI[allergen.code]}</span>
                <span>{allergen.name}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>
                  {(allergenStates[allergen.code] || 'none') === 'contains' ? '⚠️ 含む' : (allergenStates[allergen.code] || 'none') === 'line' ? '🏭 同一ライン' : '含まない'}
                </span>
              </button>
            ))}
          </div>

          {(containsCount > 0 || lineCount > 0) && (
            <div style={{
              background: 'var(--color-warning-bg)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-md)',
              marginBottom: 'var(--space-md)',
            }}>
              {containsCount > 0 && (
                <p style={{ fontSize: '0.85rem', color: 'var(--color-danger)', fontWeight: 600, marginBottom: lineCount > 0 ? 6 : 0 }}>
                  ⚠️ {containsCount}品目を「含む」: {ALL_ALLERGENS.filter(a => allergenStates[a.code] === 'contains').map(a => a.name).join('、')}
                </p>
              )}
              {lineCount > 0 && (
                <p style={{ fontSize: '0.85rem', color: '#D97706', fontWeight: 600 }}>
                  🏭 {lineCount}品目を「同一ライン製造」: {ALL_ALLERGENS.filter(a => allergenStates[a.code] === 'line').map(a => a.name).join('、')}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Section 4: Legal Consent - CRITICAL */}
        <div className="consent-box">
          <div className="consent-box-title">
            ⚖️ 法的責任に関する同意（必須）
          </div>
          <p className="consent-box-text">
            上記のアレルギー表示情報は、当店が責任を持って正確に入力したものです。
            この情報に基づいてユーザーが商品を選択・購入し、万が一アレルギー反応等の
            健康被害が発生した場合、当店がその法的責任を負うことを理解し、同意します。
          </p>
          <div
            className="checkbox-wrapper"
            onClick={() => setConsent(!consent)}
          >
            <div className={`checkbox ${consent ? 'checked' : ''}`}>
              {consent && '✓'}
            </div>
            <span className="checkbox-label" style={{ fontWeight: 700, color: consent ? 'var(--color-safe)' : 'var(--color-text)' }}>
              上記の内容に同意し、アレルギー表示の法的責任を負います
            </span>
          </div>
        </div>

        {/* Submit */}
        <div style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-3xl)' }}>
          <button
            className="btn btn-cta btn-full btn-lg"
            disabled={!canPublish || saving}
            onClick={handleSave}
            id="publish-product"
          >
            {saving ? '保存中...' : '🚀 商品を公開する'}
          </button>
          {!canPublish && (
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>
              商品名、URL、法的同意が必要です
            </p>
          )}
        </div>
      </main>
    </>
  );
}
