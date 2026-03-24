import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export default function PrivacyPage() {
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
            <Link href="/feedback" className="navbar-link">💬 ご意見</Link>
          </div>
        </div>
      </nav>

      <div className="legal-page">
        <h1>プライバシーポリシー</h1>
        <p>最終更新日: 2026年3月18日</p>

        <h2>1. 個人情報の取得</h2>
        <p>
          {APP_NAME}（以下「本サービス」）は、以下の個人情報を取得する場合があります。
        </p>
        <ul>
          <li>LINE連携時のLINEユーザーID</li>
          <li>アレルギープロフィール情報（除外品目設定）</li>
          <li>位置情報（周辺検索利用時、ユーザーの明示的な同意に基づく）</li>
          <li>通知リクエスト時のエリア情報</li>
          <li>店舗登録時のメールアドレス、店舗名、住所等</li>
        </ul>

        <h2>2. 利用目的</h2>
        <p>取得した個人情報は、以下の目的で利用します。</p>
        <ul>
          <li>アレルギー対応スイーツの検索・表示サービスの提供</li>
          <li>ユーザープロフィールに基づくパーソナライズされた検索結果の表示</li>
          <li>新規店舗登録時のLINE通知の送信</li>
          <li>サービスの改善及び新機能の開発</li>
          <li>利用状況の統計・分析（個人を特定しない形式）</li>
        </ul>

        <h2>3. 個人情報の第三者提供</h2>
        <p>
          当社は、法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供しません。
        </p>

        <h2>4. 個人情報の保管</h2>
        <p>
          アレルギープロフィール情報は、ユーザーの端末（localStorage）に保存され、
          サーバーには送信されません（LINE LIFF連携時を除く）。
          店舗情報は、適切なセキュリティ対策を施したデータベースに保管します。
        </p>

        <h2>5. Cookie・トラッキング</h2>
        <p>
          本サービスでは、サービスの改善を目的としてCookieを使用する場合があります。
          ユーザーはブラウザの設定によりCookieの受け入れを拒否できますが、
          一部の機能が利用できなくなる場合があります。
        </p>

        <h2>6. 個人情報の開示・訂正・削除</h2>
        <p>
          ユーザーは、自己の個人情報について、開示・訂正・削除を請求することができます。
          お問い合わせは、本サービス内のお問い合わせ機能よりご連絡ください。
        </p>

        <h2>7. プライバシーポリシーの変更</h2>
        <p>
          本ポリシーの内容は、法令の変更等により、ユーザーに通知することなく変更されることがあります。
          変更後のプライバシーポリシーは、本ページに掲載された時点から効力を生じるものとします。
        </p>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-links">
            <Link href="/" className="footer-link">ホーム</Link>
            <Link href="/terms" className="footer-link">利用規約</Link>
            <Link href="/disclaimer" className="footer-link">免責事項</Link>
          </div>
          <p className="footer-copy">&copy; 2026 {APP_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
