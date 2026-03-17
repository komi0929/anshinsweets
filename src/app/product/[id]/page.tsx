'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getProductById } from '@/lib/supabase';
import { ALL_ALLERGENS } from '@/lib/allergens';
import { FRESHNESS_WARNING_DAYS, APP_NAME } from '@/lib/constants';
import type { Product } from '@/lib/types';

const ALLERGEN_EMOJI: Record<string, string> = {
  egg: '🥚', milk: '🥛', wheat: '🌾', buckwheat: '🍜', peanut: '🥜',
  shrimp: '🦐', crab: '🦀', walnut: '🌰', almond: '🌰', abalone: '🐚',
  squid: '🦑', salmon_roe: '🟠', orange: '🍊', cashew: '🥜', kiwi: '🥝',
  beef: '🥩', sesame: '⚪', salmon: '🐟', mackerel: '🐟', soybean: '🫘',
  chicken: '🍗', banana: '🍌', pork: '🥓', matsutake: '🍄', peach: '🍑',
  yam: '🍠', apple: '🍎', gelatin: '🫧',
};

function daysSince(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getProductById(params.id as string);
      setProduct(data);
      setLoading(false);
    };
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="teaser">
        <div className="teaser-image">
          <div className="skeleton" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="teaser-content">
          <div>
            <div className="skeleton" style={{ height: 28, width: '70%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 16, width: '40%', marginBottom: 16 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 28, width: 80, borderRadius: 999 }} />)}
            </div>
          </div>
          <div className="skeleton" style={{ height: 56, borderRadius: 16, marginTop: 'auto' }} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-state" style={{ height: '100dvh' }}>
        <div className="empty-state-icon">🔍</div>
        <h3 className="empty-state-title">商品が見つかりませんでした</h3>
        <Link href="/" className="btn btn-primary">トップへ戻る</Link>
      </div>
    );
  }

  const freeAllergens = product.allergens?.filter(a => a.is_free) || [];
  const days = daysSince(product.last_confirmed_at);
  const isStale = days > FRESHNESS_WARNING_DAYS;
  const confirmedDate = new Date(product.last_confirmed_at).toLocaleDateString('ja-JP');

  return (
    <div className="teaser">
      {/* Image Area (38%) */}
      <div className="teaser-image">
        <Link href="/" className="teaser-back" id="back-button">←</Link>
        {product.image_url ? (
          <img src={product.image_url} alt={product.product_name} />
        ) : (
          <div className="no-image" style={{ width: '100%', height: '100%' }}>
            <span className="no-image-icon">🍰</span>
            <span>No Image</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="teaser-content">
        {/* Header */}
        <div className="teaser-header animate-fadeIn">
          <h1 className="teaser-product-name">{product.product_name}</h1>
          <p className="teaser-store-name">🏪 {product.store?.store_name}</p>
        </div>

        {/* Allergen Tags */}
        <div className="teaser-allergens animate-fadeIn stagger-1">
          {freeAllergens.map(a => {
            const info = ALL_ALLERGENS.find(al => al.code === a.allergen_code);
            return (
              <span key={a.allergen_code} className="badge badge-safe">
                {ALLERGEN_EMOJI[a.allergen_code] || '✓'} {info?.name}不使用
              </span>
            );
          })}
        </div>

        {/* AI Summary */}
        {product.ai_summary && (
          <p className="teaser-summary animate-fadeIn stagger-2">
            {product.ai_summary}
          </p>
        )}

        {/* Freshness */}
        <div className="teaser-freshness animate-fadeIn stagger-3">
          {isStale ? (
            <span className="badge badge-warning">⚠ 情報は半年以上前のものです</span>
          ) : (
            <span>📅 最終確認日: {confirmedDate}</span>
          )}
        </div>

        {/* CTA Button */}
        <div className="teaser-cta animate-fadeInUp stagger-4">
          <a
            href={product.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-cta btn-full"
            id="cta-buy"
          >
            🛒 詳細な成分表・購入はこちら →
          </a>
          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-sm)' }}>
            ※ 最終的なアレルギー成分の確認は、必ず遷移先のEC・店舗で行ってください
          </p>
        </div>
      </div>
    </div>
  );
}
