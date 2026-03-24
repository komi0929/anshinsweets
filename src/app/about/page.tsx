'use client';

import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export default function AboutPage() {
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
            <Link href="/shops" className="navbar-link">🧁 お店を探す</Link>
            <Link href="/profile" className="navbar-link">プロフィール</Link>
            <Link href="/feedback" className="navbar-link">💬 ご意見</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #FEF2F1 0%, #FFF5F0 40%, #F0FBF8 100%)',
        padding: 'var(--space-3xl) var(--space-md)',
        textAlign: 'center',
      }}>
        <div className="container container-narrow animate-fadeIn">
          <p style={{ fontSize: '3rem', marginBottom: 'var(--space-md)' }}>💝</p>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 'var(--space-md)', color: 'var(--color-primary-dark)' }}>
            すべての子どもに、<br />おいしい笑顔を。
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
            {APP_NAME}は、食物アレルギーを持つ子どもの親御さんのために生まれた<br />
            アレルギー対応スイーツ専門の検索ポータルです。
          </p>
        </div>
      </section>

      <main className="container container-narrow" style={{ padding: 'var(--space-3xl) var(--space-md)' }}>
        {/* Story */}
        <section style={{ marginBottom: 'var(--space-3xl)' }} className="animate-fadeInUp">
          <h2 className="section-title">🌱 このサービスが生まれた理由</h2>
          <div style={{
            background: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-xl)',
            boxShadow: 'var(--shadow-md)',
            borderLeft: '4px solid var(--color-primary)',
            lineHeight: 2,
            fontSize: '0.95rem',
            color: 'var(--color-text-secondary)',
          }}>
            <p style={{ marginBottom: 'var(--space-md)' }}>
              「この子にも、お友達と同じようにケーキを食べさせてあげたい」
            </p>
            <p style={{ marginBottom: 'var(--space-md)' }}>
              食物アレルギーを持つ子どもの親御さんは、毎日の食事選びに大きな負担を抱えています。
              スイーツを選ぶときも、原材料表示を何度も確認し、店舗に問い合わせ、
              それでも不安が残る…。そんな経験をされている方は少なくありません。
            </p>
            <p style={{ marginBottom: 'var(--space-md)' }}>
              {APP_NAME}は、そんな親御さんの負担を少しでも軽くしたいという思いから生まれました。
              特定原材料等28品目に完全対応し、お子さまのアレルギーに該当する食材を選ぶだけで、
              それを含まない安心して食べられるスイーツが簡単に見つかります。
            </p>
            <p>
              すべての子どもが、笑顔でスイーツを楽しめる社会を目指して。
            </p>
          </div>
        </section>

        {/* Features */}
        <section style={{ marginBottom: 'var(--space-3xl)' }} className="animate-fadeInUp stagger-2">
          <h2 className="section-title">✨ {APP_NAME}の特徴</h2>
          <div style={{ display: 'grid', gap: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
            {[
              { icon: '🛡️', title: '安全性の徹底', desc: 'アレルギー情報はすべて店舗が手動で登録・確認。AIによる自動判定は一切行いません。命に関わる情報だからこそ、人の目で確認しています。' },
              { icon: '🔍', title: '28品目完全対応', desc: '食品表示法に基づく特定原材料8品目＋準ずるもの20品目すべてに対応。お子さまのアレルギーに合わせた精密な検索が可能です。' },
              { icon: '📱', title: 'シンプルな使いやすさ', desc: 'お子さまのアレルギーを選ぶだけ。それを含む商品は自動で除外され、安全なスイーツだけが表示されます。お店のミニページでメニュー確認→MAP表示までワンストップ。' },
              { icon: '🧁', title: '店舗との信頼関係', desc: '掲載店舗はすべてアレルギー表示に法的責任を持つことに同意しています。安心してお買い物いただけます。' },
            ].map((feature, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 'var(--space-md)',
                padding: 'var(--space-lg)',
                background: 'var(--color-bg-card)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--color-border-light)',
              }}>
                <span style={{ fontSize: '2rem', flexShrink: 0 }}>{feature.icon}</span>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 4 }}>{feature.title}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Safety Notice */}
        <section className="animate-fadeInUp stagger-3">
          <div style={{
            background: 'var(--color-info-bg)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-xl)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>⚠️</p>
            <h3 style={{ fontSize: '1rem', marginBottom: 'var(--space-sm)' }}>大切なお願い</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>
              {APP_NAME}は、アレルギー対応スイーツを見つけるための情報提供サービスです。
              最終的なアレルギー成分の確認は、必ず遷移先のEC・店舗で行ってください。
              万が一の事故を防ぐため、ご購入前に必ず原材料表示をご確認ください。
            </p>
          </div>
        </section>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
          <Link href="/" className="btn btn-primary btn-lg" id="about-cta">
            🔍 スイーツを探す
          </Link>
        </div>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-links">
            <Link href="/" className="footer-link">ホーム</Link>
            <Link href="/terms" className="footer-link">利用規約</Link>
            <Link href="/privacy" className="footer-link">プライバシーポリシー</Link>
            <Link href="/disclaimer" className="footer-link">免責事項</Link>
          </div>
          <p className="footer-copy">&copy; 2026 {APP_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
