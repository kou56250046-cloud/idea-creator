import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "イベントアイデア帳",
  description: "地域コミュニティのイベント企画書を管理・閲覧するサイト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <h1 className="text-lg font-bold leading-tight">イベントアイデア帳</h1>
              <p className="text-xs text-gray-500">地域コミュニティの企画書ライブラリ</p>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
