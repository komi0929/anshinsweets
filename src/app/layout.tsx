import type { Metadata, Viewport } from "next";
import ClientLayout from "@/components/ClientLayout";
import "./globals.css";

export const metadata: Metadata = {
  title: "あんしんスイーツ | アレルギー対応スイーツ検索ポータル",
  description: "アレルギーを持つ子どもの親を救う、アレルギー対応スイーツ特化ポータル。特定原材料等28品目に対応した安心・安全なスイーツが見つかります。",
  keywords: "アレルギー対応, スイーツ, 卵不使用, 乳不使用, 小麦不使用, グルテンフリー, 食物アレルギー",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "あんしんスイーツ",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "あんしんスイーツ | アレルギー対応スイーツ検索ポータル",
    description: "特定原材料等28品目に対応。お子さまのアレルギーに合わせて、安心して食べられるスイーツが見つかります。",
    type: "website",
    locale: "ja_JP",
    siteName: "あんしんスイーツ",
  },
  twitter: {
    card: "summary_large_image",
    title: "あんしんスイーツ",
    description: "アレルギー対応スイーツ検索ポータル",
  },
};

export const viewport: Viewport = {
  themeColor: "#E07A5F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('[SW] Registered:', reg.scope))
                    .catch(err => console.log('[SW] Registration failed:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
