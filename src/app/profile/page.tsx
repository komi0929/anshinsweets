'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ALL_ALLERGENS, MANDATORY_ALLERGENS, RECOMMENDED_ALLERGENS, ALLERGEN_EMOJI } from '@/lib/allergens';
import { STORAGE_KEYS, APP_NAME } from '@/lib/constants';

type ChildProfile = {
  id: string;
  childName: string;
  myAllergens: string[];
};

const PROFILES_KEY = 'anshin_child_profiles';
const ACTIVE_KEY = 'anshin_active_child';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function ProfilePage() {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [saved, setSaved] = useState(false);

  // Load profiles
  useEffect(() => {
    try {
      const data = localStorage.getItem(PROFILES_KEY);
      if (data) {
        const parsed: ChildProfile[] = JSON.parse(data);
        setProfiles(parsed);
        const savedActive = localStorage.getItem(ACTIVE_KEY);
        setActiveId(savedActive && parsed.find(p => p.id === savedActive) ? savedActive : parsed[0]?.id || '');
      } else {
        // Migrate from old single-profile format
        const old = localStorage.getItem(STORAGE_KEYS.ALLERGEN_PROFILE);
        if (old) {
          const p = JSON.parse(old);
          const migrated: ChildProfile = {
            id: generateId(),
            childName: p.childName || 'お子さま',
            myAllergens: p.myAllergens || p.excludedAllergens || [],
          };
          setProfiles([migrated]);
          setActiveId(migrated.id);
        }
      }
    } catch { /* ignore */ }
  }, []);

  const activeProfile = profiles.find(p => p.id === activeId);

  const saveAll = (updated: ChildProfile[], newActiveId?: string) => {
    setProfiles(updated);
    localStorage.setItem(PROFILES_KEY, JSON.stringify(updated));
    // Also save active profile in old format for compatibility with home page
    const active = updated.find(p => p.id === (newActiveId || activeId));
    if (active) {
      localStorage.setItem(STORAGE_KEYS.ALLERGEN_PROFILE, JSON.stringify({
        childName: active.childName,
        myAllergens: active.myAllergens,
        updatedAt: new Date().toISOString(),
      }));
      localStorage.setItem(ACTIVE_KEY, active.id);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const addChild = () => {
    const newChild: ChildProfile = { id: generateId(), childName: '', myAllergens: [] };
    const updated = [...profiles, newChild];
    setActiveId(newChild.id);
    saveAll(updated, newChild.id);
  };

  const removeChild = (id: string) => {
    if (profiles.length <= 1) return;
    const updated = profiles.filter(p => p.id !== id);
    const newActive = updated[0]?.id || '';
    setActiveId(newActive);
    saveAll(updated, newActive);
  };

  const updateName = (name: string) => {
    if (!activeProfile) return;
    const updated = profiles.map(p => p.id === activeId ? { ...p, childName: name } : p);
    setProfiles(updated);
  };

  const toggleAllergen = (code: string) => {
    if (!activeProfile) return;
    const updated = profiles.map(p => {
      if (p.id !== activeId) return p;
      return {
        ...p,
        myAllergens: p.myAllergens.includes(code)
          ? p.myAllergens.filter(c => c !== code)
          : [...p.myAllergens, code],
      };
    });
    setProfiles(updated);
  };

  const switchChild = (id: string) => {
    // Save current before switching
    saveAll(profiles, id);
    setActiveId(id);
  };

  const handleSave = () => saveAll(profiles);

  // If no profiles, show add button
  if (profiles.length === 0) {
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
        <main className="container container-narrow" style={{ padding: 'var(--space-3xl) var(--space-md)', textAlign: 'center' }}>
          <div className="animate-fadeInUp">
            <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>👶</div>
            <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>お子さまのアレルギーを登録</h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
              お子さまのアレルギー情報を設定すると、安全なスイーツだけが表示されます。
            </p>
            <button className="btn btn-primary btn-lg" onClick={addChild}>
              👶 お子さまを追加する
            </button>
          </div>
        </main>
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
            <Link href="/" className="navbar-link">ホーム</Link>
            <Link href="/favorites" className="navbar-link">💾 安心リスト</Link>
          </div>
        </div>
      </nav>

      <main className="container container-narrow" style={{ padding: 'var(--space-xl) var(--space-md)' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)' }} className="animate-fadeIn">
          👨‍👩‍👧‍👦 お子さまのプロフィール
        </h1>

        {/* Child Tabs */}
        <div style={{
          display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)',
          flexWrap: 'wrap', alignItems: 'center',
        }} className="animate-fadeIn stagger-1">
          {profiles.map(p => (
            <button
              key={p.id}
              className={`btn btn-sm ${p.id === activeId ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => switchChild(p.id)}
              style={{ position: 'relative' }}
            >
              👶 {p.childName || '名前未設定'}
              {p.myAllergens.length > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -6,
                  background: 'var(--color-danger)', color: 'white',
                  borderRadius: '50%', width: 18, height: 18, fontSize: '0.65rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700,
                }}>
                  {p.myAllergens.length}
                </span>
              )}
            </button>
          ))}
          <button
            className="btn btn-sm btn-secondary"
            onClick={addChild}
            style={{ borderStyle: 'dashed' }}
          >
            ＋ 追加
          </button>
        </div>

        {activeProfile && (
          <>
            {/* Child Name */}
            <div className="form-section animate-fadeIn stagger-2">
              <div className="input-group" style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'end' }}>
                <div style={{ flex: 1 }}>
                  <label className="input-label" htmlFor="child-name">おなまえ</label>
                  <input
                    id="child-name"
                    className="input-field"
                    type="text"
                    placeholder="例：たろう"
                    value={activeProfile.childName}
                    onChange={e => updateName(e.target.value)}
                  />
                </div>
                {profiles.length > 1 && (
                  <button
                    className="btn btn-sm"
                    onClick={() => { if (confirm(`${activeProfile.childName || 'このお子さま'}のプロフィールを削除しますか？`)) removeChild(activeId); }}
                    style={{ color: 'var(--color-danger)', background: 'transparent', border: '1px solid var(--color-danger)', flexShrink: 0 }}
                  >
                    🗑 削除
                  </button>
                )}
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>
              {activeProfile.childName || 'お子さま'}のアレルギーを選択してください。選択した品目を含む商品が除外されます。
            </p>

            {/* Mandatory */}
            <div className="form-section animate-fadeIn stagger-3">
              <h2 className="form-section-title">🔴 特定原材料 8品目</h2>
              <div className="allergen-grid">
                {MANDATORY_ALLERGENS.map(allergen => (
                  <button
                    key={allergen.code}
                    className={`allergen-chip ${activeProfile.myAllergens.includes(allergen.code) ? 'selected' : ''}`}
                    onClick={() => toggleAllergen(allergen.code)}
                    id={`profile-allergen-${allergen.code}`}
                  >
                    <span className="allergen-chip-icon">{ALLERGEN_EMOJI[allergen.code]}</span>
                    <span>{allergen.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommended */}
            <div className="form-section animate-fadeIn stagger-4">
              <h2 className="form-section-title">🟡 準特定原材料 20品目</h2>
              <div className="allergen-grid">
                {RECOMMENDED_ALLERGENS.map(allergen => (
                  <button
                    key={allergen.code}
                    className={`allergen-chip ${activeProfile.myAllergens.includes(allergen.code) ? 'selected' : ''}`}
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
            {activeProfile.myAllergens.length > 0 && (
              <div style={{
                background: 'var(--color-safe-bg)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-md)',
                marginBottom: 'var(--space-lg)',
              }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-safe)', fontWeight: 600 }}>
                  ✅ {activeProfile.childName || 'お子さま'}: {activeProfile.myAllergens.length}品目を除外中
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: 4 }}>
                  {activeProfile.myAllergens.map(code => ALL_ALLERGENS.find(a => a.code === code)?.name).filter(Boolean).join('、')}
                </p>
              </div>
            )}

            {/* Save */}
            <button className="btn btn-primary btn-full btn-lg" onClick={handleSave} id="save-profile">
              💾 プロフィールを保存
            </button>
          </>
        )}

        {saved && <div className="toast">✅ プロフィールを保存しました</div>}
      </main>
    </>
  );
}
