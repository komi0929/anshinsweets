'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getStoreProducts } from '@/lib/supabase';
import { APP_NAME } from '@/lib/constants';
import type { Product } from '@/lib/types';

export default function StoreDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getStoreProducts('00000001-0000-0000-0000-000000000001');
      setProducts(data);
      setLoading(false);
    };
    load();
  }, []);

  const storeId = '00000001-0000-0000-0000-000000000001'; // Demo
  const [copied, setCopied] = useState(false);
  const handleCopyUrl = () => {
    const url = `${window.location.origin}/shop/${storeId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const publishedCount = products.filter(p => p.is_published).length;
  const totalClicks = 142; // Demo data

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/store/dashboard" className="navbar-logo">
            <span className="navbar-logo-emoji">🍰</span>
            <span>{APP_NAME} 管理</span>
          </Link>
          <div className="navbar-links">
            <Link href="/store/settings" className="navbar-link">店舗設定</Link>
            <Link href="/store/products/new" className="btn btn-sm btn-primary" id="add-product">+ 商品追加</Link>
          </div>
        </div>
      </nav>

      <main className="container" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        {/* Welcome */}
        <div className="animate-fadeIn" style={{ marginBottom: 'var(--space-xl)' }}>
          <h1 style={{ fontSize: '1.4rem', marginBottom: 4 }}>
            おかえりなさい、パティスリー・ソレイユ さん 👋
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            ダッシュボード
          </p>
        </div>

        {/* Stats */}
        <div className="dashboard-grid animate-fadeInUp stagger-1" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="stat-card">
            <p className="stat-card-label">公開中の商品</p>
            <p className="stat-card-value">
              {publishedCount}<span className="stat-card-unit">件</span>
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-card-label">EC送客数（今月）</p>
            <p className="stat-card-value">
              {totalClicks}<span className="stat-card-unit">クリック</span>
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-card-label">登録商品数</p>
            <p className="stat-card-value">
              {products.length}<span className="stat-card-unit">件</span>
            </p>
          </div>
        </div>

        {/* Store Page Link */}
        <div className="card animate-fadeInUp stagger-2" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: 'var(--space-md) var(--space-lg)', marginBottom: 'var(--space-xl)',
          background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)',
        }}>
          <div>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>🌐 お店のページ</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ユーザーに公開されているページを確認・共有</p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexShrink: 0 }}>
            <Link href={`/shop/${storeId}`} className="btn btn-sm btn-primary" target="_blank">
              👁️ ページを見る
            </Link>
            <button className="btn btn-sm btn-secondary" onClick={handleCopyUrl}>
              {copied ? '✅ コピー済み' : '🔗 URLコピー'}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div style={{
          background: 'var(--color-warning-bg)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          marginBottom: 'var(--space-xl)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-sm)',
        }} className="animate-fadeIn stagger-2">
          <span style={{ fontSize: '1.2rem' }}>⚠️</span>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 4 }}>
              1件の商品の情報が古くなっています
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
              「オーツミルクのティラミス」の情報が半年以上更新されていません。
              ワンタップで最新に更新できます。
            </p>
          </div>
        </div>

        {/* Product List */}
        <div className="form-section animate-fadeInUp stagger-3">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
            <h2 className="form-section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
              📦 登録商品一覧
            </h2>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              {[1,2].map(i => (
                <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 'var(--space-md)' }}>
              {products.map(product => {
                const containedAllergens = product.allergens || [];
                return (
                  <div key={product.id} className="card" style={{ display: 'flex', gap: 'var(--space-md)', padding: 'var(--space-md)', cursor: 'auto' }}>
                    {/* Thumbnail */}
                    <div style={{
                      width: 80,
                      height: 80,
                      borderRadius: 'var(--radius-md)',
                      background: 'linear-gradient(135deg, var(--color-primary-50), var(--color-bg-secondary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '2rem',
                    }}>
                      🍰
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 4 }}>
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{product.product_name}</h3>
                        <span className={`badge ${product.is_published ? 'badge-safe' : 'badge-warning'}`}>
                          {product.is_published ? '公開中' : '非公開'}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>
                        {product.ai_summary}
                      </p>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {containedAllergens.length > 0 ? (
                          <>
                            {containedAllergens.slice(0, 4).map(a => (
                              <span key={a.allergen_code} className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                                ⚠️ {a.allergen_code}含む
                              </span>
                            ))}
                            {containedAllergens.length > 4 && (
                              <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                                +{containedAllergens.length - 4}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="badge badge-safe" style={{ fontSize: '0.7rem' }}>✅ アレルゲンフリー</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)', flexShrink: 0 }}>
                      <Link href={`/store/products/${product.id}/edit`} className="btn btn-sm btn-secondary">
                        編集
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
