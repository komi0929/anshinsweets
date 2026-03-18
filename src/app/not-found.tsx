import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '20px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🍰</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
        ページが見つかりません
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px' }}>
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/" style={{
          padding: '12px 24px', borderRadius: '10px', background: 'var(--primary)',
          color: 'white', fontWeight: 600, textDecoration: 'none',
        }}>
          🏠 トップに戻る
        </Link>
        <Link href="/store" style={{
          padding: '12px 24px', borderRadius: '10px', border: '2px solid var(--border-light)',
          color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none', background: 'white',
        }}>
          🏪 店舗の方はこちら
        </Link>
      </div>
    </div>
  );
}
