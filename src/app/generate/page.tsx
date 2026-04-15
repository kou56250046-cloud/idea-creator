import type { Metadata } from "next";
import GenerateForm from "@/components/GenerateForm";

export const metadata: Metadata = {
  title: "アイデア生成 | イベントアイデア帳",
};

export default function GeneratePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1">🎯 AIでイベントアイデアを生成</h1>
        <p className="text-sm text-gray-500">
          テーマ・目的・対象者・予算を入力すると、SCAMPER法×心理学原則で
          10個のアイデアをカテゴリ分け・評価付きで生成します。
        </p>
      </div>
      <GenerateForm />
    </div>
  );
}
