import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export default function StoreTermsPage() {
  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/store" className="navbar-logo">
            <span className="navbar-logo-emoji">🍰</span>
            <span>{APP_NAME}</span>
          </Link>
          <div className="navbar-links">
            <Link href="/store" className="navbar-link">店舗トップ</Link>
          </div>
        </div>
      </nav>

      <div className="legal-page">
        <h1>店舗利用規約</h1>
        <p>最終更新日: 2026年3月18日</p>

        <h2>第1条（適用）</h2>
        <p>
          本店舗利用規約（以下「本規約」といいます）は、{APP_NAME}（以下「本サービス」といいます）に
          店舗として登録し商品情報を掲載する事業者（以下「店舗」といいます）と、
          本サービス運営者（以下「当社」といいます）との間の権利義務関係を定めるものです。
        </p>

        <h2>第2条（サービスの性質）</h2>
        <p>
          本サービスは、食物アレルギーを持つ消費者に対し、アレルギー対応スイーツの検索機能を
          提供する情報ポータルサービスです。本サービスはECプラットフォームではなく、
          商品の販売行為自体は行いません。本サービスは、店舗のEC等へユーザーを送客する役割を
          担います。
        </p>

        <h2>第3条（店舗の義務と責任 - 最重要条項）</h2>
        <div style={{
          background: 'var(--color-danger-bg)',
          border: '2px solid var(--color-danger)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-xl)',
          marginTop: 'var(--space-md)',
          marginBottom: 'var(--space-md)',
        }}>
          <p style={{ fontWeight: 700, color: 'var(--color-danger)' }}>
            ⚠️ アレルギー情報に関する法的責任
          </p>
        </div>
        <ol>
          <li>
            <strong>アレルギー情報の正確性保証</strong>：店舗は、本サービスに登録するアレルギー対応情報
            （特定原材料等28品目の使用・不使用情報）が正確かつ最新であることを保証するものとします。
          </li>
          <li>
            <strong>法的責任の負担</strong>：店舗が登録したアレルギー情報の誤りに起因して、
            消費者に健康被害（アレルギー反応、アナフィラキシーショック等を含むがこれに限定されない）
            が発生した場合、店舗がその損害について全責任を負うものとします。
          </li>
          <li>
            <strong>更新義務</strong>：商品の原材料や製造工程に変更が生じた場合、
            店舗は速やかに本サービス上のアレルギー情報を更新する義務を負います。
          </li>
          <li>
            <strong>手動確認の義務</strong>：本サービスのアレルギー情報登録は、
            AIによる自動判定を一切用いず、店舗が手動で行うものとします。
            店舗は、登録前に各品目の使用・不使用について十分に確認を行う義務を負います。
          </li>
        </ol>

        <h2>第4条（掲載内容）</h2>
        <ol>
          <li>店舗は、商品画像として実物の写真のみを使用するものとし、AI生成画像の使用を禁止します。</li>
          <li>商品のECサイトURLは正確で有効なものでなければなりません。</li>
          <li>当社は、掲載内容が不適切と判断した場合、事前の通知なく掲載を停止できます。</li>
        </ol>

        <h2>第5条（品質管理）</h2>
        <ol>
          <li>
            当社は、ECリンクの有効性を定期的にチェックし、リンク切れを検出した場合は
            自動的に商品を非公開にし、店舗に通知します。
          </li>
          <li>
            情報の最終確認日が180日以上経過した商品について、当社は店舗に更新を促す
            通知を送信します。店舗はこの通知に対し、速やかに情報を確認・更新してください。
          </li>
        </ol>

        <h2>第6条（料金）</h2>
        <p>
          本サービスの利用は完全無料です。店舗登録、商品掲載、アナリティクス機能の利用について、
          初期費用および月額費用は一切発生しません。
        </p>

        <h2>第7条（退会）</h2>
        <p>
          店舗は、いつでも本サービスから退会することができます。退会した場合、
          登録された商品情報は速やかに非公開となります。
        </p>

        <h2>第8条（免責事項）</h2>
        <p>
          当社は、本サービスの提供中断、データの消失、第三者による不正アクセス等に起因する
          損害について、故意または重過失がある場合を除き、責任を負いません。
        </p>

        <h2>第9条（準拠法・裁判管轄）</h2>
        <p>
          本規約の解釈にあたっては日本法を準拠法とします。
          本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-links">
            <Link href="/store" className="footer-link">店舗トップ</Link>
            <Link href="/store/tokushoho" className="footer-link">特定商取引法に基づく表記</Link>
          </div>
          <p className="footer-copy">&copy; 2026 {APP_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
