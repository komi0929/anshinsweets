'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getProducts } from '@/lib/supabase';
import { ALLERGEN_EMOJI } from '@/lib/allergens';
import { STORAGE_KEYS, APP_NAME } from '@/lib/constants';
import type { Product, AllergenProfile } from '@/lib/types';


const FAVORITES_KEY = 'anshin_favorites';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [myAllergens] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const profile = localStorage.getItem(STORAGE_KEYS.ALLERGEN_PROFILE);
      if (profile) {
        const p: AllergenProfile = JSON.parse(profile);
        return p.myAllergens || [];
      }
    } catch { /* ignore */ }
    return [];
  });

  useEffect(() => {
    const load = async () => {
      if (favorites.length === 0) { setLoading(false); return; }
      const result = await getProducts({ limit: 1000 });
      setProducts(result.products.filter(p => favorites.includes(p.id)));
      setLoading(false);
    };
    load();
  }, [favorites]);

  const removeFavorite = (id: string) => {
    const updated = favorites.filter(f => f !== id);
    setFavorites(updated);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  const handleShare = () => {
    const url = `${window.location.origin}/favorites?ids=${favorites.join(',')}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('安心リストのURLをコピーしました！家族や友人にシェアできます。');
    });
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
            <Link href="/feedback" className="navbar-link">💬 ご意見</Link>
          </div>
        </div>
      </nav>

      <main className="container" style={{ padding: 'var(--space-xl) var(--space-md)', maxWidth: 800, margin: '0 auto' }}>
        <div className="animate-fadeIn" style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>
            📖 安心リスト
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            お子さまが安心して食べられるスイーツを保存しています
          </p>
        </div>

        {favorites.length > 0 && (
          <div style={{ textAlign: 'right', marginBottom: 'var(--space-md)' }}>
            <button className="btn btn-sm btn-secondary" onClick={handleShare}>
              🔗 リストを共有
            </button>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {[1,2].map(i => (
              <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-md)' }} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="empty-state animate-fadeInUp" style={{ minHeight: 300 }}>
            <div className="empty-state-icon">📖</div>
            <h3 className="empty-state-title">まだ保存していません</h3>
            <p className="empty-state-desc">
              商品カードの ♡ ボタンを押すと、ここに保存されます。
            </p>
            <Link href="/" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>
              🍰 スイーツを探す
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
            {products.map(product => {
              const contained = product.allergens || [];
              const isSafe = myAllergens.length > 0 &&
                !myAllergens.some(a => contained.map(c => c.allergen_code).includes(a));
              return (
                <div key={product.id} className="card animate-fadeInUp" style={{
                  display: 'flex', gap: 'var(--space-md)', padding: 'var(--space-md)',
                  border: isSafe ? '2px solid var(--color-safe)' : undefined,
                }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: 'var(--radius-md)',
                    background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-bg-secondary))',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '2rem',
                  }}>🍰</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4 }}>
                      <Link href={`/product/${product.id}`} style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text)' }}>
                        {product.product_name}
                      </Link>
                      {isSafe && <span className="badge badge-safe">✅ 安心</span>}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 6 }}>
                      {product.ai_summary}
                    </p>
                    {contained.length > 0 && (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {contained.map(a => (
                          <span key={a.allergen_code} className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                            {ALLERGEN_EMOJI[a.allergen_code]} {a.allergen_code}
                          </span>
                        ))}
                      </div>
                    )}
                    {product.store && (
                      <Link href={`/shop/${product.store_id}`} style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'block', marginTop: 4 }}>
                        🧁 {product.store.store_name}
                      </Link>
                    )}
                  </div>
                  <button
                    className="btn btn-sm"
                    onClick={() => removeFavorite(product.id)}
                    title="安心リストから削除"
                    style={{ flexShrink: 0, background: 'transparent', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                  >
                    ❌
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
