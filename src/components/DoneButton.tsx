"use client";
import { useState, useEffect } from "react";

const STORAGE_KEY = "done-ideas";

export default function DoneButton({ slug }: { slug: string }) {
  const [isDone, setIsDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setIsDone((JSON.parse(stored) as string[]).includes(slug));
    } catch {}
  }, [slug]);

  const toggle = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const ids: string[] = stored ? JSON.parse(stored) : [];
      const next = isDone ? ids.filter((id) => id !== slug) : [...ids, slug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setIsDone(!isDone);
    } catch {}
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      className="no-print"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.6rem 1.4rem",
        borderRadius: "999px",
        border: isDone ? "1.5px solid #22c55e" : "1.5px solid var(--border)",
        background: isDone ? "#f0fdf4" : "var(--white)",
        color: isDone ? "#16a34a" : "var(--text-sub)",
        fontSize: "0.78rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "var(--font-noto), sans-serif",
        letterSpacing: "0.04em",
      }}
    >
      {isDone ? "✅ 実施済み" : "○ 実施した！"}
    </button>
  );
}
