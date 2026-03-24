import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export default function TermsPage() {
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
        <h1>利用規約</h1>
        <p>最終更新日: 2026年3月18日</p>

        <h2>第1条（適用）</h2>
        <p>
          本利用規約（以下「本規約」といいます）は、{APP_NAME}（以下「本サービス」といいます）の
          利用にあたり、ユーザーと本サービス運営者（以下「当社」といいます）との間の権利義務関係を定めるものです。
          本サービスを利用されるすべてのユーザーに適用されます。
        </p>

        <h2>第2条（定義）</h2>
        <ol>
          <li>「ユーザー」とは、本サービスを利用するすべての個人をいいます。</li>
          <li>「店舗」とは、本サービスに商品情報を掲載する事業者をいいます。</li>
          <li>「コンテンツ」とは、本サービスに掲載される文章、画像、その他の情報をいいます。</li>
        </ol>

        <h2>第3条（サービスの内容）</h2>
        <p>
          本サービスは、食物アレルギーを持つ方向けに、アレルギー対応スイーツの情報を集約・提供する
          情報検索ポータルです。本サービスは商品の販売を行うものではなく、
          店舗のEC（電子商取引）サイトへの誘導（送客）を行う情報提供サービスです。
        </p>

        <h2>第4条（アレルギー情報に関する重要事項）</h2>
        <p>
          <strong>本サービスに掲載されるアレルギー情報は、各店舗が自己の責任において登録した情報です。</strong>
          当社は、掲載されたアレルギー情報の正確性、完全性、最新性について保証するものではありません。
        </p>
        <p>
          ユーザーは、商品購入前に必ず遷移先のEC・店舗において、
          最新のアレルギー成分情報を直接確認してください。
        </p>

        <h2>第5条（禁止事項）</h2>
        <p>ユーザーは、以下の行為を行ってはなりません。</p>
        <ol>
          <li>法令または公序良俗に違反する行為</li>
          <li>本サービスの運営を妨害する行為</li>
          <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
          <li>本サービスを不正の目的で利用する行為</li>
          <li>本サービスの他のユーザーの利用に支障を与える行為</li>
        </ol>

        <h2>第6条（免責事項）</h2>
        <p>
          当社は、本サービスに掲載された情報に起因してユーザーに生じた損害について、
          いかなる場合も責任を負いません。特に、アレルギー反応に関する事故については、
          当社は一切の責任を負わないものとします。
        </p>

        <h2>第7条（サービスの変更・中断・終了）</h2>
        <p>
          当社は、ユーザーに事前に通知することなく、本サービスの内容を変更し、
          または本サービスの提供を中断もしくは終了することができるものとします。
        </p>

        <h2>第8条（準拠法・裁判管轄）</h2>
        <p>
          本規約の解釈にあたっては日本法を準拠法とします。
          本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-links">
            <Link href="/" className="footer-link">ホーム</Link>
            <Link href="/privacy" className="footer-link">プライバシーポリシー</Link>
            <Link href="/disclaimer" className="footer-link">免責事項</Link>
          </div>
          <p className="footer-copy">&copy; 2026 {APP_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
