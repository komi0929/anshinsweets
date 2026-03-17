import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export default function DisclaimerPage() {
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

      <div className="legal-page">
        <h1>免責事項（アレルギー情報に関する重要なお知らせ）</h1>
        <p>最終更新日: 2026年3月18日</p>

        <div style={{
          background: 'var(--color-danger-bg)',
          border: '2px solid var(--color-danger)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-xl)',
          marginBottom: 'var(--space-xl)',
          marginTop: 'var(--space-lg)',
        }}>
          <h2 style={{ color: 'var(--color-danger)', fontSize: '1.1rem', marginTop: 0 }}>
            ⚠️ 最重要：アレルギー成分の最終確認について
          </h2>
          <p style={{ fontWeight: 600 }}>
            本サービスに掲載されているアレルギー情報は、あくまで参考情報です。<br />
            商品のご購入・お召し上がりの前に、必ず遷移先のEC・店舗において、
            最新のアレルギー成分情報を直接ご確認ください。
          </p>
        </div>

        <h2>1. アレルギー情報の正確性について</h2>
        <p>
          本サービスに掲載されるアレルギー対応情報（特定原材料等28品目の使用・不使用情報）は、
          各店舗が自己の責任において登録・管理する情報です。
          {APP_NAME}運営者（以下「当社」）は、これらの情報の正確性、完全性、最新性について
          一切保証するものではありません。
        </p>

        <h2>2. 当社の免責範囲</h2>
        <p>以下の事由により生じた損害について、当社は一切の責任を負いません。</p>
        <ol>
          <li>
            <strong>アレルギー反応に起因する損害</strong>：
            本サービスの情報を参考にして購入した商品によるアレルギー反応、
            アナフィラキシーショック、その他の健康被害
          </li>
          <li>
            <strong>情報の不一致</strong>：
            本サービスに掲載された情報と、実際の商品の原材料が異なっていた場合の損害
          </li>
          <li>
            <strong>店舗側の変更</strong>：
            店舗が原材料や製造工程を変更したにもかかわらず、
            本サービス上の情報が更新されていなかった場合の損害
          </li>
          <li>
            <strong>コンタミネーション（混入）</strong>：
            製造工程における他のアレルゲンの意図せぬ混入による損害
          </li>
        </ol>

        <h2>3. ユーザーの自己責任</h2>
        <p>
          ユーザーは、本サービスがアレルギー対応スイーツに関する「情報提供のみ」を目的とした
          サービスであることを理解し、商品の購入・摂取にあたっては、
          必ず以下の確認を自己の責任において行うものとします。
        </p>
        <ol>
          <li>遷移先のEC・店舗における最新の原材料表示の確認</li>
          <li>不明点がある場合の店舗への直接問い合わせ</li>
          <li>主治医・アレルギー専門医への相談</li>
        </ol>

        <h2>4. 情報の更新・品質管理</h2>
        <p>
          当社は、掲載情報の品質を維持するため、以下の取り組みを行っておりますが、
          これらの取り組みは完全性を保証するものではありません。
        </p>
        <ul>
          <li>店舗によるアレルギー情報の手動登録（AI自動判定は不使用）</li>
          <li>店舗のアレルギー表示に対する法的責任の同意取得</li>
          <li>ECリンクの定期的な有効性チェック（週1回）</li>
          <li>情報鮮度の管理（半年経過時の更新催促）</li>
        </ul>

        <h2>5. 外部リンクについて</h2>
        <p>
          本サービスには、店舗のECサイトなどの外部リンクが含まれています。
          これらの外部サイトの内容・安全性について、当社は一切の責任を負いません。
        </p>

        <h2>6. お問い合わせ</h2>
        <p>
          本免責事項に関するお問い合わせは、本サービス内のお問い合わせ機能よりご連絡ください。
        </p>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-links">
            <Link href="/" className="footer-link">ホーム</Link>
            <Link href="/terms" className="footer-link">利用規約</Link>
            <Link href="/privacy" className="footer-link">プライバシーポリシー</Link>
          </div>
          <p className="footer-copy">&copy; 2026 {APP_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
