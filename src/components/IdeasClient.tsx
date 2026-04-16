"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Suspense, useMemo } from "react";
import type { IdeaSummary } from "@/lib/ideas";
import { SETTING_ICONS } from "@/lib/constants";

/** 設定（屋内/屋外）に応じたカードヘッダーカラー */
const SETTING_HEADER: Record<string, { bg: string; accent: string; label: string }> = {
  屋外:       { bg: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)", accent: "#34d399", label: "OUTDOOR" },
  屋内:       { bg: "linear-gradient(135deg, #312e81 0%, #3730a3 100%)", accent: "#818cf8", label: "INDOOR"  },
  どちらでも: { bg: "linear-gradient(135deg, #78350f 0%, #92400e 100%)", accent: "#fbbf24", label: "BOTH"    },
};

/** タグの優先順位（カード上部に表示するメインテーマ） */
const THEME_TAGS = [
  "遊び", "野外活動", "室内活動", "運動", "自然体験",
  "工作", "料理", "笑い", "アート", "クイズ", "音楽",
  "謎解き", "チーム対抗", "チームワーク", "発表", "創造性", "探検", "冒険",
];

function getMainTag(tags: string[]): string {
  return THEME_TAGS.find((t) => tags.includes(t)) ?? tags[0] ?? "";
}

