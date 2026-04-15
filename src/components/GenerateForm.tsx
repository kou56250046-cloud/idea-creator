"use client";

import { useState } from "react";
import type { GeneratedIdea } from "@/app/api/generate/route";
import IdeaCard from "./IdeaCard";

const SORT_OPTIONS = [
  { key: "default",     label: "生成順",  en: "Default" },
  { key: "feasibility", label: "実現性順", en: "Feasibility" },
  { key: "novelty",     label: "新規性順", en: "Novelty" },
] as const;

const STEPS = [
  { num: "01", label: "条件を入力",    en: "Input Conditions" },
  { num: "02", label: "AIが10個生成",  en: "AI Generates 10 Ideas" },
  { num: "03", label: "評価・選択",    en: "Evaluate & Select" },
];

const FIELDS = [
  { key: "theme",          label: "テーマ",    en: "Theme",        placeholder: "スポーツ、料理、文化祭、アウトドア…" },
  { key: "purpose",        label: "目的",      en: "Purpose",      placeholder: "親睦を深める、新メンバーの歓迎、季節の行事…" },
  { key: "targetAudience", label: "対象者",    en: "Audience",     placeholder: "子供〜高齢者20人、大人のみ15人…" },
  { key: "budget",         label: "予算",      en: "Budget",       placeholder: "500円/人、全体で1万円以内…" },
] as const;

export default function GenerateForm() {
  const [form, setForm] = useState({ theme: "", purpose: "", targetAudience: "", budget: "" });
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sort, setSort] = useState<"default" | "feasibility" | "novelty">("default");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(""); setIdeas([]);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "生成に失敗しました");
      setIdeas(data.ideas ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const sorted = [...ideas].sort((a, b) => {
    if (sort === "feasibility") return b.feasibility - a.feasibility;
    if (sort === "novelty")     return b.novelty - a.novelty;
    return a.id - b.id;
  });

  // Category grouping for summary
  const catCount = ideas.reduce<Record<string, number>>((acc, i) => {
    acc[i.category] = (acc[i.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      {/* ── FLOW Steps ─────────────────────────────────── */}
      <section style={{ background: "var(--cream-dark)", padding: "3rem 2rem" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem",
        }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{ textAlign: "center" }}>
              <span style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "3.5rem", fontWeight: 300,
                color: i === 0 ? "var(--navy)" : "var(--cream-dark)",
                display: "block", lineHeight: 1,
                WebkitTextStroke: i > 0 ? "1px var(--border)" : "none",
              }}>
                {step.num}
              </span>
              <div style={{
                width: "24px", height: "1px",
                background: i === 0 ? "var(--gold)" : "var(--border)",
                margin: "0.75rem auto",
              }} />
              <p style={{
                fontSize: "0.7rem", letterSpacing: "0.15em",
                color: i === 0 ? "var(--navy)" : "var(--text-muted)",
                textTransform: "uppercase",
              }}>{step.en}</p>
              <p style={{ fontSize: "0.85rem", color: "var(--text-sub)", marginTop: "0.25rem" }}>
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Form Section ───────────────────────────────── */}
      <section style={{ background: "var(--white)", padding: "5rem 2rem" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>

          {/* Section header */}
          <div className="section-header" style={{ marginBottom: "3.5rem" }}>
            <span className="section-label">条件入力</span>
            <span className="section-title">INPUT</span>
            <div className="section-rule visible" />
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr",
              gap: "0 3rem", marginBottom: "3.5rem",
            }}>
              {FIELDS.map(({ key, label, en, placeholder }) => (
                <div key={key} className="field-wrap" style={{ marginBottom: "2.5rem" }}>
                  <label className="field-label" htmlFor={key}>{en} / {label}</label>
                  <input
                    id={key}
                    className="field-input"
                    type="text"
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    required
                  />
                  <div className="field-underline" />
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: "1rem 1.5rem",
                borderLeft: "2px solid #C05050",
                background: "#FDF5F5",
                marginBottom: "2rem",
                fontSize: "0.8rem", color: "#C05050",
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <div style={{ textAlign: "center" }}>
              <button
                type="submit"
                disabled={loading}
                className="btn-navy"
                style={{
                  padding: "1.1rem 4rem",
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Generating…" : "10個のアイデアを生成する"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* ── Loading ─────────────────────────────────────── */}
      {loading && (
        <section style={{ background: "var(--cream)", padding: "5rem 2rem", textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.6rem", marginBottom: "2rem" }}>
            <div className="dot-1" style={{ width: 10, height: 10, background: "var(--navy)", borderRadius: "50%" }} />
            <div className="dot-2" style={{ width: 10, height: 10, background: "var(--gold)", borderRadius: "50%" }} />
            <div className="dot-3" style={{ width: 10, height: 10, background: "var(--navy)", borderRadius: "50%" }} />
          </div>
          <p style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "1.5rem", fontWeight: 300,
            letterSpacing: "0.2em", color: "var(--navy)",
            marginBottom: "0.5rem",
          }}>
            Generating Ideas
          </p>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase" }}>
            SCAMPER法と心理学的原則を組み合わせ、10個のアイデアを生成中…
          </p>
        </section>
      )}

      {/* ── Results ─────────────────────────────────────── */}
      {ideas.length > 0 && !loading && (
        <section style={{ background: "var(--cream)", padding: "5rem 2rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

            {/* Section header */}
            <div className="section-header" style={{ marginBottom: "3rem" }}>
              <span className="section-label">{ideas.length} ideas generated</span>
              <span className="section-title">IDEAS</span>
              <div className="section-rule visible" />
            </div>

            {/* Category summary */}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "0.75rem",
              justifyContent: "center", marginBottom: "2rem",
            }}>
              {Object.entries(catCount).map(([cat, count]) => (
                <span key={cat} style={{
                  fontSize: "0.65rem", letterSpacing: "0.1em",
                  padding: "0.35rem 0.85rem",
                  border: "1px solid var(--border)",
                  color: "var(--text-sub)",
                  background: "var(--white)",
                }}>
                  {cat} × {count}
                </span>
              ))}
            </div>

            {/* Sort controls */}
            <div style={{
              display: "flex", justifyContent: "flex-end", gap: "0.5rem",
              marginBottom: "2.5rem",
            }}>
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", alignSelf: "center", marginRight: "0.5rem" }}>
                Sort
              </span>
              {SORT_OPTIONS.map(({ key, en }) => (
                <button
                  key={key}
                  onClick={() => setSort(key)}
                  className={`btn-outline-navy${sort === key ? " selected" : ""}`}
                  style={{ fontSize: "0.6rem" }}
                >
                  {en}
                </button>
              ))}
            </div>

            {/* Card grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
              gap: "1.5rem",
            }}>
              {sorted.map((idea, i) => (
                <IdeaCard key={idea.id} idea={idea} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
