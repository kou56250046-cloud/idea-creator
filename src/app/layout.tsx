import type { Metadata } from "next";
import Link from "next/link";
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
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="text-2xl">🎉</span>
              <div>
                <p className="text-base font-bold leading-tight">イベントアイデア帳</p>
                <p className="text-xs text-gray-500 hidden sm:block">地域コミュニティの企画書ライブラリ</p>
              </div>
            </Link>

            <nav className="flex items-center gap-1">
              <Link
                href="/"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <span>📚</span>
                <span className="hidden sm:inline">一覧</span>
              </Link>
              <Link
                href="/generate"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <span>✨</span>
                <span>AI生成</span>
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
