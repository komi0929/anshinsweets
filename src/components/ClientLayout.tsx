'use client';

import dynamic from 'next/dynamic';

const MobileBottomNav = dynamic(() => import('@/components/MobileBottomNav'), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MobileBottomNav />
    </>
  );
}
