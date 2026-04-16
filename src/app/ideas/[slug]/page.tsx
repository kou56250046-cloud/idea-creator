import { notFound } from "next/navigation";
import Link from "next/link";
import { getIdeaBySlug, getAllIdeas } from "@/lib/ideas";
import { SETTING_ICONS } from "@/lib/constants";
import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllIdeas().map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const idea = await getIdeaBySlug(slug);
  return idea ? { title: `${idea.title} | イベントアイデア帳` } : { title: "Not Found" };
}

const SEASON_BADGE: Record<string, { bg: string; color: string }> = {
  春: { bg: "#FFF0F5", color: "#C45A84" },
  夏: { bg: "#EEF5FB", color: "#2A6EA6" },
  秋: { bg: "#FBF5EE", color: "#A65A2A" },
  冬: { bg: "#EEF0FB", color: "#2A3A9A" },
  通年: { bg: "#EEF8F0", color: "#2A8A4A" },
};

export default async function IdeaPage({ params }: Props) {
  const { slug } = await params;
  const idea = await getIdeaBySlug(slug);
  if (!idea) notFound();

  const badge = SEASON_BADGE[idea.season] ?? { bg: "var(--accent-soft)", color: "var(--accent)" };

  return (
    <>
      {/* ── Page Header ──────────────────────────────── */}
      <section style={{
        background: "var(--white)",
        borderBottom: "1px solid var(--border)",
        padding: "3rem 1.5rem 2.5rem",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          {/* Breadcrumb */}
          <Link href="/" style={{
            fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase",
            color: "var(--text-muted)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            marginBottom: "1.5rem", transition: "color 0.2s",
          }}>
            ← Archive
          </Link>

          {/* Badges */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "0.65rem", letterSpacing: "0.1em",
              padding: "0.3rem 0.8rem", borderRadius: "999px",
              background: badge.bg, color: badge.color,
              fontWeight: 600, border: `1px solid ${badge.color}30`,
            }}>
              {idea.season}
            </span>
            <span style={{
              fontSize: "0.65rem", letterSpacing: "0.1em",
              padding: "0.3rem 0.8rem", borderRadius: "999px",
              background: "var(--bg)", color: "var(--text-sub)",
              border: "1px solid var(--border)",
            }}>
              {SETTING_ICONS[idea.setting]} {idea.setting}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "var(--font-noto), sans-serif",
            fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)",
            fontWeight: 700, letterSpacing: "0.04em",
            color: "var(--navy)", lineHeight: 1.4,
            marginBottom: "1.25rem", maxWidth: "760px",
          }}>
            {idea.title}
          </h1>

          {/* Meta row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
            {[
              { icon: "👥", val: `${idea.participants}名` },
              { icon: "⏱", val: idea.duration },
              { icon: "💴", val: `¥${idea.budgetPerPerson.toLocaleString()}/人` },
            ].map(({ icon, val }) => (
              <span key={val} style={{
                fontSize: "0.8rem", color: "var(--text-sub)",
                display: "flex", alignItems: "center", gap: "0.35rem",
              }}>
                {icon} {val}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────── */}
      <section style={{ background: "var(--bg)", padding: "3.5rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          {/* Main article — full width */}
          <div data-reveal style={{ marginBottom: "2rem" }}>
            <div style={{
              background: "var(--white)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "2.5rem",
              boxShadow: "var(--shadow-sm)",
            }}>
              <article
                className="prose-craft"
                dangerouslySetInnerHTML={{ __html: idea.contentHtml }}
              />
            </div>
          </div>

          {/* Sub info row: Age groups + Tags */}
          <div data-reveal data-delay="1" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1rem",
            marginBottom: "1rem",
            alignItems: "start",
          }}>
            {/* Age groups */}
            <div style={{
              background: "var(--white)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "1.25rem",
              boxShadow: "var(--shadow-sm)",
            }}>
              <p style={{
                fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: "var(--text-muted)", marginBottom: "0.85rem", fontWeight: 600,
              }}>対象世代</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {idea.ageGroups.map((g) => (
                  <span key={g} style={{
                    fontSize: "0.7rem", padding: "0.3rem 0.75rem",
                    background: "var(--accent-soft)", color: "var(--accent)",
                    borderRadius: "999px", fontWeight: 600,
                  }}>
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div style={{
              background: "var(--white)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              padding: "1.25rem",
              boxShadow: "var(--shadow-sm)",
            }}>
              <p style={{
                fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: "var(--text-muted)", marginBottom: "0.85rem", fontWeight: 600,
              }}>Tags</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {idea.tags.map((t) => (
                  <span key={t} className="card-tag">#{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Overview card — full width at bottom */}
          <div data-reveal data-delay="2" style={{ marginBottom: "2rem" }}>
            <div style={{
              background: "var(--white)",
              border: "1px solid var(--border)",
              borderRadius: "4px",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
            }}>
              <div style={{ height: "3px", background: "var(--accent)" }} />
              <div style={{ padding: "1.5rem 2rem" }}>
                <p style={{
                  fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "var(--text-muted)", marginBottom: "1.25rem", fontWeight: 600,
                }}>
                  Overview
                </p>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "0",
                }}>
                  {[
                    { label: "季節",    value: idea.season },
                    { label: "参加人数", value: `${idea.participants}名` },
                    { label: "場所",    value: `${SETTING_ICONS[idea.setting]} ${idea.setting}` },
                    { label: "所要時間", value: idea.duration },
                    { label: "予算/人",  value: `¥${idea.budgetPerPerson.toLocaleString()}` },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      display: "flex", flexDirection: "column",
                      padding: "0.75rem 1rem",
                      borderRight: "1px solid var(--border)",
                      borderBottom: "1px solid var(--border)",
                    }}>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.68rem", letterSpacing: "0.08em", marginBottom: "0.3rem" }}>{label}</span>
                      <span style={{ color: "var(--navy)", fontWeight: 700, fontSize: "0.9rem" }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Date */}
          <p style={{
            fontSize: "0.62rem", letterSpacing: "0.15em",
            color: "var(--text-muted)", textAlign: "right",
            marginBottom: "2rem",
          }}>
            {new Date(idea.date).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Back link */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
          <Link href="/" style={{
            fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase",
            color: "var(--accent)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            fontWeight: 600,
          }}>
            ← Back to Archive
          </Link>
        </div>
      </section>
    </>
  );
}
