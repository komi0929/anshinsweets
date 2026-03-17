'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ALL_ALLERGENS, MANDATORY_ALLERGENS, RECOMMENDED_ALLERGENS } from '@/lib/allergens';
import { STORAGE_KEYS, APP_NAME } from '@/lib/constants';
import type { AllergenProfile } from '@/lib/types';

const ALLERGEN_EMOJI: Record<string, string> = {
  egg: '🥚', milk: '🥛', wheat: '🌾', buckwheat: '🍜', peanut: '🥜',
  shrimp: '🦐', crab: '🦀', walnut: '🌰', almond: '🌰', abalone: '🐚',
  squid: '🦑', salmon_roe: '🟠', orange: '🍊', cashew: '🥜', kiwi: '🥝',
  beef: '🥩', sesame: '⚪', salmon: '🐟', mackerel: '🐟', soybean: '🫘',
  chicken: '🍗', banana: '🍌', pork: '🥓', matsutake: '🍄', peach: '🍑',
  yam: '🍠', apple: '🍎', gelatin: '🫧',
};

export default function ProfilePage() {
  const [childName, setChildName] = useState('');
  const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALLERGEN_PROFILE);
      if (data) {
        const profile: AllergenProfile = JSON.parse(data);
        setChildName(profile.childName || '');
        setExcludedAllergens(profile.excludedAllergens);
      }
    } catch { /* ignore */ }
  }, []);

  const toggleAllergen = (code: string) => {
    setExcludedAllergens(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
    setSaved(false);
  };

  const handleSave = () => {
    const profile: AllergenProfile = {
      childName: childName || undefined,
      excludedAllergens,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.ALLERGEN_PROFILE, JSON.stringify(profile));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
            <Link href="/" className="navbar-link">ホーム</Link>
          </div>
        </div>
      </nav>

      <main className="container container-narrow" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }} className="animate-fadeIn">
          👶 お子さまのプロフィール
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }} className="animate-fadeIn stagger-1">
          アレルギーのある品目を設定すると、検索時に自動で除外されます。
        </p>

        {/* Child Name */}
        <div className="form-section animate-fadeIn stagger-2">
          <div className="input-group">
            <label className="input-label" htmlFor="child-name">お子さまのおなまえ（任意）</label>
            <input
              id="child-name"
              className="input-field"
              type="text"
              placeholder="例：たろう"
              value={childName}
              onChange={e => { setChildName(e.target.value); setSaved(false); }}
            />
          </div>
        </div>

        {/* Mandatory Allergens */}
        <div className="form-section animate-fadeIn stagger-3">
          <h2 className="form-section-title">
            🔴 特定原材料 8品目（表示義務）
          </h2>
          <div className="allergen-grid">
            {MANDATORY_ALLERGENS.map(allergen => (
              <button
                key={allergen.code}
                className={`allergen-chip ${excludedAllergens.includes(allergen.code) ? 'selected' : ''}`}
                onClick={() => toggleAllergen(allergen.code)}
                id={`profile-allergen-${allergen.code}`}
              >
                <span className="allergen-chip-icon">{ALLERGEN_EMOJI[allergen.code]}</span>
                <span>{allergen.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Allergens */}
        <div className="form-section animate-fadeIn stagger-4">
          <h2 className="form-section-title">
            🟡 特定原材料に準ずるもの 20品目（表示推奨）
          </h2>
          <div className="allergen-grid">
            {RECOMMENDED_ALLERGENS.map(allergen => (
              <button
                key={allergen.code}
                className={`allergen-chip ${excludedAllergens.includes(allergen.code) ? 'selected' : ''}`}
                onClick={() => toggleAllergen(allergen.code)}
                id={`profile-allergen-${allergen.code}`}
              >
                <span className="allergen-chip-icon">{ALLERGEN_EMOJI[allergen.code]}</span>
                <span>{allergen.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {excludedAllergens.length > 0 && (
          <div style={{
            background: 'var(--color-safe-bg)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
          }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-safe)', fontWeight: 600 }}>
              ✅ {excludedAllergens.length}品目を除外設定中:
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
              {excludedAllergens.map(code => ALL_ALLERGENS.find(a => a.code === code)?.name).filter(Boolean).join('、')}
            </p>
          </div>
        )}

        {/* Save Button */}
        <button
          className="btn btn-primary btn-full btn-lg"
          onClick={handleSave}
          id="save-profile"
        >
          💾 プロフィールを保存
        </button>

        {saved && (
          <div className="toast">✅ プロフィールを保存しました</div>
        )}
      </main>
    </>
  );
}
