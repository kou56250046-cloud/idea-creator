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
        {/* ─── Header ──────────────────────────────────────── */}
        <header className="site-header" style={{ position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{
            maxWidth: "1200px", margin: "0 auto",
            padding: "0 1.5rem", height: "60px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{
                width: "34px", height: "34px",
                background: "var(--navy)",
                borderRadius: "3px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1.1rem",
                flexShrink: 0,
              }}>
                🎉
              </div>
              <div>
                <p style={{
                  fontFamily: "var(--font-noto), sans-serif",
                  fontSize: "0.95rem", fontWeight: 700,
                  color: "var(--navy)", letterSpacing: "0.04em",
                  margin: 0, lineHeight: 1.2,
                }}>
                  イベントアイデア帳
                </p>
                <p style={{
                  fontSize: "0.58rem", letterSpacing: "0.2em",
                  color: "var(--text-muted)", textTransform: "uppercase",
                  margin: 0,
                }}>
                  Community Event Library
                </p>
              </div>
            </Link>

            {/* Nav */}
            <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
              <Link href="/" className="nav-link">Archive</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        {/* ─── Footer ──────────────────────────────────────── */}
        <footer style={{
          background: "var(--navy)", color: "rgba(255,255,255,0.4)",
          textAlign: "center", padding: "2.5rem 1rem", marginTop: "5rem",
        }}>
          <p style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "0.75rem", letterSpacing: "0.3em",
            textTransform: "uppercase",
          }}>
            Event Ideas Library &nbsp;—&nbsp; 2026
          </p>
        </footer>

        {/* ─── Scroll Reveal ───────────────────────────────── */}
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
            }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });

            function scan() {
              document.querySelectorAll('[data-reveal]').forEach(function(el) {
                if (!el.dataset.watched) {
                  el.dataset.watched = '1';
                  io.observe(el);
                }
              });
              document.querySelectorAll('.score-fill[data-score]').forEach(function(bar) {
                if (!bar.dataset.animated) {
                  bar.dataset.animated = '1';
                  var bo = new IntersectionObserver(function(ents) {
                    ents.forEach(function(e) {
                      if (e.isIntersecting) {
                        e.target.style.width = (parseInt(e.target.dataset.score||'0')/5*100)+'%';
                        bo.unobserve(e.target);
                      }
                    });
                  }, { threshold: 0.5 });
                  bo.observe(bar);
                }
              });
            }
            document.addEventListener('DOMContentLoaded', scan);
            new MutationObserver(scan).observe(document.body, { childList:true, subtree:true });
            scan();
          })();
        ` }} />
      </body>
    </html>
  );
}
