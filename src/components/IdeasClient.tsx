"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import type { IdeaSummary } from "@/lib/ideas";
import { SEASON_COLORS, SETTING_ICONS } from "@/lib/constants";

const SEASONS = ["全て", "春", "夏", "秋", "冬", "通年"] as const;

const SEASON_EMOJI: Record<string, string> = {
  全て: "◆", 春: "🌸", 夏: "🌊", 秋: "🍂", 冬: "❄", 通年: "◎",
};

const SEASON_EN: Record<string, string> = {
  全て: "All", 春: "Spring", 夏: "Summer", 秋: "Autumn", 冬: "Winter", 通年: "Year-round",
};

const SEASON_TAG_STYLE: Record<string, React.CSSProperties> = {
  春: { background: "#FBF0F5", color: "#C45A84", border: "1px solid #F0C8DA" },
  夏: { background: "#EEF5FB", color: "#2A6EA6", border: "1px solid #C8DDF0" },
  秋: { background: "#FBF5EE", color: "#A65A2A", border: "1px solid #F0D8C8" },
  冬: { background: "#EEF0FB", color: "#2A3A9A", border: "1px solid #C8CEF0" },
  通年: { background: "#EEF8F0", color: "#2A8A4A", border: "1px solid #C8E8D0" },
};

