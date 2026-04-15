"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import type { IdeaSummary } from "@/lib/ideas";
import { SEASON_COLORS, SETTING_ICONS } from "@/lib/constants";

const SEASONS = ["全て", "春", "夏", "秋", "冬", "通年"] as const;

const SEASON_ACTIVE: Record<string, string> = {
  全て: "bg-indigo-600 text-white",
  春: "bg-pink-500 text-white",
  夏: "bg-blue-500 text-white",
  秋: "bg-orange-500 text-white",
  冬: "bg-indigo-500 text-white",
  通年: "bg-green-500 text-white",
};

const SEASON_EMOJI: Record<string, string> = {
  全て: "🗂",
  春: "🌸",
  夏: "🌊",
  秋: "🍂",
  冬: "❄️",
  通年: "🌿",
};

function IdeasList({ initialIdeas }: { initialIdeas: IdeaSummary[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const currentSeason = searchParams.get("season") ?? "全て";

  const filteredIdeas =
    currentSeason !== "全て"
      ? initialIdeas.filter((idea) => idea.season === currentSeason)
      : initialIdeas;

  const handleSeasonClick = (season: string) => {
    if (season === "全て") {
      router.push(pathname);
    } else {
      router.push(`${pathname}?season=${encodeURIComponent(season)}`);
    }
  };

  return (
    <div>
      {/* フィルター */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SEASONS.map((season) => {
          const isActive = currentSeason === season;
          return (
            <button
              key={season}
              onClick={() => handleSeasonClick(season)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                isActive
                  ? SEASON_ACTIVE[season] ?? "bg-indigo-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <span>{SEASON_EMOJI[season]}</span>
              <span>{season}</span>
            </button>
          );
        })}
      </div>

      {/* 件数 */}
      <p className="text-sm text-gray-500 mb-4">{filteredIdeas.length} 件のアイデア</p>

      {/* アイデアがない場合 */}
      {filteredIdeas.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p>この季節のアイデアはまだありません</p>
          <p className="text-sm mt-1">
            <Link href="/generate" className="text-indigo-500 underline">
              アイデアを生成する
            </Link>
            か、Claude Codeに企画書を作ってもらいましょう！
          </p>
        </div>
      )}

      {/* カード一覧 */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filteredIdeas.map((idea) => (
          <Link
            key={idea.slug}
            href={`/ideas/${idea.slug}`}
            className="block bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="font-bold text-base leading-snug">{idea.title}</h2>
              <span
                className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${SEASON_COLORS[idea.season] ?? "bg-gray-100 text-gray-600"}`}
              >
                {idea.season}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
              <span>👥 {idea.participants}人</span>
              <span>{SETTING_ICONS[idea.setting]} {idea.setting}</span>
              <span>⏱ {idea.duration}</span>
              <span>💴 {idea.budgetPerPerson.toLocaleString()}円/人</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {idea.ageGroups.map((group) => (
                <span key={group} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {group}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-1">
              {idea.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function IdeasClient({ initialIdeas }: { initialIdeas: IdeaSummary[] }) {
  return (
    <Suspense fallback={<div className="text-center py-8 text-gray-400">読み込み中…</div>}>
      <IdeasList initialIdeas={initialIdeas} />
    </Suspense>
  );
}
