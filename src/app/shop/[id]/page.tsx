'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { getStoreWithProducts } from '@/lib/supabase';
import { ALL_ALLERGENS, MANDATORY_ALLERGENS, RECOMMENDED_ALLERGENS, ALLERGEN_EMOJI } from '@/lib/allergens';
import { STORAGE_KEYS, APP_NAME } from '@/lib/constants';
import type { Product, Store, AllergenProfile } from '@/lib/types';


export default function ShopPage() {
  const params = useParams();
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [myAllergens, setMyAllergens] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALLERGEN_PROFILE);
      if (saved) {
        const profile = JSON.parse(saved) as AllergenProfile;
        return profile.myAllergens || [];
      }
    } catch { /* ignore */ }
    return [];
  });
  const [showAllAllergens, setShowAllAllergens] = useState(false);

  // Load store data
  useEffect(() => {
    const load = async () => {
      const data = await getStoreWithProducts(params.id as string);
      if (data) {
        setStore(data.store);
        setProducts(data.products);
      }
      setLoading(false);
    };
    load();
  }, [params.id]);

  const toggleAllergen = (code: string) => {
    setMyAllergens(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const displayAllergens = showAllAllergens
    ? [...MANDATORY_ALLERGENS, ...RECOMMENDED_ALLERGENS]
    : MANDATORY_ALLERGENS;

  // Filter products by selected allergens
  const filteredProducts = useMemo(() => {
    if (myAllergens.length === 0) return products;
    return products.filter(product => {
      const allergens = product.allergens || [];
      return !myAllergens.some(code =>
        allergens.some(a => a.allergen_code === code)
      );
    });
  }, [products, myAllergens]);

  const hiddenCount = products.length - filteredProducts.length;

  // Google Maps embed URL (no API key needed)
  const mapEmbedUrl = store?.address
    ? `https://maps.google.com/maps?q=${encodeURIComponent(store.address)}&output=embed&z=16`
    : null;

  const mapLinkUrl = store?.latitude && store?.longitude
    ? `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`
    : store?.address
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address)}`
    : null;

  if (loading) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="navbar-logo">
              <span className="navbar-logo-emoji">🍰</span>
              <span>{APP_NAME}</span>
            </Link>
          </div>
        </nav>
        <main className="container container-narrow" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
          <div className="skeleton" style={{ height: 32, width: '60%', marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 24 }} />
          <div className="skeleton" style={{ height: 200, borderRadius: 16, marginBottom: 24 }} />
          <div style={{ display: 'grid', gap: 16 }}>
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />)}
          </div>
        </main>
      </>
    );
  }

  if (!store) {
    return (
      <>
        <nav className="navbar">
          <div className="navbar-inner">
            <Link href="/" className="navbar-logo">
              <span className="navbar-logo-emoji">🍰</span>
              <span>{APP_NAME}</span>
            </Link>
          </div>
        </nav>
        <div className="empty-state" style={{ minHeight: '60dvh' }}>
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">店舗が見つかりませんでした</h3>
          <Link href="/" className="btn btn-primary">トップへ戻る</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <span className="navbar-logo-emoji">🍰</span>
            <span>{APP_NAME}</span>
          </Link>
          <div className="navbar-links">
            <Link href="/shops" className="navbar-link">🧁 お店一覧</Link>
            <Link href="/" className="navbar-link">🍰 商品を探す</Link>
            <Link href="/feedback" className="navbar-link">💬 ご意見</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-lg) var(--space-md) var(--space-3xl)' }}>

        {/* ===== Store Header ===== */}
        <section className="animate-fadeIn" style={{
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 50%, #ECFDF5 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-xl) var(--space-lg)',
          marginBottom: 'var(--space-xl)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -20, right: -20, fontSize: '6rem', opacity: 0.1,
            transform: 'rotate(15deg)',
          }}>🧁</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', flexShrink: 0,
              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
            }}>
              🍰
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1.2 }}>
                {store.store_name}
              </h1>
              {store.is_verified && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: '0.75rem', color: 'var(--color-safe)',
                  background: 'var(--color-safe-bg)', padding: '2px 8px',
                  borderRadius: 999, fontWeight: 600, marginTop: 4,
                }}>
                  ✅ 認証済み店舗
                </span>
              )}
            </div>
          </div>

          {store.description && (
            <p style={{
              fontSize: '0.9rem', color: 'var(--color-text-secondary)',
              lineHeight: 1.6, marginBottom: 'var(--space-md)',
            }}>
              {store.description}
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            {store.address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                <span>📍</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>{store.address}</span>
              </div>
            )}
            {store.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                <span>📞</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>{store.phone}（デモ用番号）</span>
              </div>
            )}
            {store.website_url && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                <span>🌐</span>
                <span
                  onClick={() => alert('🚧 デモ版のため、Webサイトへの遷移は無効です。')}
                  style={{ color: 'var(--color-primary)', textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Webサイトを見る
                </span>
              </div>
            )}
            {store.business_hours && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                <span>🕐</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>{store.business_hours}</span>
              </div>
            )}
            {store.price_range && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem' }}>
                <span>💰</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>{store.price_range}</span>
              </div>
            )}
          </div>

          {/* Feature Badges */}
          {store.features && store.features.length > 0 && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'var(--space-md)',
            }}>
              {store.features.map(f => {
                const badges: Record<string, { emoji: string; label: string }> = {
                  kids_friendly: { emoji: '👶', label: 'キッズ歓迎' },
                  stroller_ok: { emoji: '🍼', label: 'ベビーカーOK' },
                  eat_in: { emoji: '🪑', label: 'イートイン' },
                  takeout: { emoji: '🛍️', label: 'テイクアウト' },
                  delivery: { emoji: '🚚', label: '配送対応' },
                  parking: { emoji: '🅿️', label: '駐車場あり' },
                  allergy_consultation: { emoji: '💬', label: 'アレルギー相談可' },
                  gluten_free_dedicated: { emoji: '🌾', label: 'グルテンフリー専門' },
                  vegan_dedicated: { emoji: '🌱', label: 'ヴィーガン専門' },
                };
                const badge = badges[f];
                if (!badge) return null;
                return (
                  <span key={f} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: 'white', borderRadius: 20, padding: '4px 10px',
                    fontSize: '0.75rem', fontWeight: 600,
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}>
                    {badge.emoji} {badge.label}
                  </span>
                );
              })}
            </div>
          )}
        </section>

        {/* ===== MAP Section ===== */}
        {mapEmbedUrl && (
          <section className="animate-fadeInUp stagger-1" style={{ marginBottom: 'var(--space-xl)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
              📍 アクセス
            </h2>
            <div style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--color-border-light)',
              boxShadow: 'var(--shadow-md)',
            }}>
              <iframe
                title={`${store.store_name}の地図`}
                src={mapEmbedUrl}
                width="100%"
                height="280"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            {mapLinkUrl && (
              <a
                href={mapLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-full"
                style={{ marginTop: 'var(--space-md)' }}
              >
                📍 Google Maps でルートを表示
              </a>
            )}
          </section>
        )}

        {/* ===== Allergen Filter ===== */}
        <section className="animate-fadeInUp stagger-2" style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
              🛡️ アレルギーで絞り込む
            </h2>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setShowAllAllergens(!showAllAllergens)}
            >
              {showAllAllergens ? '主要8品目のみ' : '全28品目'}
            </button>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
            お子さまのアレルギーを選択すると、安心して食べられるメニューだけが表示されます
          </p>

          <div className="allergen-grid">
            {displayAllergens.map(allergen => (
              <button
                key={allergen.code}
                className={`allergen-chip ${myAllergens.includes(allergen.code) ? 'selected' : ''}`}
                onClick={() => toggleAllergen(allergen.code)}
              >
                <span className="allergen-chip-icon">{ALLERGEN_EMOJI[allergen.code] || '🔸'}</span>
                <span>{allergen.name}</span>
              </button>
            ))}
          </div>

          {myAllergens.length > 0 && (
            <div style={{
              background: 'var(--color-safe-bg)', borderRadius: 'var(--radius-md)',
              padding: 'var(--space-sm) var(--space-md)', marginTop: 'var(--space-md)',
              fontSize: '0.8rem', color: 'var(--color-safe)', fontWeight: 600,
            }}>
              ✅ {myAllergens.length}品目を除外中
              {hiddenCount > 0 && ` — ${hiddenCount}件の商品を非表示`}
            </div>
          )}
        </section>

        {/* ===== Products ===== */}
        <section className="animate-fadeInUp stagger-3">
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-md)' }}>
            🍰 メニュー <span style={{ fontWeight: 400, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              ({filteredProducts.length}件)
            </span>
          </h2>

          {filteredProducts.length === 0 ? (
            <div className="empty-state" style={{ minHeight: 200 }}>
              <div className="empty-state-icon">🔍</div>
              <h3 className="empty-state-title">条件に合う商品がありません</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                フィルタを変更してみてください
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              {filteredProducts.map(product => {
                const allergens = product.allergens || [];
                return (
                  <div key={product.id} className="card" style={{
                    padding: 'var(--space-lg)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'default',
                  }}>
                    {/* Product Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
                      <div style={{
                        width: 72, height: 72, borderRadius: 'var(--radius-md)',
                        background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-bg-secondary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: '2rem',
                      }}>
                        🍰
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>
                          {product.product_name}
                        </h3>
                        {product.ai_summary && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                            {product.ai_summary}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Allergen Badges */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
                      {allergens.length > 0 ? (
                        allergens.map(a => (
                          <span key={a.allergen_code} className="badge badge-warning">
                            ⚠️ {ALL_ALLERGENS.find(al => al.code === a.allergen_code)?.name}含む
                          </span>
                        ))
                      ) : (
                        <span className="badge badge-safe">✅ アレルゲンフリー</span>
                      )}
                    </div>

                    {/* Dual CTA */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-sm)' }}>
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ textAlign: 'center', fontSize: '0.8rem' }}
                        onClick={() => alert('🚧 デモ版では利用できません。\n本番環境では購入ページに遷移します。')}
                      >
                        🛒 ネットで購入
                      </button>
                      {mapLinkUrl ? (
                        <a
                          href={mapLinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary btn-sm"
                          style={{ textAlign: 'center', fontSize: '0.8rem' }}
                        >
                          📍 お店に行く
                        </a>
                      ) : (
                        <Link
                          href={`/product/${product.id}`}
                          className="btn btn-secondary btn-sm"
                          style={{ textAlign: 'center', fontSize: '0.8rem' }}
                        >
                          📋 詳細を見る
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Safety Disclaimer */}
        <div style={{
          marginTop: 'var(--space-xl)',
          padding: 'var(--space-md)',
          background: 'var(--color-bg-secondary)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.75rem',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          ⚠️ 最終的なアレルギー成分の確認は、必ず店舗・ECサイトで行ってください。<br/>
          当サイトの情報は参考情報であり、正確性を保証するものではありません。
        </div>
      </main>
    </>
  );
}
