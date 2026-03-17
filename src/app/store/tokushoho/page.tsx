import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

export default function TokushohoPage() {
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
        <h1>特定商取引法に基づく表記</h1>
        <p>最終更新日: 2026年3月18日</p>

        <div style={{
          background: 'var(--color-info-bg)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md)',
          marginTop: 'var(--space-lg)',
          marginBottom: 'var(--space-xl)',
          fontSize: '0.85rem',
        }}>
          <p style={{ color: 'var(--color-info)' }}>
            ℹ️ {APP_NAME}は情報検索ポータルサービスであり、商品の販売は行いません。
            各商品のお取引に関する特定商取引法に基づく表記は、各店舗のECサイトにてご確認ください。
          </p>
        </div>

        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.9rem',
        }}>
          <tbody>
            {[
              ['正式名称', `${APP_NAME}（Allergy-Free Sweets Finder）`],
              ['サービス内容', 'アレルギー対応スイーツの情報検索・送客ポータルサービス'],
              ['運営責任者', '（運営者名を記載）'],
              ['所在地', '（所在地を記載）'],
              ['電話番号', '（電話番号を記載）'],
              ['メールアドレス', '（メールアドレスを記載）'],
              ['サービス料金', '無料（店舗登録・商品掲載ともに無料）'],
              ['お支払い方法', '該当なし（本サービスに課金は発生しません）'],
              ['返品・交換', '該当なし（商品の販売は各店舗が行います）'],
            ].map(([label, value], i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                <td style={{
                  padding: 'var(--space-md)',
                  fontWeight: 600,
                  width: '30%',
                  verticalAlign: 'top',
                  background: 'var(--color-bg-secondary)',
                }}>
                  {label}
                </td>
                <td style={{ padding: 'var(--space-md)', color: 'var(--color-text-secondary)' }}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-links">
            <Link href="/store" className="footer-link">店舗トップ</Link>
            <Link href="/store/terms" className="footer-link">店舗利用規約</Link>
          </div>
          <p className="footer-copy">&copy; 2026 {APP_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
