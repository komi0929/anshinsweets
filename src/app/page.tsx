'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ALL_ALLERGENS, MANDATORY_ALLERGENS, ALLERGEN_EMOJI } from '@/lib/allergens';
import { PRODUCT_CATEGORIES, STORAGE_KEYS, APP_NAME, REGIONS } from '@/lib/constants';
import type { Product } from '@/lib/types';
import { getProducts } from '@/lib/supabase';


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [myAllergens, setMyAllergens] = useState<string[]>([]);
  const [category, setCategory] = useState<string>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [prefecture, setPrefecture] = useState('');
  const [showAllAllergens, setShowAllAllergens] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [childProfiles, setChildProfiles] = useState<{id: string; childName: string; myAllergens: string[]}[]>([]);
  const [activeChildId, setActiveChildId] = useState('');
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Load favorites
  useEffect(() => {
    try {
      const saved = localStorage.getItem('anshin_favorites');
      if (saved) setFavorites(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  const toggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const updated = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem('anshin_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Load profile from localStorage
  useEffect(() => {
    try {
      const multiData = localStorage.getItem('anshin_child_profiles');
      if (multiData) {
        const profiles = JSON.parse(multiData);
        setChildProfiles(profiles);
        const activeId = localStorage.getItem('anshin_active_child') || profiles[0]?.id;
        setActiveChildId(activeId);
        const active = profiles.find((p: {id: string}) => p.id === activeId) || profiles[0];
        if (active) setMyAllergens(active.myAllergens || []);
      } else {
        const saved = localStorage.getItem(STORAGE_KEYS.ALLERGEN_PROFILE);
        if (saved) {
          const profile = JSON.parse(saved);
          setMyAllergens(profile.myAllergens || profile.excludedAllergens || []);
        } else {
          setIsFirstVisit(true);
        }
      }
    } catch { /* ignore */ }
  }, []);

  // Debounced search
  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => setSearch(value), 400);
  };

  // Fetch products (resets on filter/search/category change)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getProducts({ myAllergens, search, category, prefecture, offset: 0 });
      setProducts(result.products);
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
      setLoading(false);
    };
    fetchData();
  }, [myAllergens, search, category, prefecture]);

  // Load more (infinite scroll)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const result = await getProducts({
      myAllergens, search, category, prefecture, offset: products.length,
    });
    setProducts(prev => [...prev, ...result.products]);
    setHasMore(result.hasMore);
    setLoadingMore(false);
  }, [loadingMore, hasMore, myAllergens, search, category, prefecture, products.length]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  const toggleAllergen = (code: string) => {
    setMyAllergens(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const switchChild = (id: string) => {
    setActiveChildId(id);
    const child = childProfiles.find(p => p.id === id);
    if (child) {
      setMyAllergens(child.myAllergens);
      localStorage.setItem('anshin_active_child', id);
      // Also sync old format
      localStorage.setItem(STORAGE_KEYS.ALLERGEN_PROFILE, JSON.stringify({
        childName: child.childName, myAllergens: child.myAllergens, updatedAt: new Date().toISOString(),
      }));
    }
  };

  // No client-side filter needed — getProducts handles everything server-side

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
            <Link href="/shops" className="navbar-link" id="nav-shops">🧁 お店を探す</Link>
            <Link href="/favorites" className="navbar-link" id="nav-favorites">💾 安心リスト</Link>
            <Link href="/request" className="navbar-link" id="nav-alerts">🔔 通知</Link>
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
          <div className="animate-fadeInUp stagger-2" style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', marginTop: 'var(--space-md)' }}>
            <Link href="/shops" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--color-primary-dark)' }}>
              🧁 お店を探す
            </Link>
          </div>
        </div>
      </section>

      {/* Onboarding Banner (first visit) */}
      {isFirstVisit && myAllergens.length === 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #EFF6FF, #ECFDF5)',
          borderBottom: '1px solid var(--color-border-light)',
          padding: 'var(--space-lg) var(--space-md)',
        }}>
          <div className="container" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
            <p style={{ fontSize: '1.2rem', marginBottom: 'var(--space-sm)' }}>👋</p>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
              はじめまして！まずお子さまのアレルギーを教えてください
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-md)', lineHeight: 1.6 }}>
              下のアレルゲンを選択するだけで、安心して食べられるスイーツだけが表示されます。<br/>
              設定はいつでもプロフィールから変更できます。
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'center', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>❶ アレルギーを選択</span>
              <span>→</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>❷ 安全なスイーツが表示</span>
              <span>→</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>❸ ネット or お店で購入</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Section */}
      <main className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        {/* Allergen Filter */}
        <section style={{ marginBottom: 'var(--space-xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>
              🛡️ お子さまのアレルギーを選択
            </h2>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setShowAllAllergens(!showAllAllergens)}
              id="toggle-allergens"
            >
              {showAllAllergens ? '主要8品目のみ' : '全28品目を表示'}
            </button>
          </div>

          {/* Child Profile Switcher */}
          {childProfiles.length > 1 && (
            <div style={{
              display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)',
              flexWrap: 'wrap', alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginRight: 4 }}>👨‍👩‍👧‍👦</span>
              {childProfiles.map(p => (
                <button
                  key={p.id}
                  className={`btn btn-sm ${p.id === activeChildId ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => switchChild(p.id)}
                  style={{ fontSize: '0.8rem' }}
                >
                  {p.childName || '名前未設定'}
                </button>
              ))}
            </div>
          )}

          {myAllergens.length > 0 && (
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
              ✅ {childProfiles.find(p => p.id === activeChildId)?.childName || 'お子さま'}: {myAllergens.length}品目を除外中
            </p>
          )}

          <div className="allergen-grid">
            {displayAllergens.map((allergen, i) => (
              <button
                key={allergen.code}
                className={`allergen-chip animate-fadeIn stagger-${Math.min(i % 5 + 1, 5)} ${myAllergens.includes(allergen.code) ? 'selected' : ''}`}
                onClick={() => toggleAllergen(allergen.code)}
                id={`allergen-${allergen.code}`}
                title={`${allergen.name}アレルギーを${myAllergens.includes(allergen.code) ? '解除' : '設定'}`}
              >
                <span className="allergen-chip-icon">{ALLERGEN_EMOJI[allergen.code] || '🔸'}</span>
                <span>{allergen.name}</span>
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

        {/* Area Filter */}
        <section style={{ marginBottom: 'var(--space-md)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>📍 エリア</span>
            <select
              className="input-field"
              value={prefecture}
              onChange={e => setPrefecture(e.target.value)}
              style={{
                padding: '8px 12px', fontSize: '0.85rem',
                borderRadius: 'var(--radius-md)', minWidth: 160,
                flex: '0 1 auto',
              }}
              id="area-filter"
            >
              <option value="">すべてのエリア</option>
              {REGIONS.map(region => (
                <optgroup key={region.value} label={region.label}>
                  {region.prefectures.map(pref => (
                    <option key={pref} value={pref}>{pref}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            {prefecture && (
              <button
                onClick={() => setPrefecture('')}
                className="btn btn-sm btn-secondary"
                style={{ fontSize: '0.8rem' }}
              >
                ✕ 解除
              </button>
            )}
          </div>
        </section>

        {/* Search Bar */}
        <section style={{ marginBottom: 'var(--space-lg)' }}>
          <div style={{
            position: 'relative',
          }}>
            <span style={{
              position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
              fontSize: '1.1rem', pointerEvents: 'none',
            }}>🔍</span>
            <input
              className="input-field"
              type="text"
              placeholder="スイーツを検索..."
              value={searchInput}
              onChange={e => handleSearchInput(e.target.value)}
              style={{
                paddingLeft: 42, width: '100%',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.95rem',
              }}
              id="search-input"
            />
            {searchInput && (
              <button
                onClick={() => { setSearchInput(''); setSearch(''); }}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', fontSize: '1rem', cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                }}
              >✕</button>
            )}
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
        ) : products.length === 0 ? (
          <div className="empty-state animate-fadeInUp">
            <div className="empty-state-icon">🍰</div>
            <h3 className="empty-state-title">該当するスイーツが見つかりませんでした</h3>
            <p className="empty-state-desc">
              {search ? `「${search}」に一致する結果がありません。` : '現在この条件のお店はありませんが、登録され次第LINEでお知らせします！'}
            </p>
            {search ? (
              <button className="btn btn-secondary" onClick={() => { setSearchInput(''); setSearch(''); }}>検索をクリア</button>
            ) : (
              <Link href="/request" className="btn btn-primary" id="request-notification">📩 通知を受け取る</Link>
            )}
          </div>
        ) : (
          <>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-md)' }}>
              {totalCount}件のスイーツが見つかりました
              {search && <span>（「{search}」で検索）</span>}
            </p>
            <div className="product-grid">
              {products.map((product, i) => (
                <Link
                  href={`/product/${product.id}`}
                  key={product.id}
                  className={`product-card animate-fadeIn stagger-${Math.min(i % 5 + 1, 5)}`}
                  id={`product-${product.id}`}
                >
                  <div className="product-card-image" style={{ position: 'relative' }}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="product-card-placeholder">
                        <span className="product-card-placeholder-icon">🍰</span>
                        <span>No Image</span>
                      </div>
                    )}
                    <button
                      onClick={(e) => toggleFavorite(e, product.id)}
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 34, height: 34, borderRadius: '50%',
                        background: favorites.includes(product.id) ? '#FF6B6B' : 'rgba(255,255,255,0.9)',
                        color: favorites.includes(product.id) ? 'white' : '#ccc',
                        border: 'none', cursor: 'pointer', fontSize: '1.1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                        transition: 'all 0.2s ease',
                      }}
                      title={favorites.includes(product.id) ? '安心リストから削除' : '安心リストに追加'}
                    >
                      {favorites.includes(product.id) ? '♥' : '♡'}
                    </button>
                  </div>
                  <div className="product-card-body">
                    <h3 className="product-card-name">{product.product_name}</h3>
                    {product.store && (
                      <span
                        className="product-card-store"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.location.href = `/shop/${product.store!.id}`; }}
                        style={{ color: 'var(--color-primary)', textDecoration: 'underline', textUnderlineOffset: 2, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        🧁 {product.store.store_name}
                      </span>
                    )}
                    {product.ai_summary && (
                      <p className="product-card-summary">{product.ai_summary}</p>
                    )}
                    <div className="product-card-allergens">
                      {product.allergens && product.allergens.length > 0 ? (
                        product.allergens.map(a => (
                          <span key={a.allergen_code} className="badge badge-warning">
                            ⚠️ {ALL_ALLERGENS.find(al => al.code === a.allergen_code)?.name}含む
                          </span>
                        ))
                      ) : (
                        <span className="badge badge-safe">✅ アレルゲンフリー</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} style={{ padding: 'var(--space-xl) 0', textAlign: 'center' }}>
              {loadingMore && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-sm)', alignItems: 'center', color: 'var(--color-text-muted)' }}>
                  <span style={{ animation: 'pulse 1s infinite' }}>🍰</span>
                  <span style={{ fontSize: '0.85rem' }}>読み込み中...</span>
                </div>
              )}
              {!hasMore && products.length > 0 && (
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  すべての商品を表示しました（{totalCount}件）
                </p>
              )}
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
