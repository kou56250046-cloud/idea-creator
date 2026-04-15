"use client";

import { useState } from "react";
import type { GeneratedIdea } from "@/app/api/generate/route";

type Props = {
  idea: GeneratedIdea;
  scoreColor: (score: number) => string;
};

function ScoreDots({ score }: { score: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`inline-block w-2 h-2 rounded-full ${i <= score ? "bg-current" : "bg-gray-200"}`}
        />
      ))}
    </span>
  );
}

export default function IdeaCard({ idea, scoreColor }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-indigo-200 hover:shadow-sm transition-all">
      {/* ヘッダー */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-2xl shrink-0">{idea.categoryIcon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <h3 className="font-bold text-sm leading-snug">{idea.title}</h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full shrink-0">
                {idea.category}
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{idea.summary}</p>
          </div>
        </div>

        {/* スコア */}
        <div className="flex gap-4 mt-2 text-xs">
          <div>
            <span className="text-gray-400 mr-1">実現性</span>
            <span className={`font-bold ${scoreColor(idea.feasibility)}`}>
              {idea.feasibility}/5
            </span>
            <div className={`mt-0.5 ${scoreColor(idea.feasibility)}`}>
              <ScoreDots score={idea.feasibility} />
            </div>
            <p className="text-gray-400 mt-0.5 text-[10px]">{idea.feasibilityReason}</p>
          </div>
          <div>
            <span className="text-gray-400 mr-1">新規性</span>
            <span className={`font-bold ${scoreColor(idea.novelty)}`}>
              {idea.novelty}/5
            </span>
            <div className={`mt-0.5 ${scoreColor(idea.novelty)}`}>
              <ScoreDots score={idea.novelty} />
            </div>
            <p className="text-gray-400 mt-0.5 text-[10px]">{idea.noveltyReason}</p>
          </div>
        </div>

        {/* タイムライン */}
        <div className="mt-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5">
          ⏱ {idea.timeline}
        </div>
      </div>

      {/* 展開ボタン */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 py-1.5 text-center transition-colors font-medium"
      >
        {expanded ? "▲ 閉じる" : "▼ 準備リスト・ミニゲーム・運営のコツを見る"}
      </button>

      {/* 展開コンテンツ */}
      {expanded && (
        <div className="px-4 py-3 border-t border-gray-100 space-y-3">
          {idea.preparation.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-600 mb-1">📦 準備・持ち物</p>
              <ul className="space-y-0.5">
                {idea.preparation.map((item, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-gray-300 shrink-0 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {idea.minigames.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-600 mb-1">🎮 ミニゲーム・盛り上げアイデア</p>
              <ul className="space-y-0.5">
                {idea.minigames.map((item, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-gray-300 shrink-0 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {idea.tips.length > 0 && (
            <div>
              <p className="text-xs font-bold text-gray-600 mb-1">💡 運営のコツ</p>
              <ul className="space-y-0.5">
                {idea.tips.map((item, i) => (
                  <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                    <span className="text-gray-300 shrink-0 mt-0.5">•</span>
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
