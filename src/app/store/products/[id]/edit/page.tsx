'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ALL_ALLERGENS, MANDATORY_ALLERGENS, RECOMMENDED_ALLERGENS } from '@/lib/allergens';
import { useStoreAuth } from '@/hooks/useStoreAuth';

type AllergenStatus = Record<string, boolean>;

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, authFetch } = useStoreAuth();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [productName, setProductName] = useState('');
  const [productUrl, setProductUrl] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [category, setCategory] = useState('other');
  const [isPublished, setIsPublished] = useState(true);
  const [allergenStatus, setAllergenStatus] = useState<AllergenStatus>({});
  const [allergenConsent, setAllergenConsent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load product data
  const loadProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const product = data.product;
      setProductName(product.product_name);
      setProductUrl(product.product_url);
      setAiSummary(product.ai_summary || '');
      setCategory(product.category || 'other');
      setIsPublished(product.is_published);
      setAllergenConsent(product.allergen_consent);

      // Set allergen status
      const status: AllergenStatus = {};
      ALL_ALLERGENS.forEach(a => { status[a.code] = false; });
      (product.allergens || []).forEach((a: { allergen_code: string; is_free: boolean }) => {
        status[a.allergen_code] = a.is_free;
      });
      setAllergenStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : '商品の読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/store/login');
      return;
    }
    if (isAuthenticated) {
      loadProduct();
    }
  }, [authLoading, isAuthenticated, router, loadProduct]);

  const toggleAllergen = (code: string) => {
    setAllergenStatus(prev => ({ ...prev, [code]: !prev[code] }));
  };

  const handleSave = async () => {
    if (!allergenConsent) {
      setError('アレルギー情報の法的責任に同意してください');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await authFetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({
          product_name: productName,
          product_url: productUrl,
          ai_summary: aiSummary,
          category,
          is_published: isPublished,
          allergens: allergenStatus,
          allergen_consent: allergenConsent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess('商品情報を更新しました');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : '更新に失敗しました');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('この商品を削除してもよろしいですか？この操作は取り消せません。')) return;

    try {
      const res = await authFetch(`/api/products/${productId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      router.push('/store/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '削除に失敗しました');
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>読み込み中...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{ background: 'white', borderBottom: '1px solid var(--border-light)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.25rem' }}>🍰</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>あんしんスイーツ 管理</span>
        </div>
        <button onClick={() => router.push('/store/dashboard')} style={{ color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
          ← ダッシュボード
        </button>
      </header>

      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>📝 商品情報の編集</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>商品情報やアレルギー対応状況を更新できます</p>

        {error && (
          <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: '8px', padding: '12px 16px', color: '#DC2626', marginBottom: '24px' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#D1FAE5', border: '1px solid #6EE7B7', borderRadius: '8px', padding: '12px 16px', color: '#059669', marginBottom: '24px' }}>
            ✅ {success}
          </div>
        )}

        {/* Basic Info */}
        <section style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '20px' }}>📦 基本情報</h2>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px' }}>商品名 *</label>
            <input type="text" value={productName} onChange={e => setProductName(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.95rem' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px' }}>商品URL（EC・販売ページ）*</label>
            <input type="url" value={productUrl} onChange={e => setProductUrl(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.95rem' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px' }}>AI生成キャッチコピー</label>
            <textarea value={aiSummary} onChange={e => setAiSummary(e.target.value)} rows={2}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.95rem', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: '6px' }}>カテゴリ</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <option value="cake">ケーキ</option>
                <option value="cookie">クッキー</option>
                <option value="chocolate">チョコレート</option>
                <option value="pudding">プリン・ゼリー</option>
                <option value="ice_cream">アイスクリーム</option>
                <option value="bread">パン</option>
                <option value="wagashi">和菓子</option>
                <option value="other">その他</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'end' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />
                <span>公開中</span>
              </label>
            </div>
          </div>
        </section>

        {/* Allergen Section */}
        <section style={{ background: 'white', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: '1px solid var(--border-light)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '12px' }}>🔵 アレルギー対応情報（手動設定必須）</h2>

          <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px' }}>
            <p style={{ fontWeight: 600, color: '#B45309', marginBottom: '4px' }}>⚠️ 重要: アレルギー情報のAI自動判定は行いません</p>
            <p style={{ fontSize: '0.875rem', color: '#92400E' }}>以下の各品目について「含まれていない（不使用）」品目にチェックを入れてください。チェックした品目は「不使用」としてユーザーに表示されます。<strong>誤った情報は生命に関わります。正確にチェックしてください。</strong></p>
          </div>

          {/* Mandatory */}
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#DC2626', marginBottom: '12px' }}>🔴 特定原材料 8品目（表示義務）</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px', marginBottom: '24px' }}>
            {MANDATORY_ALLERGENS.map(a => (
              <button key={a.code} onClick={() => toggleAllergen(a.code)}
                style={{
                  padding: '12px 8px', borderRadius: '10px', border: `2px solid ${allergenStatus[a.code] ? '#10B981' : '#E5E7EB'}`,
                  background: allergenStatus[a.code] ? '#D1FAE5' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{a.code === 'egg' ? '🥚' : a.code === 'milk' ? '🥛' : a.code === 'wheat' ? '🌾' : a.code === 'buckwheat' ? '☕' : a.code === 'peanut' ? '🥜' : a.code === 'shrimp' ? '🦐' : a.code === 'crab' ? '🦀' : '🌰'}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{a.name}</div>
                <div style={{ fontSize: '0.7rem', color: allergenStatus[a.code] ? '#059669' : '#9CA3AF', marginTop: '2px' }}>
                  {allergenStatus[a.code] ? '✅ 不使用' : '未設定'}
                </div>
              </button>
            ))}
          </div>

          {/* Recommended */}
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#D97706', marginBottom: '12px' }}>🟡 特定原材料に準ずるもの 20品目（表示推奨）</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '8px' }}>
            {RECOMMENDED_ALLERGENS.map(a => {
              const emojiMap: Record<string, string> = { almond: '🌰', abalone: '🐚', squid: '🦑', salmon_roe: '🔴', orange: '🍊', cashew: '🥜', kiwi: '🥝', beef: '🥩', sesame: '🫘', salmon: '🐟', mackerel: '🐟', soybean: '🫘', chicken: '🍗', banana: '🍌', pork: '🥓', matsutake: '🍄', peach: '🍑', yam: '🍠', apple: '🍎', gelatin: '🫧' };
              return (
                <button key={a.code} onClick={() => toggleAllergen(a.code)}
                  style={{
                    padding: '12px 8px', borderRadius: '10px', border: `2px solid ${allergenStatus[a.code] ? '#10B981' : '#E5E7EB'}`,
                    background: allergenStatus[a.code] ? '#D1FAE5' : 'white', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                  }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{emojiMap[a.code] || '🔶'}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: '0.7rem', color: allergenStatus[a.code] ? '#059669' : '#9CA3AF', marginTop: '2px' }}>
                    {allergenStatus[a.code] ? '✅ 不使用' : '未設定'}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Legal consent */}
        <section style={{ background: '#FFF7ED', border: '2px solid #FDBA74', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <label style={{ display: 'flex', gap: '12px', cursor: 'pointer', alignItems: 'flex-start' }}>
            <input type="checkbox" checked={allergenConsent} onChange={e => setAllergenConsent(e.target.checked)} style={{ marginTop: '4px', width: '20px', height: '20px' }} />
            <div>
              <p style={{ fontWeight: 700, color: '#C2410C', marginBottom: '4px' }}>⚖️ 法的責任に関する同意（必須）</p>
              <p style={{ fontSize: '0.875rem', color: '#9A3412' }}>上記のアレルギー表示内容が正確であることを確認し、当店がこのアレルギー表示に法的責任を持つことに同意します。内容に誤りがあった場合、消費者に対する責任は当店が負います。</p>
            </div>
          </label>
        </section>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={handleSave} disabled={saving || !allergenConsent}
            style={{
              flex: 1, padding: '14px', borderRadius: '10px', border: 'none', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              background: allergenConsent ? 'var(--primary)' : '#D1D5DB', color: 'white',
              opacity: saving ? 0.7 : 1,
            }}>
            {saving ? '保存中...' : '💾 変更を保存'}
          </button>

          <button onClick={handleDelete}
            style={{
              padding: '14px 24px', borderRadius: '10px', border: '2px solid #EF4444', background: 'white',
              color: '#EF4444', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem',
            }}>
            🗑️ 削除
          </button>
        </div>
      </main>
    </div>
  );
}