function IdeaGrid({ initialIdeas }: { initialIdeas: IdeaSummary[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentTag = searchParams.get("tag") ?? "全て";

  /** アイデア全体から登場するユニークなタグを集計（件数順） */
  const tagCounts = useMemo(() => {
    const map = new Map<string, number>();
    initialIdeas.forEach((idea) => {
      idea.tags.forEach((t) => map.set(t, (map.get(t) ?? 0) + 1));
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [initialIdeas]);

  const filtered = useMemo(
    () =>
      currentTag !== "全て"
        ? initialIdeas.filter((i) => i.tags.includes(currentTag))
        : initialIdeas,
    [initialIdeas, currentTag]
  );

  const handleTag = (t: string) =>
    t === "全て"
      ? router.push(pathname)
      : router.push(`${pathname}?tag=${encodeURIComponent(t)}`);

  return (
    <>
      {/* ─── Hero ──────────────────────────────────────── */}
      <section style={{
        background: "var(--navy)",
        padding: "3.5rem 1.5rem 3rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(135deg, transparent 0px, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px)",
        }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p className="animate-hero-label" style={{
            fontSize: "0.62rem", letterSpacing: "0.3em",
            color: "rgba(184,150,90,0.85)", textTransform: "uppercase",
            marginBottom: "1.25rem",
          }}>
            Community Event Planning
          </p>

          <div className="animate-hero-line" style={{
            width: "48px", height: "1.5px",
            background: "rgba(184,150,90,0.6)", marginBottom: "1.5rem",
          }} />

          <h1 className="animate-hero-title" style={{
            fontFamily: "var(--font-noto), sans-serif",
            fontSize: "clamp(1.9rem, 4.5vw, 3.2rem)",
            fontWeight: 700, color: "var(--white)",
            lineHeight: 1.3, letterSpacing: "0.04em",
            marginBottom: "0.85rem",
          }}>
            イベントアイデア帳
          </h1>

          <p className="animate-hero-sub" style={{
            fontSize: "0.85rem", color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.05em", marginBottom: "2rem",
            maxWidth: "480px",
          }}>
            テーマ・人数・世代・予算から、コミュニティに最適なイベントを見つけよう
          </p>

          <div className="animate-hero-cta">
            <a href="#archive" style={{
              fontSize: "0.75rem", letterSpacing: "0.1em",
              color: "rgba(255,255,255,0.75)",
              border: "1px solid rgba(255,255,255,0.35)",
              padding: "0.9rem 1.75rem",
              borderRadius: "3px",
              textDecoration: "none",
              transition: "all 0.2s",
              display: "inline-block",
            }}>
              アーカイブを見る ↓
            </a>
          </div>
        </div>
      </section>

      {/* ─── Archive ───────────────────────────────────── */}
      <section id="archive" style={{ padding: "4rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Section header */}
          <div data-reveal className="section-header" style={{ marginBottom: "2.5rem" }}>
            <span className="section-label">アイデア一覧</span>
            <span className="section-title">ARCHIVE</span>
            <div className="section-rule" />
          </div>

          {/* Tag filter */}
          <div data-reveal data-delay="1" style={{ marginBottom: "2.5rem" }}>
            {/* 「全て」ボタン */}
            <div className="filter-pills" style={{ flexWrap: "wrap", gap: "0.5rem" }}>
              <button
                onClick={() => handleTag("全て")}
                className={`filter-pill${currentTag === "全て" ? " active" : ""}`}
              >
                <span>✦</span>
                <span>All</span>
                <span style={{
                  marginLeft: "0.25rem",
                  fontSize: "0.6rem",
                  opacity: 0.6,
                }}>
                  {initialIdeas.length}
                </span>
              </button>
              {tagCounts.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => handleTag(tag)}
                  className={`filter-pill${currentTag === tag ? " active" : ""}`}
                >
                  <span>{tag}</span>
                  <span style={{
                    marginLeft: "0.25rem",
                    fontSize: "0.6rem",
                    opacity: 0.6,
                  }}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Count */}
          <p data-reveal data-delay="2" style={{
            textAlign: "center", fontSize: "0.7rem",
            color: "var(--text-muted)", marginBottom: "2.5rem",
            letterSpacing: "0.12em",
          }}>
            {filtered.length} 件のアイデア
            {currentTag !== "全て" && (
              <span style={{ marginLeft: "0.5rem", color: "var(--accent)" }}>
                — {currentTag}
              </span>
            )}
          </p>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div data-reveal style={{
              textAlign: "center", padding: "5rem 0",
              background: "var(--white)", borderRadius: "4px",
              border: "1px dashed var(--border)",
            }}>
              <p style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📭</p>
              <p style={{ color: "var(--text-sub)", fontSize: "0.9rem" }}>
                このテーマのアイデアはまだありません
              </p>
              <button
                onClick={() => handleTag("全て")}
                className="btn-primary"
                style={{ marginTop: "1.5rem" }}
              >
                全て表示する
              </button>
            </div>
          )}

          {/* Card grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1.5rem",
          }}>
            {filtered.map((idea, i) => {
              const header = SETTING_HEADER[idea.setting] ?? SETTING_HEADER["どちらでも"];
              const mainTag = getMainTag(idea.tags);

              return (
                <Link
                  key={idea.slug}
                  href={`/ideas/${idea.slug}`}
                  data-reveal
                  data-delay={String((i % 3) + 1)}
                  className="blog-card"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {/* Color header */}
                  <div style={{
                    background: header.bg,
                    padding: "1.1rem 1.25rem",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    position: "relative", minHeight: "64px",
                  }}>
                    {/* Setting badge */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{
                        fontSize: "0.58rem", letterSpacing: "0.15em",
                        color: header.accent, fontWeight: 700,
                        textTransform: "uppercase",
                      }}>
                        {SETTING_ICONS[idea.setting]} {header.label}
                      </span>
                    </div>

                    {/* Main tag pill */}
                    {mainTag && (
                      <span style={{
                        fontSize: "0.6rem", letterSpacing: "0.08em",
                        padding: "0.2rem 0.6rem", borderRadius: "999px",
                        background: "rgba(255,255,255,0.12)",
                        color: "rgba(255,255,255,0.85)",
                        fontWeight: 600,
                      }}>
                        {mainTag}
                      </span>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="card-body">
                    {/* Category (age groups) */}
                    <p className="card-category">
                      <span>◆</span>
                      {idea.ageGroups.join(" · ")}
                    </p>

                    {/* Title */}
                    <h2 className="card-title">{idea.title}</h2>

                    {/* Meta */}
                    <div className="card-meta">
                      <span>👥 {idea.participants}名</span>
                      <span>⏱ {idea.duration}</span>
                      <span>💴 ¥{idea.budgetPerPerson.toLocaleString()}/人</span>
                    </div>

                    {/* Tags */}
                    <div className="card-tags">
                      {idea.tags.slice(0, 4).map((t) => (
                        <span key={t} className="card-tag">#{t}</span>
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default function IdeasClient({ initialIdeas }: { initialIdeas: IdeaSummary[] }) {
  return (
    <Suspense fallback={
      <div style={{ textAlign: "center", padding: "6rem 0" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem" }}>
          <div className="dot-1" style={{ width: 8, height: 8, background: "var(--accent)", borderRadius: "50%" }} />
          <div className="dot-2" style={{ width: 8, height: 8, background: "var(--accent)", borderRadius: "50%" }} />
          <div className="dot-3" style={{ width: 8, height: 8, background: "var(--accent)", borderRadius: "50%" }} />
        </div>
      </div>
    }>
      <IdeaGrid initialIdeas={initialIdeas} />
    </Suspense>
  );
}
