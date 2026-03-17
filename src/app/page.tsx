'use client';

import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { ALL_ALLERGENS, MANDATORY_ALLERGENS, RECOMMENDED_ALLERGENS } from '@/lib/allergens';
import { PRODUCT_CATEGORIES, STORAGE_KEYS, APP_NAME } from '@/lib/constants';
import type { Product, AllergenProfile } from '@/lib/types';
import { getProducts } from '@/lib/supabase';

/** Allergen emoji mapping */
const ALLERGEN_EMOJI: Record<string, string> = {
  egg: '🥚', milk: '🥛', wheat: '🌾', buckwheat: '🍜', peanut: '🥜',
  shrimp: '🦐', crab: '🦀', walnut: '🌰', almond: '🌰', abalone: '🐚',
  squid: '🦑', salmon_roe: '🟠', orange: '🍊', cashew: '🥜', kiwi: '🥝',
  beef: '🥩', sesame: '⚪', salmon: '🐟', mackerel: '🐟', soybean: '🫘',
  chicken: '🍗', banana: '🍌', pork: '🥓', matsutake: '🍄', peach: '🍑',
  yam: '🍠', apple: '🍎', gelatin: '🫧',
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('');
  const [showAllAllergens, setShowAllAllergens] = useState(false);

  // Load profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ALLERGEN_PROFILE);
      if (saved) {
        const profile: AllergenProfile = JSON.parse(saved);
        setExcludedAllergens(profile.excludedAllergens);
      }
    } catch { /* ignore */ }
  }, []);

  // Fetch products
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getProducts({ excludedAllergens });
      setProducts(data);
      setLoading(false);
    };
    fetch();
  }, [excludedAllergens]);

  const toggleAllergen = (code: string) => {
    setExcludedAllergens(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const filteredProducts = useMemo(() => {
    if (!category) return products;
    return products; // In full impl, filter by category
  }, [products, category]);

  const displayAllergens = showAllAllergens ? ALL_ALLERGENS : MANDATORY_ALLERGENS;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo">
            <span className="navbar-logo-emoji">🍰</span>
            <span>{APP_NAME}</span>
          </Link>
          <div className="navbar-links">
            <Link href="/profile" className="navbar-link" id="nav-profile">プロフィール</Link>
            <Link href="/about" className="navbar-link" id="nav-about">About</Link>
            <Link href="/store" className="btn btn-sm btn-outline" id="nav-store">店舗の方へ</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title animate-fadeIn">
            アレルギーがあっても、<br />おいしいスイーツを。
          </h1>
          <p className="hero-description animate-fadeIn stagger-1">
            特定原材料等28品目に対応。お子さまのアレルギーに合わせて、<br />
            安心して食べられるスイーツを簡単に見つけられます。
          </p>
        </div>
      </section>

      {/* Search Section */}
      <main className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        {/* Allergen Filter */}
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>
              🛡️ 除外するアレルゲンを選択
            </h2>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setShowAllAllergens(!showAllAllergens)}
              id="toggle-allergens"
            >
              {showAllAllergens ? '主要8品目のみ' : '全28品目を表示'}
            </button>
          </div>

          {excludedAllergens.length > 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
              ✅ {excludedAllergens.length}品目を除外中
            </p>
          )}

          <div className="allergen-grid">
            {displayAllergens.map((allergen, i) => (
              <button
                key={allergen.code}
                className={`allergen-chip animate-fadeIn stagger-${Math.min(i % 5 + 1, 5)} ${excludedAllergens.includes(allergen.code) ? 'selected' : ''}`}
                onClick={() => toggleAllergen(allergen.code)}
                id={`allergen-${allergen.code}`}
                title={`${allergen.name}を${excludedAllergens.includes(allergen.code) ? '含める' : '除外する'}`}
              >
                <span className="allergen-chip-icon">{ALLERGEN_EMOJI[allergen.code] || '🔸'}</span>
                <span>{allergen.name}不使用</span>
              </button>
            ))}
          </div>

          {showAllAllergens && (
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>
              ※ 上段8品目は特定原材料（表示義務）、下段20品目は特定原材料に準ずるもの（表示推奨）
            </p>
          )}
        </section>

        {/* Category Filter */}
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${!category ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setCategory('')}
              id="category-all"
            >
              すべて
            </button>
            {PRODUCT_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                className={`btn btn-sm ${category === cat.value ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCategory(cat.value)}
                id={`category-${cat.value}`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Results */}
        {loading ? (
          <div className="product-grid">
            {[1,2,3,4].map(i => (
              <div key={i} className="product-card" style={{ pointerEvents: 'none' }}>
                <div className="skeleton" style={{ aspectRatio: '4/3' }} />
                <div className="card-body" style={{ padding: 'var(--space-md)' }}>
                  <div className="skeleton" style={{ height: 20, width: '80%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state animate-fadeInUp">
            <div className="empty-state-icon">🍰</div>
            <h3 className="empty-state-title">該当するスイーツが見つかりませんでした</h3>
            <p className="empty-state-desc">
              現在この条件のお店はありませんが、登録され次第LINEでお知らせします！
            </p>
            <Link href="/request" className="btn btn-primary" id="request-notification">
              📩 通知を受け取る
            </Link>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
              {filteredProducts.length}件のスイーツが見つかりました
            </p>
            <div className="product-grid">
              {filteredProducts.map((product, i) => (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className={`product-card animate-fadeIn stagger-${Math.min(i % 5 + 1, 5)}`}
                  id={`product-${product.id}`}
                >
                  <div className="product-card-image">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="product-card-placeholder">
                        <span className="product-card-placeholder-icon">🍰</span>
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="product-card-body">
                    <h3 className="product-card-name">{product.product_name}</h3>
                    <p className="product-card-store">{product.store?.store_name}</p>
                    {product.ai_summary && (
                      <p className="product-card-summary">{product.ai_summary}</p>
                    )}
                    <div className="product-card-allergens">
                      {product.allergens?.filter(a => a.is_free).map(a => (
                        <span key={a.allergen_code} className="badge badge-safe">
                          {ALLERGEN_EMOJI[a.allergen_code] || '✓'} {ALL_ALLERGENS.find(al => al.code === a.allergen_code)?.name}不使用
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-links">
            <Link href="/about" className="footer-link">このサービスについて</Link>
            <Link href="/terms" className="footer-link">利用規約</Link>
            <Link href="/privacy" className="footer-link">プライバシーポリシー</Link>
            <Link href="/disclaimer" className="footer-link">免責事項</Link>
            <Link href="/store" className="footer-link">店舗の方へ</Link>
          </div>
          <p className="footer-copy">&copy; 2026 {APP_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
