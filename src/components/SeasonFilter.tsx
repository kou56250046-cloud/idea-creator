"use client";

import { useRouter, usePathname } from "next/navigation";

type Props = {
  seasons: string[];
  currentSeason: string;
};

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

export default function SeasonFilter({ seasons, currentSeason }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const handleClick = (season: string) => {
    if (season === "全て") {
      router.push(pathname);
    } else {
      router.push(`${pathname}?season=${encodeURIComponent(season)}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {seasons.map((season) => {
        const isActive = currentSeason === season;
        return (
          <button
            key={season}
            onClick={() => handleClick(season)}
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
  );
}
