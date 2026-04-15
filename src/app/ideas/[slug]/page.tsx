import { notFound } from "next/navigation";
import Link from "next/link";
import { getIdeaBySlug, getAllIdeas } from "@/lib/ideas";
import { SEASON_COLORS, SETTING_ICONS } from "@/lib/constants";
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

const SEASON_TAG: Record<string, React.CSSProperties> = {
  春: { background: "#FBF0F5", color: "#C45A84", border: "1px solid #F0C8DA" },
  夏: { background: "#EEF5FB", color: "#2A6EA6", border: "1px solid #C8DDF0" },
  秋: { background: "#FBF5EE", color: "#A65A2A", border: "1px solid #F0D8C8" },
  冬: { background: "#EEF0FB", color: "#2A3A9A", border: "1px solid #C8CEF0" },
  通年: { background: "#EEF8F0", color: "#2A8A4A", border: "1px solid #C8E8D0" },
};

export default async function IdeaPage({ params }: Props) {
  const { slug } = await params;
  const idea = await getIdeaBySlug(slug);
  if (!idea) notFound();

  return (
    <>
      {/* ── Hero ──────────────────────────────────────── */}
      <section className="hero-bg" style={{
        padding: "4rem 2rem 3.5rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", left: "calc(50% - 600px + 48px)",
          top: 0, bottom: 0, width: "1px",
          background: "linear-gradient(180deg, transparent, rgba(184,150,90,0.4) 30%, rgba(184,150,90,0.4) 70%, transparent)",
        }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Breadcrumb */}
          <Link href="/" style={{
            fontSize: "0.6rem", letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "rgba(184,150,90,0.8)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            marginBottom: "2rem",
            transition: "opacity 0.3s",
          }}>
            ← Archive
          </Link>

          {/* Season + Setting badges */}
          <div className="animate-hero-sub" style={{
            display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap",
          }}>
            <span style={{
              fontSize: "0.65rem", letterSpacing: "0.15em",
              padding: "0.3rem 0.8rem",
              ...(SEASON_TAG[idea.season] ?? { background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.2)" }),
            }}>
              {idea.season}
            </span>
            <span style={{
              fontSize: "0.65rem", letterSpacing: "0.15em",
              padding: "0.3rem 0.8rem",
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}>
              {SETTING_ICONS[idea.setting]} {idea.setting}
            </span>
          </div>

          {/* Title */}
          <h1 className="animate-hero-title" style={{
            fontFamily: "var(--font-noto), sans-serif",
            fontSize: "clamp(1.75rem, 4vw, 3rem)",
            fontWeight: 700, letterSpacing: "0.05em",
            color: "var(--white)", lineHeight: 1.35,
            maxWidth: "700px",
          }}>
            {idea.title}
          </h1>

          {/* Meta row */}
          <div className="animate-hero-desc" style={{
            display: "flex", flexWrap: "wrap", gap: "1.5rem",
            marginTop: "1.75rem",
          }}>
            {[
              { icon: "👥", val: `${idea.participants}名` },
              { icon: "⏱", val: idea.duration },
              { icon: "💴", val: `¥${idea.budgetPerPerson.toLocaleString()}/人` },
            ].map(({ icon, val }) => (
              <span key={val} style={{
                fontSize: "0.8rem", color: "rgba(255,255,255,0.6)",
                display: "flex", alignItems: "center", gap: "0.4rem",
              }}>
                {icon} {val}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ───────────────────────────────────── */}
      <section style={{ background: "var(--cream)", padding: "5rem 2rem" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "4rem",
          alignItems: "start",
        }}>

          {/* Main content */}
          <div data-reveal>
            <article
              className="prose-craft"
              dangerouslySetInnerHTML={{ __html: idea.contentHtml }}
            />
          </div>

          {/* Sidebar */}
          <aside data-reveal data-delay="2">
            {/* Info card */}
            <div style={{
              background: "var(--white)",
              border: "1px solid var(--border)",
              marginBottom: "1.5rem",
              overflow: "hidden",
            }}>
              <div style={{
                height: "3px",
                background: "linear-gradient(90deg, var(--navy), var(--gold))",
              }} />
              <div style={{ padding: "1.5rem" }}>
                <p style={{
                  fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase",
                  color: "var(--text-muted)", marginBottom: "1.25rem",
                }}>
                  Overview
                </p>

                {[
                  { label: "季節", value: idea.season },
                  { label: "参加人数", value: `${idea.participants}名` },
                  { label: "場所", value: `${SETTING_ICONS[idea.setting]} ${idea.setting}` },
                  { label: "所要時間", value: idea.duration },
                  { label: "予算/人", value: `¥${idea.budgetPerPerson.toLocaleString()}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "0.6rem 0",
                    borderBottom: "1px solid var(--cream-dark)",
                    fontSize: "0.8rem",
                  }}>
                    <span style={{ color: "var(--text-muted)", fontSize: "0.7rem", letterSpacing: "0.1em" }}>{label}</span>
                    <span style={{ color: "var(--navy)", fontWeight: 500 }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Age groups */}
            <div style={{
              background: "var(--white)",
              border: "1px solid var(--border)",
              padding: "1.5rem",
              marginBottom: "1.5rem",
            }}>
              <p style={{
                fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase",
                color: "var(--text-muted)", marginBottom: "1rem",
              }}>対象世代</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {idea.ageGroups.map((g) => (
                  <span key={g} style={{
                    fontSize: "0.7rem", letterSpacing: "0.1em",
                    padding: "0.3rem 0.75rem",
                    border: "1px solid var(--navy)",
                    color: "var(--navy)",
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
              padding: "1.5rem",
              marginBottom: "2rem",
            }}>
              <p style={{
                fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase",
                color: "var(--text-muted)", marginBottom: "1rem",
              }}>Tags</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {idea.tags.map((t) => (
                  <span key={t} style={{
                    fontSize: "0.65rem", color: "var(--gold)", letterSpacing: "0.05em",
                  }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Date */}
            <p style={{
              fontSize: "0.6rem", letterSpacing: "0.2em",
              color: "var(--text-muted)", textAlign: "right",
            }}>
              {new Date(idea.date).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </aside>
        </div>

        {/* Back link */}
        <div style={{ maxWidth: "1200px", margin: "4rem auto 0", borderTop: "1px solid var(--cream-dark)", paddingTop: "2rem" }}>
          <Link href="/" style={{
            fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase",
            color: "var(--navy)", textDecoration: "none",
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
          }}>
            ← Back to Archive
          </Link>
        </div>
      </section>
    </>
  );
}