function IdeasContent({ initialIdeas }: { initialIdeas: IdeaSummary[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentSeason = searchParams.get("season") ?? "全て";

  const filtered =
    currentSeason !== "全て"
      ? initialIdeas.filter((i) => i.season === currentSeason)
      : initialIdeas;

  const handleSeason = (season: string) => {
    season === "全て"
      ? router.push(pathname)
      : router.push(`${pathname}?season=${encodeURIComponent(season)}`);
  };

  return (
    <>
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="hero-bg" style={{
        minHeight: "480px", display: "flex", alignItems: "center",
        padding: "5rem 2rem", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative vertical gold line */}
        <div style={{
          position: "absolute", left: "calc(50% - 600px + 48px)",
          top: 0, bottom: 0, width: "1px",
          background: "linear-gradient(180deg, transparent, rgba(184,150,90,0.4) 30%, rgba(184,150,90,0.4) 70%, transparent)",
        }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
          <p className="animate-hero-label" style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "0.7rem", letterSpacing: "0.5em",
            color: "rgba(184,150,90,0.9)", textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}>
            Community Event Planning
          </p>

          <div className="animate-hero-line" style={{
            width: "60px", height: "1px",
            background: "var(--gold)", marginBottom: "2rem",
          }} />

          <h1 className="animate-hero-title" style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(3.5rem, 8vw, 7rem)",
            fontWeight: 300, letterSpacing: "0.35em",
            color: "var(--white)", lineHeight: 1.05,
            marginBottom: "1.5rem",
          }}>
            イベント<br />
            <span style={{ fontStyle: "italic", color: "rgba(255,255,255,0.75)" }}>
              アイデア帳
            </span>
          </h1>

          <p className="animate-hero-sub" style={{
            fontSize: "0.8rem", letterSpacing: "0.25em",
            color: "rgba(255,255,255,0.5)", marginBottom: "2.5rem",
            textTransform: "uppercase",
          }}>
            地域コミュニティの企画書ライブラリ
          </p>

          <div className="animate-hero-cta" style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
            <Link href="/generate" className="btn-navy" style={{ padding: "0.9rem 2.5rem" }}>
              AI でアイデアを生成する
            </Link>
            <a href="#archive" className="btn-outline-gold">
              アーカイブを見る
            </a>
          </div>
        </div>
      </section>

      {/* ── Archive Section ────────────────────────────── */}
      <section id="archive" style={{
        background: "var(--cream)", padding: "6rem 2rem",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Section Header */}
          <div data-reveal className="section-header" style={{ marginBottom: "3.5rem" }}>
            <span className="section-label">アイデア一覧</span>
            <span className="section-title">ARCHIVE</span>
            <div className="section-rule" />
          </div>

          {/* Season Filter */}
          <div data-reveal data-delay="1" style={{
            display: "flex", flexWrap: "wrap", gap: "0.5rem",
            justifyContent: "center", marginBottom: "3rem",
          }}>
            {SEASONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSeason(s)}
                className={`season-pill${currentSeason === s ? " active" : ""}`}
              >
                <span style={{ marginRight: "0.4rem", fontSize: "0.9em" }}>{SEASON_EMOJI[s]}</span>
                {SEASON_EN[s]}
              </button>
            ))}
          </div>

          {/* Count */}
          <p data-reveal data-delay="2" style={{
            textAlign: "center",
            fontSize: "0.65rem", letterSpacing: "0.2em",
            color: "var(--text-muted)", marginBottom: "3rem",
            textTransform: "uppercase",
          }}>
            {filtered.length} Ideas Found
          </p>

          {/* Empty */}
          {filtered.length === 0 && (
            <div data-reveal style={{ textAlign: "center", padding: "5rem 0" }}>
              <p style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "3rem", color: "var(--cream-dark)",
                fontWeight: 300, letterSpacing: "0.2em",
              }}>No Ideas Yet</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "1rem" }}>
                <Link href="/generate" style={{ color: "var(--gold)", textDecoration: "none" }}>
                  AI でアイデアを生成する
                </Link>
                か、Claude Code に企画書を作成してもらいましょう
              </p>
            </div>
          )}

          {/* Card Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "1.5rem",
          }}>
            {filtered.map((idea, i) => (
              <Link
                key={idea.slug}
                href={`/ideas/${idea.slug}`}
                data-reveal
                data-delay={String(Math.min((i % 3) + 1, 4))}
                className="idea-card"
                style={{
                  display: "block", textDecoration: "none",
                  position: "relative", overflow: "hidden",
                }}
              >
                {/* Top accent bar */}
                <div style={{
                  height: "3px",
                  background: `linear-gradient(90deg, var(--navy) 0%, var(--gold) 100%)`,
                }} />

                <div style={{ padding: "1.75rem" }}>
                  {/* Season + Category header */}
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", marginBottom: "1rem",
                  }}>
                    <span style={{
                      fontSize: "0.6rem", letterSpacing: "0.2em",
                      textTransform: "uppercase", color: "var(--text-muted)",
                    }}>
                      {SETTING_ICONS[idea.setting]} {idea.setting}
                    </span>
                    <span style={{
                      fontSize: "0.6rem", letterSpacing: "0.15em",
                      padding: "0.25rem 0.6rem",
                      ...SEASON_TAG_STYLE[idea.season] ?? { background: "var(--cream-dark)", color: "var(--text-sub)", border: "1px solid var(--border)" },
                    }}>
                      {idea.season}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "var(--font-noto), sans-serif",
                    fontSize: "1.05rem", fontWeight: 700,
                    color: "var(--navy)", letterSpacing: "0.03em",
                    lineHeight: 1.5, marginBottom: "1.25rem",
                  }}>
                    {idea.title}
                  </h2>

                  {/* Meta row */}
                  <div style={{
                    display: "flex", flexWrap: "wrap", gap: "1rem",
                    marginBottom: "1.25rem",
                    paddingBottom: "1.25rem",
                    borderBottom: "1px solid var(--cream-dark)",
                  }}>
                    {[
                      { icon: "👥", val: `${idea.participants}名` },
                      { icon: "⏱", val: idea.duration },
                      { icon: "💴", val: `¥${idea.budgetPerPerson.toLocaleString()}/人` },
                    ].map(({ icon, val }) => (
                      <span key={val} style={{
                        fontSize: "0.75rem", color: "var(--text-sub)",
                        display: "flex", alignItems: "center", gap: "0.3rem",
                      }}>
                        <span style={{ fontSize: "0.85em" }}>{icon}</span> {val}
                      </span>
                    ))}
                  </div>

                  {/* Age groups */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
                    {idea.ageGroups.map((g) => (
                      <span key={g} style={{
                        fontSize: "0.6rem", letterSpacing: "0.1em",
                        padding: "0.2rem 0.6rem",
                        border: "1px solid var(--border)",
                        color: "var(--text-sub)",
                      }}>
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {idea.tags.slice(0, 4).map((t) => (
                      <span key={t} style={{
                        fontSize: "0.6rem", color: "var(--gold)",
                        letterSpacing: "0.05em",
                      }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Read more indicator */}
                <div style={{
                  padding: "0.75rem 1.75rem",
                  borderTop: "1px solid var(--cream-dark)",
                  background: "var(--cream)",
                  fontSize: "0.6rem", letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "var(--navy)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span>詳細を見る</span>
                  <span style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1rem" }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ───────────────────────────────────── */}
      <section style={{
        background: "var(--navy)", padding: "5rem 2rem", textAlign: "center",
      }}>
        <div data-reveal style={{ maxWidth: "600px", margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "0.65rem", letterSpacing: "0.4em",
            color: "var(--gold)", textTransform: "uppercase",
            marginBottom: "1.5rem",
          }}>
            AI-Powered Generation
          </p>
          <h2 style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 300, letterSpacing: "0.2em",
            color: "var(--white)", lineHeight: 1.4,
            marginBottom: "1rem",
          }}>
            まだアイデアが<br />見つかりませんか？
          </h2>
          <p style={{
            fontSize: "0.8rem", color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.1em", marginBottom: "2.5rem",
          }}>
            テーマ・目的・対象者・予算を入力するだけで<br />
            SCAMPER法を使ったAIが10個のアイデアを即時生成します
          </p>
          <Link href="/generate" className="btn-outline-gold">
            AI でアイデアを生成する →
          </Link>
        </div>
      </section>
    </>
  );
}

export default function IdeasClient({ initialIdeas }: { initialIdeas: IdeaSummary[] }) {
  return (
    <Suspense fallback={
      <div style={{ textAlign: "center", padding: "8rem 0", color: "var(--text-muted)" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
          <div className="dot-1" style={{ width: 8, height: 8, background: "var(--navy)", borderRadius: "50%" }} />
          <div className="dot-2" style={{ width: 8, height: 8, background: "var(--navy)", borderRadius: "50%" }} />
          <div className="dot-3" style={{ width: 8, height: 8, background: "var(--navy)", borderRadius: "50%" }} />
        </div>
      </div>
    }>
      <IdeasContent initialIdeas={initialIdeas} />
    </Suspense>
  );
}
