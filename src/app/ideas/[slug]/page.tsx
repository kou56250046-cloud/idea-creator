import { notFound } from "next/navigation";
import Link from "next/link";
import { getIdeaBySlug, getAllIdeas } from "@/lib/ideas";
import { SEASON_COLORS, SETTING_ICONS } from "@/lib/constants";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const ideas = getAllIdeas();
  return ideas.map((idea) => ({ slug: idea.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const idea = await getIdeaBySlug(slug);
  if (!idea) return { title: "Not Found" };
  return { title: `${idea.title} | イベントアイデア帳` };
}

export default async function IdeaPage({ params }: Props) {
  const { slug } = await params;
  const idea = await getIdeaBySlug(slug);

  if (!idea) notFound();

  return (
    <div>
      {/* 戻るリンク */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        ← 一覧に戻る
      </Link>

      {/* タイトル */}
      <h1 className="text-2xl font-bold mb-3">{idea.title}</h1>

      {/* メタ情報バッジ */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${SEASON_COLORS[idea.season] ?? "bg-gray-100 text-gray-600"}`}
        >
          {idea.season}
        </span>
        <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          👥 {idea.participants}人
        </span>
        <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          {SETTING_ICONS[idea.setting]} {idea.setting}
        </span>
        <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          ⏱ {idea.duration}
        </span>
        <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
          💴 {idea.budgetPerPerson.toLocaleString()}円/人
        </span>
      </div>

      {/* 世代 */}
      <div className="flex flex-wrap gap-1 mb-4">
        <span className="text-sm text-gray-500 mr-1">対象：</span>
        {idea.ageGroups.map((group) => (
          <span
            key={group}
            className="text-sm bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full"
          >
            {group}
          </span>
        ))}
      </div>

      {/* タグ */}
      <div className="flex flex-wrap gap-1 mb-6">
        {idea.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>

      <hr className="border-gray-200 mb-6" />

      {/* Markdownコンテンツ */}
      <article
        className="prose prose-sm max-w-none
          prose-headings:font-bold prose-headings:text-gray-800
          prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-1
          prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2
          prose-ul:my-2 prose-li:my-0.5
          prose-p:my-2 prose-p:leading-relaxed
          prose-strong:text-gray-900
          prose-table:text-sm prose-th:bg-gray-50 prose-th:p-2 prose-td:p-2"
        dangerouslySetInnerHTML={{ __html: idea.contentHtml }}
      />

      {/* フッター */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-400">
        作成日: {new Date(idea.date).toLocaleDateString("ja-JP")}
      </div>
    </div>
  );
}
