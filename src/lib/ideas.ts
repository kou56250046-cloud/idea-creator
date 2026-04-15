import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ideasDirectory = path.join(process.cwd(), "ideas");

export type IdeaFrontmatter = {
  title: string;
  date: string;
  season: "春" | "夏" | "秋" | "冬" | "通年";
  participants: number;
  ageGroups: string[];
  setting: "屋外" | "屋内" | "どちらでも";
  budgetPerPerson: number;
  duration: string;
  tags: string[];
};

export type IdeaSummary = IdeaFrontmatter & {
  slug: string;
};

export type IdeaDetail = IdeaSummary & {
  contentHtml: string;
};

function ensureIdeasDir() {
  if (!fs.existsSync(ideasDirectory)) {
    fs.mkdirSync(ideasDirectory, { recursive: true });
  }
}

export function getAllIdeas(): IdeaSummary[] {
  ensureIdeasDir();
  const fileNames = fs.readdirSync(ideasDirectory).filter((f) => f.endsWith(".md"));

  const ideas = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fullPath = path.join(ideasDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(fileContents);

    return {
      slug,
      ...(data as IdeaFrontmatter),
    };
  });

  // 日付の新しい順にソート
  return ideas.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getIdeaBySlug(slug: string): Promise<IdeaDetail | null> {
  ensureIdeasDir();
  const fullPath = path.join(ideasDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  const { remark } = await import("remark");
  const remarkHtml = (await import("remark-html")).default;

  const processedContent = await remark().use(remarkHtml).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...(data as IdeaFrontmatter),
  };
}

export const SEASON_COLORS: Record<string, string> = {
  春: "bg-pink-100 text-pink-800",
  夏: "bg-blue-100 text-blue-800",
  秋: "bg-orange-100 text-orange-800",
  冬: "bg-indigo-100 text-indigo-800",
  通年: "bg-green-100 text-green-800",
};

export const SETTING_ICONS: Record<string, string> = {
  屋外: "🌳",
  屋内: "🏠",
  どちらでも: "🔄",
};
