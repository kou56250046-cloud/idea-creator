"use client";

import { useState, useEffect, useRef } from "react";
import type { GeneratedIdea } from "@/app/api/generate/route";

type Props = {
  idea: GeneratedIdea;
  index: number;
};

const CATEGORY_COLORS: Record<string, string> = {
  "体験・ワークショップ型": "#7A5E42",
  "競技・ゲーム型":         "#2A5A8A",
  "食・飲食型":             "#7A3A2A",
  "文化・芸術型":           "#5A2A7A",
  "自然・アウトドア型":     "#2A6A3A",
  "奉仕・協力型":           "#3A5A6A",
};

function ScoreBar({ score, label, reason }: { score: number; label: string; reason: string }) {
  const barRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setAnimated(true); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const pct = (score / 5) * 100;

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.35rem" }}>
        <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
          {label}
        </span>
        <span style={{
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "1.2rem", fontWeight: 500,
          color: score >= 4 ? "var(--gold)" : score >= 3 ? "var(--text-sub)" : "#B05050",
        }}>
          {score}<span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontFamily: "var(--font-noto), sans-serif" }}>/5</span>
        </span>
      </div>
      <div className="score-track" ref={barRef}>
        <div
          className="score-fill"
          style={{ width: animated ? `${pct}%` : "0%" }}
        />
      </div>
      <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.3rem", lineHeight: 1.4 }}>
        {reason}
      </p>
    </div>
  );
}

export default function IdeaCard({ idea, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const catColor = CATEGORY_COLORS[idea.category] ?? "var(--navy)";

  return (
    <div
      className="idea-card card-enter"
      style={{
        animationDelay: `${index * 0.08}s`,
        display: "flex", flexDirection: "column",
        overflow: "hidden", position: "relative",
      }}
    >
      {/* Category accent top bar */}
      <div style={{ height: "3px", background: catColor }} />

      {/* Category + Icon label */}
      <div style={{
        background: catColor,
        padding: "0.5rem 1.5rem",
        display: "flex", alignItems: "center", gap: "0.5rem",
      }}>
        <span style={{ fontSize: "1.1rem" }}>{idea.categoryIcon}</span>
        <span style={{
          fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
          color: "rgba(255,255,255,0.85)",
        }}>
          {idea.category}
        </span>
        <span style={{
          marginLeft: "auto",
          fontFamily: "var(--font-cormorant), serif",
          fontSize: "0.8rem", color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.1em",
        }}>
          No.{String(idea.id).padStart(2, "0")}
        </span>
      </div>

      {/* Main content */}
      <div style={{ padding: "1.5rem", flex: 1 }}>

        {/* Title */}
        <h3 style={{
          fontFamily: "var(--font-noto), sans-serif",
          fontSize: "1rem", fontWeight: 700,
          color: "var(--navy)", letterSpacing: "0.03em",
          lineHeight: 1.5, marginBottom: "0.75rem",
        }}>
          {idea.title}
        </h3>

        {/* Summary */}
        <p style={{
          fontSize: "0.8rem", color: "var(--text-sub)",
          lineHeight: 1.7, marginBottom: "1.5rem",
          paddingBottom: "1.25rem",
          borderBottom: "1px solid var(--cream-dark)",
        }}>
          {idea.summary}
        </p>

        {/* Score bars */}
        <ScoreBar score={idea.feasibility} label="実現性" reason={idea.feasibilityReason} />
        <ScoreBar score={idea.novelty}     label="新規性" reason={idea.noveltyReason} />

        {/* Timeline */}
        <div style={{
          marginTop: "1rem",
          padding: "0.75rem 1rem",
          background: "var(--cream)",
          borderLeft: "2px solid var(--gold)",
          fontSize: "0.75rem", color: "var(--text-sub)", lineHeight: 1.6,
        }}>
          <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.25rem" }}>
            Timeline
          </span>
          {idea.timeline}
        </div>
      </div>

      {/* Expand button */}
      <button onClick={() => setExpanded(!expanded)} className="expand-btn">
        {expanded ? "▲  Close" : "▼  準備リスト・ミニゲーム・運営のコツ"}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{
          padding: "1.5rem",
          background: "var(--cream)",
          borderTop: "1px solid var(--cream-dark)",
        }}>
          {idea.preparation.length > 0 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{
                fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: "var(--text-muted)", marginBottom: "0.75rem",
              }}>📦  Preparation</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {idea.preparation.map((item, i) => (
                  <li key={i} style={{
                    fontSize: "0.78rem", color: "var(--text-sub)",
                    padding: "0.35rem 0", borderBottom: "1px solid var(--cream-dark)",
                    display: "flex", gap: "0.6rem",
                  }}>
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {idea.minigames.length > 0 && (
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{
                fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: "var(--text-muted)", marginBottom: "0.75rem",
              }}>🎮  Mini Games</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {idea.minigames.map((item, i) => (
                  <li key={i} style={{
                    fontSize: "0.78rem", color: "var(--text-sub)",
                    padding: "0.35rem 0", borderBottom: "1px solid var(--cream-dark)",
                    display: "flex", gap: "0.6rem",
                  }}>
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {idea.tips.length > 0 && (
            <div>
              <p style={{
                fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
                color: "var(--text-muted)", marginBottom: "0.75rem",
              }}>💡  Tips</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {idea.tips.map((item, i) => (
                  <li key={i} style={{
                    fontSize: "0.78rem", color: "var(--text-sub)",
                    padding: "0.35rem 0", borderBottom: "1px solid var(--cream-dark)",
                    display: "flex", gap: "0.6rem",
                  }}>
                    <span style={{ color: "var(--gold)", flexShrink: 0 }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
