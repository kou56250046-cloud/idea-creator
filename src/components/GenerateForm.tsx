"use client";

import { useState } from "react";
import type { GeneratedIdea } from "@/app/api/generate/route";
import IdeaCard from "./IdeaCard";

const SCORE_COLOR = (score: number) => {
  if (score >= 4) return "text-emerald-600";
  if (score >= 3) return "text-amber-500";
  return "text-red-500";
};

export default function GenerateForm() {
  const [form, setForm] = useState({
    theme: "",
    purpose: "",
    targetAudience: "",
    budget: "",
  });
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "feasibility" | "novelty">("default");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIdeas([]);

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

  // カテゴリ別にグループ化
  const grouped = ideas.reduce<Record<string, GeneratedIdea[]>>((acc, idea) => {
    const key = `${idea.categoryIcon} ${idea.category}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(idea);
    return acc;
  }, {});

  const sortedIdeas = [...ideas].sort((a, b) => {
    if (sortBy === "feasibility") return b.feasibility - a.feasibility;
    if (sortBy === "novelty") return b.novelty - a.novelty;
    return a.id - b.id;
  });

  return (
    <div>
      {/* 入力フォーム */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-200 p-5 mb-8 shadow-sm"
      >
        <h2 className="font-bold text-base mb-4 flex items-center gap-2">
          <span>✨</span> 条件を入力してアイデアを生成
        </h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              テーマ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="例：スポーツ大会、料理、文化祭…"
              value={form.theme}
              onChange={(e) => setForm({ ...form, theme: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              目的 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="例：親睦を深める、新メンバーの歓迎…"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              対象者 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="例：子供〜高齢者20人、大人のみ15人…"
              value={form.targetAudience}
              onChange={(e) => setForm({ ...form, targetAudience: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              予算 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="例：500円/人、全体で1万円以内…"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "🤔 アイデアを考えています…" : "🎯 10個のアイデアを生成する"}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
            ⚠️ {error}
          </p>
        )}
      </form>

      {/* ローディング */}
      {loading && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3 animate-pulse">💡</div>
          <p className="font-medium">SCAMPER法で多角的にアイデアを生成中…</p>
          <p className="text-sm mt-1">重複排除・評価まで自動で行います</p>
        </div>
      )}

      {/* 結果 */}
      {ideas.length > 0 && !loading && (
        <div>
          {/* 結果ヘッダー */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h2 className="font-bold text-base">
              💡 {ideas.length}個のアイデアが生成されました
            </h2>

            {/* 並び替え */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">並び替え:</span>
              {(["default", "feasibility", "novelty"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setSortBy(key)}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sortBy === key
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {key === "default" ? "生成順" : key === "feasibility" ? "実現性" : "新規性"}
                </button>
              ))}
            </div>
          </div>

          {/* カテゴリ別サマリー */}
          <div className="flex flex-wrap gap-2 mb-5">
            {Object.entries(grouped).map(([cat, items]) => (
              <span
                key={cat}
                className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
              >
                {cat} {items.length}件
              </span>
            ))}
          </div>

          {/* カード一覧 */}
          <div className="grid gap-4 sm:grid-cols-2">
            {sortedIdeas.map((idea) => (
              <IdeaCard key={idea.id} idea={idea} scoreColor={SCORE_COLOR} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
