'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', icon: '🍰', label: 'ホーム' },
  { href: '/shops', icon: '🧁', label: 'お店' },
  { href: '/favorites', icon: '💾', label: '安心リスト' },
  { href: '/feedback', icon: '💬', label: 'ご意見' },
  { href: '/profile', icon: '👤', label: 'プロフィール' },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" aria-label="モバイルナビゲーション">
      <div className="mobile-bottom-nav-inner">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-nav-item ${pathname === item.href ? 'active' : ''}`}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
