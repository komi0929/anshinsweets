import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "あんしんスイーツ | アレルギー対応スイーツ検索ポータル",
  description: "アレルギーを持つ子どもの親を救う、アレルギー対応スイーツ特化ポータル。特定原材料等28品目に対応した安心・安全なスイーツが見つかります。",
  keywords: "アレルギー対応, スイーツ, 卵不使用, 乳不使用, 小麦不使用, グルテンフリー, 食物アレルギー",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
