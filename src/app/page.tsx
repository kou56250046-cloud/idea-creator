import { getAllIdeas } from "@/lib/ideas";
import IdeasClient from "@/components/IdeasClient";

// ビルド時に全アイデアを読み込む（SSG）
export default function Home() {
  const allIdeas = getAllIdeas();
  return <IdeasClient initialIdeas={allIdeas} />;
}
