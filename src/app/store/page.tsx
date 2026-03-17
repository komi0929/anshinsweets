'use client';

import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export default function StoreLPPage() {
  return (
    <>
      {/* LP Navbar */}
      <nav className="navbar" style={{ background: 'rgba(26, 31, 54, 0.95)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="navbar-inner">
          <Link href="/" className="navbar-logo" style={{ color: 'white' }}>
            <span className="navbar-logo-emoji">🍰</span>
            <span>{APP_NAME}</span>
          </Link>
          <div className="navbar-links">
            <Link href="/store/login" className="btn btn-sm btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>
              ログイン
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="lp-hero">
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', padding: '0 var(--space-md)' }}>
          <p style={{ fontSize: '3.5rem', marginBottom: 'var(--space-lg)' }} className="animate-fadeIn">🏪</p>
          <h1 className="lp-hero-title animate-fadeIn stagger-1">
            あなたのスイーツを、<br />
            アレルギーに悩む親御さんへ届けませんか？
          </h1>
          <p className="lp-hero-subtitle animate-fadeIn stagger-2">
            {APP_NAME}は、アレルギー対応スイーツに特化した検索ポータル。<br />
            あなたのお店のこだわりスイーツを、本当に必要としている方へ届けます。
          </p>
          <Link href="/store/register" className="btn btn-cta animate-fadeInUp stagger-3" id="store-register-cta">
            📝 無料で店舗登録する
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: 'var(--space-3xl) 0' }}>
        <div className="container text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
          <h2 className="section-title">✨ 選ばれる3つの理由</h2>
          <p className="section-subtitle">すべて無料、運用の手間もゼロ。</p>
        </div>
        <div className="lp-features">
          <div className="lp-feature-card animate-fadeInUp stagger-1">
            <div className="lp-feature-icon">💰</div>
            <h3 className="lp-feature-title">完全無料</h3>
            <p className="lp-feature-desc">
              店舗登録、商品掲載、すべて無料です。初期費用も月額費用も一切かかりません。
              あなたのスイーツが見つかりやすくなるだけです。
            </p>
          </div>
          <div className="lp-feature-card animate-fadeInUp stagger-2">
            <div className="lp-feature-icon">⚡</div>
            <h3 className="lp-feature-title">運用コストゼロ</h3>
            <p className="lp-feature-desc">
              商品URLを貼るだけでAIが自動で紹介文を生成。
              日々の更新作業は不要です。必要なのは最初の登録だけ。
            </p>
          </div>
          <div className="lp-feature-card animate-fadeInUp stagger-3">
            <div className="lp-feature-icon">🎯</div>
            <h3 className="lp-feature-title">ターゲット集客</h3>
            <p className="lp-feature-desc">
              「アレルギー対応スイーツを探している」という明確なニーズを持つ
              ユーザーだけが訪れるため、高い購入率が期待できます。
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: 'var(--space-3xl) var(--space-md)', background: 'var(--color-bg-secondary)' }}>
        <div className="container text-center" style={{ marginBottom: 'var(--space-2xl)' }}>
          <h2 className="section-title">📋 簡単3ステップで登録完了</h2>
          <p className="section-subtitle">最短5分で始められます。</p>
        </div>

        <div className="steps">
          <div className="step animate-fadeInUp stagger-1">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>店舗アカウントを作成</h3>
              <p>メールアドレスと店舗名を入力するだけ。審査は不要です。</p>
            </div>
          </div>
          <div className="step animate-fadeInUp stagger-2">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>商品のURLを登録</h3>
              <p>ECサイトの商品URLを貼り付けるだけ。AIが自動で紹介文を生成します。</p>
            </div>
          </div>
          <div className="step animate-fadeInUp stagger-3">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>アレルギー情報を設定</h3>
              <p>対応する28品目にチェックを入れ、法的責任に同意するだけ。すぐに公開されます。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section style={{ padding: 'var(--space-3xl) var(--space-md)' }}>
        <div className="container container-narrow text-center">
          <h2 className="section-title">🛡️ 安全性へのこだわり</h2>
          <p className="section-subtitle" style={{ marginBottom: 'var(--space-xl)' }}>
            命に関わる情報だからこそ、すべて手動で管理します。
          </p>
          <div style={{
            background: 'var(--color-bg-card)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-xl)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'left',
          }}>
            <div style={{ display: 'grid', gap: 'var(--space-lg)' }}>
              {[
                { icon: '🤚', title: 'AIによるアレルギー判定は一切なし', desc: '28品目すべてを店舗オーナーが手動で設定。安全性を最優先します。' },
                { icon: '📝', title: '法的責任の明確化', desc: '各店舗がアレルギー表示に法的責任を持つことを同意の上で公開。責任の所在を明確にします。' },
                { icon: '🔗', title: '自動品質管理', desc: 'ECリンクの有効性を定期チェック。リンク切れは自動で非公開化し、品質を維持します。' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 4 }}>{item.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: 'var(--space-3xl) var(--space-md)',
        background: 'linear-gradient(135deg, var(--color-primary-50), #FFF5F0)',
        textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-md)' }}>
          今すぐ始めましょう 🚀
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-xl)' }}>
          完全無料で、あなたのスイーツを必要としている方へ届けましょう。
        </p>
        <Link href="/store/register" className="btn btn-cta btn-lg" id="store-register-cta-bottom">
          📝 無料で店舗登録する
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer" style={{ marginTop: 0 }}>
        <div className="footer-inner">
          <div className="footer-links">
            <Link href="/" className="footer-link">ユーザー向けサービス</Link>
            <Link href="/store/terms" className="footer-link">店舗利用規約</Link>
            <Link href="/store/tokushoho" className="footer-link">特定商取引法に基づく表記</Link>
          </div>
          <p className="footer-copy">&copy; 2026 {APP_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
