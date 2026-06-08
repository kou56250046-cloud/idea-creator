"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="no-print"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.5rem 1.1rem",
        borderRadius: "3px",
        border: "1.5px solid var(--border)",
        background: "var(--white)",
        color: "var(--text-sub)",
        fontSize: "0.72rem",
        letterSpacing: "0.08em",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s ease",
        fontFamily: "var(--font-noto), sans-serif",
      }}
    >
      🖨 印刷
    </button>
  );
}
