import type { Metadata } from "next";
import GenerateForm from "@/components/GenerateForm";

export const metadata: Metadata = {
  title: "AI アイデア生成 | イベントアイデア帳",
};

export default function GeneratePage() {
  return (
    <>
      {/* Page Hero */}
      <section className="hero-bg" style={{
        padding: "4rem 2rem 3rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: "calc(50% - 600px + 48px)",
          top: 0, bottom: 0, width: "1px",
          background: "linear-gradient(180deg, transparent, rgba(184,150,90,0.4) 30%, rgba(184,150,90,0.4) 70%, transparent)",
        }} />
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p className="animate-hero-label" style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "0.65rem", letterSpacing: "0.5em",
            color: "rgba(184,150,90,0.8)", textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            AI-Powered Idea Generation
          </p>
          <div className="animate-hero-line" style={{
            width: "48px", height: "1px", background: "var(--gold)", marginBottom: "1.5rem",
          }} />
          <h1 className="animate-hero-title" style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            fontWeight: 300, letterSpacing: "0.3em",
            color: "var(--white)", lineHeight: 1.1,
          }}>
            CREATE
          </h1>
          <p className="animate-hero-sub" style={{
            fontSize: "0.8rem", color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.2em", marginTop: "0.75rem",
            textTransform: "uppercase",
          }}>
            条件を入力してAIがイベントアイデアを10個生成
          </p>
        </div>
      </section>

      <GenerateForm />
    </>
  );
}
