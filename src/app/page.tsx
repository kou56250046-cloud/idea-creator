import Link from "next/link";
import { getAllIdeas, SEASON_COLORS, SETTING_ICONS } from "@/lib/ideas";
import SeasonFilter from "@/components/SeasonFilter";

type Props = {
  searchParams: Promise<{ season?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { season } = await searchParams;
  const allIdeas = getAllIdeas();

  const filteredIdeas =
    season && season !== "全て"
      ? allIdeas.filter((idea) => idea.season === season)
      : allIdeas;

  const seasons = ["全て", "春", "夏", "秋", "冬", "通年"] as const;

  return (
    <div>
      {/* フィルター */}
      <SeasonFilter seasons={[...seasons]} currentSeason={season ?? "全て"} />

      {/* 件数 */}
      <p className="text-sm text-gray-500 mb-4">
        {filteredIdeas.length} 件のアイデア
      </p>

      {/* アイデアがない場合 */}
      {filteredIdeas.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p>この季節のアイデアはまだありません</p>
          <p className="text-sm mt-1">Claude Codeに企画書を生成してもらいましょう！</p>
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
            {/* ヘッダー */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <h2 className="font-bold text-base leading-snug">{idea.title}</h2>
              <span
                className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${SEASON_COLORS[idea.season] ?? "bg-gray-100 text-gray-600"}`}
              >
                {idea.season}
              </span>
            </div>

            {/* バッジ行 */}
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                👥 {idea.participants}人
              </span>
              <span className="flex items-center gap-1">
                {SETTING_ICONS[idea.setting]} {idea.setting}
              </span>
              <span className="flex items-center gap-1">
                ⏱ {idea.duration}
              </span>
              <span className="flex items-center gap-1">
                💴 {idea.budgetPerPerson.toLocaleString()}円/人
              </span>
            </div>

            {/* 世代 */}
            <div className="flex flex-wrap gap-1 mb-3">
              {idea.ageGroups.map((group) => (
                <span
                  key={group}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                >
                  {group}
                </span>
              ))}
            </div>

            {/* タグ */}
            <div className="flex flex-wrap gap-1">
              {idea.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full"
                >
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
