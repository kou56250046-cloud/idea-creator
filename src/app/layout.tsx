import type { Metadata } from "next";
import Link from "next/link";
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "イベントアイデア帳",
  description: "地域コミュニティのイベント企画書ライブラリ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${cormorant.variable} ${notoSans.variable}`}>
      <body>
        {/* ── Header ─────────────────────────────────────────── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "var(--white)",
          borderBottom: "1px solid var(--cream-dark)",
        }}>
          <div style={{
            maxWidth: "1200px", margin: "0 auto",
            padding: "0 2rem", height: "68px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none", lineHeight: 1.3 }}>
              <span style={{
                display: "block",
                fontFamily: "var(--font-cormorant), 'Cormorant Garamond', serif",
                fontSize: "0.6rem", letterSpacing: "0.3em",
                color: "var(--text-muted)", textTransform: "uppercase",
              }}>
                Event Ideas Library
              </span>
              <span style={{
                display: "block",
                fontFamily: "var(--font-noto), 'Noto Sans JP', sans-serif",
                fontSize: "1.05rem", fontWeight: 500,
                color: "var(--navy)", letterSpacing: "0.06em",
              }}>
                イベントアイデア帳
              </span>
            </Link>

            {/* Nav */}
            <nav style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
              <Link href="/" className="nav-link">Archive</Link>
              <Link href="/generate" className="nav-link-gold">
                AI 生成
              </Link>
            </nav>
          </div>

          {/* Gold gradient rule */}
          <div style={{
            height: "2px",
            background: "linear-gradient(90deg, var(--navy) 0%, var(--navy-mid) 60%, var(--gold) 100%)",
          }} />
        </header>

        <main>{children}</main>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer style={{
          background: "var(--navy-deep)", color: "rgba(255,255,255,0.4)",
          textAlign: "center", padding: "2.5rem 1rem",
          marginTop: "6rem",
        }}>
          <p style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase",
          }}>
            Event Ideas Library &nbsp;—&nbsp; 2026
          </p>
        </footer>

        {/* ── Scroll Reveal Script ────────────────────────────── */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var io = new IntersectionObserver(function(entries) {
              entries.forEach(function(e) {
                if (e.isIntersecting) {
                  e.target.classList.add('revealed');
                  var rule = e.target.querySelector('.section-rule');
                  if (rule) rule.classList.add('visible');
                  io.unobserve(e.target);
                }
              });
            }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

            function scan() {
              document.querySelectorAll('[data-reveal]').forEach(function(el) {
                if (!el.dataset.watched) {
                  el.dataset.watched = '1';
                  io.observe(el);
                }
              });
              // Score bars
              document.querySelectorAll('.score-fill[data-score]').forEach(function(bar) {
                if (!bar.dataset.animated) {
                  bar.dataset.animated = '1';
                  var barObs = new IntersectionObserver(function(entries) {
                    entries.forEach(function(e) {
                      if (e.isIntersecting) {
                        var pct = (parseInt(e.target.dataset.score || '0') / 5 * 100) + '%';
                        e.target.style.width = pct;
                        barObs.unobserve(e.target);
                      }
                    });
                  }, { threshold: 0.5 });
                  barObs.observe(bar);
                }
              });
            }

            document.addEventListener('DOMContentLoaded', scan);
            var mo = new MutationObserver(scan);
            mo.observe(document.body, { childList: true, subtree: true });
            scan();
          })();
        ` }} />
      </body>
    </html>
  );
}
