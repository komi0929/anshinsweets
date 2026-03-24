'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllStores } from '@/lib/supabase';
import { APP_NAME, REGIONS } from '@/lib/constants';
import type { Store } from '@/lib/types';

export default function ShopsPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPrefecture, setSelectedPrefecture] = useState('');

  // Get prefectures for selected region
  const regionData = REGIONS.find(r => r.value === selectedRegion);
  const prefectures = regionData?.prefectures || [];

  // Fetch stores when prefecture changes
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getAllStores(selectedPrefecture ? { prefecture: selectedPrefecture } : undefined);
      setStores(data);
      setLoading(false);
    };
    load();
  }, [selectedPrefecture]);

  const handleRegionSelect = (value: string) => {
    if (selectedRegion === value) {
      setSelectedRegion('');
      setSelectedPrefecture('');
    } else {
      setSelectedRegion(value);
      setSelectedPrefecture('');
    }
  };

  const handlePrefectureSelect = (pref: string) => {
    setSelectedPrefecture(selectedPrefecture === pref ? '' : pref);
  };

  const clearFilter = () => {
    setSelectedRegion('');
    setSelectedPrefecture('');
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
            <Link href="/" className="navbar-link">🍰 商品を探す</Link>
            <Link href="/profile" className="navbar-link">プロフィール</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #FFF7ED 0%, #ECFDF5 50%, #EFF6FF 100%)',
        padding: 'var(--space-xl) var(--space-md)',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h1 style={{
            fontSize: '1.6rem', fontWeight: 800,
            background: 'linear-gradient(135deg, #EA580C, #16A34A)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 'var(--space-sm)',
          }} className="animate-fadeIn">
            🧁 お店を探す
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }} className="animate-fadeIn stagger-1">
            アレルギー対応スイーツを扱うお店を<br/>
            エリアから探せます
          </p>
        </div>
      </section>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: 'var(--space-lg) var(--space-md) var(--space-3xl)' }}>

        {/* Region selector */}
        <section style={{ marginBottom: 'var(--space-lg)' }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 'var(--space-sm)', color: 'var(--color-text-secondary)' }}>
            📍 地方から選ぶ
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', marginBottom: 'var(--space-md)' }}>
            {REGIONS.map(region => (
              <button
                key={region.value}
                className={`btn btn-sm ${selectedRegion === region.value ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleRegionSelect(region.value)}
                style={{ fontSize: '0.85rem' }}
              >
                {region.label}
              </button>
            ))}
          </div>

          {/* Prefecture pills (shown when region is selected) */}
          {selectedRegion && prefectures.length > 0 && (
            <div style={{
              display: 'flex', gap: 6, flexWrap: 'wrap',
              padding: 'var(--space-md)',
              background: 'var(--color-bg-secondary)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--space-md)',
            }}>
              {prefectures.map(pref => (
                <button
                  key={pref}
                  className={`btn btn-sm ${selectedPrefecture === pref ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handlePrefectureSelect(pref)}
                  style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                >
                  {pref}
                </button>
              ))}
            </div>
          )}

          {/* Active filter indicator */}
          {selectedPrefecture && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-sm)',
              padding: '8px 14px', background: 'var(--color-primary-50)',
              borderRadius: 'var(--radius-md)', fontSize: '0.85rem',
              color: 'var(--color-primary-dark)', fontWeight: 600,
              marginBottom: 'var(--space-md)',
            }}>
              <span>📍 {selectedPrefecture} で絞り込み中</span>
              <button
                onClick={clearFilter}
                style={{
                  background: 'none', border: 'none', fontSize: '0.9rem',
                  cursor: 'pointer', color: 'var(--color-text-muted)', marginLeft: 'auto',
                }}
              >
                ✕ 解除
              </button>
            </div>
          )}
        </section>

        {/* Store list */}
        {loading ? (
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {[1,2,3].map(i => (
              <div key={i} className="skeleton" style={{ height: 160, borderRadius: 16 }} />
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="empty-state" style={{ minHeight: 300 }}>
            <div className="empty-state-icon">🧁</div>
            <h3 className="empty-state-title">
              {selectedPrefecture ? `${selectedPrefecture}には登録店舗がありません` : '登録店舗がありません'}
            </h3>
            <p className="empty-state-desc">
              {selectedPrefecture
                ? 'お店が登録され次第こちらに表示されます。他の地域も試してみてください。'
                : '現在お店の登録がありません。'}
            </p>
            {selectedPrefecture && (
              <button className="btn btn-secondary" onClick={clearFilter} style={{ marginTop: 'var(--space-md)' }}>
                絞り込みを解除
              </button>
            )}
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)' }}>
              {stores.length}件のお店が見つかりました
              {selectedPrefecture && <span>（{selectedPrefecture}）</span>}
            </p>

            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              {stores.map((store, i) => (
                <Link
                  key={store.id}
                  href={`/shop/${store.id}`}
                  className={`card animate-fadeInUp stagger-${Math.min(i + 1, 5)}`}
                  style={{
                    display: 'flex', gap: 'var(--space-lg)', padding: 'var(--space-lg)',
                    textDecoration: 'none', color: 'inherit',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {/* Store Avatar */}
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-primary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '2rem',
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.2)',
                  }}>
                    🍰
                  </div>

                  {/* Store Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4, flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{store.store_name}</h2>
                      {store.is_verified && (
                        <span style={{
                          fontSize: '0.65rem', background: 'var(--color-safe-bg)',
                          color: 'var(--color-safe)', padding: '1px 6px',
                          borderRadius: 999, fontWeight: 600,
                        }}>
                          ✅ 認証済み
                        </span>
                      )}
                      {store.prefecture && (
                        <span style={{
                          fontSize: '0.65rem', background: 'var(--color-info-bg)',
                          color: 'var(--color-info)', padding: '1px 6px',
                          borderRadius: 999, fontWeight: 600,
                        }}>
                          📍 {store.prefecture}
                        </span>
                      )}
                    </div>

                    {store.description && (
                      <p style={{
                        fontSize: '0.85rem', color: 'var(--color-text-secondary)',
                        marginBottom: 8, lineHeight: 1.5,
                        overflow: 'hidden', textOverflow: 'ellipsis',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      }}>
                        {store.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-sm)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                      {store.address && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          📍 {store.address}
                        </span>
                      )}
                    </div>

                    {/* Feature badges */}
                    {store.features && store.features.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 'var(--space-sm)' }}>
                        {store.features.slice(0, 3).map(f => (
                          <span key={f} style={{
                            fontSize: '0.65rem', padding: '2px 8px',
                            background: 'var(--color-bg-secondary)',
                            borderRadius: 999, color: 'var(--color-text-secondary)',
                          }}>
                            {f === 'kids_friendly' ? '👶 キッズ歓迎' :
                             f === 'allergy_consultation' ? '💬 相談可' :
                             f === 'gluten_free_dedicated' ? '🌾 GF専門' :
                             f === 'eat_in' ? '🪑 イートイン' :
                             f === 'takeout' ? '🛍️ テイクアウト' : f}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{
                      marginTop: 'var(--space-sm)',
                      fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600,
                    }}>
                      メニュー・地図を見る →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}
