import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

export type GeneratedIdea = {
  id: number;
  title: string;
  summary: string;
  category: string;
  categoryIcon: string;
  feasibility: number;
  novelty: number;
  feasibilityReason: string;
  noveltyReason: string;
  timeline: string;
  preparation: string[];
  minigames: string[];
  tips: string[];
};

export type GenerateResponse = {
  ideas: GeneratedIdea[];
};

function loadSkills(): string {
  const skillsPath = path.join(process.cwd(), "skills.md");
  if (fs.existsSync(skillsPath)) {
    return fs.readFileSync(skillsPath, "utf8");
  }
  return "";
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY が設定されていません" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { theme, purpose, targetAudience, budget } = body as {
    theme: string;
    purpose: string;
    targetAudience: string;
    budget: string;
  };

  if (!theme || !purpose || !targetAudience || !budget) {
    return NextResponse.json(
      { error: "テーマ・目的・対象者・予算を全て入力してください" },
      { status: 400 }
    );
  }

  const skills = loadSkills();

  const prompt = `
あなたは地域コミュニティのイベント企画の専門家です。
以下のスキルリファレンスを参照し、高品質なイベントアイデアを10個生成してください。

---
# スキルリファレンス
${skills}
---

# ユーザーの入力条件
- テーマ: ${theme}
- 目的: ${purpose}
- 対象者: ${targetAudience}
- 予算: ${budget}

# 生成ルール
1. SCAMPER法の7視点を意識して、多様な観点からアイデアを生成すること
2. 6つのカテゴリ（体験・ワークショップ型 / 競技・ゲーム型 / 食・飲食型 / 文化・芸術型 / 自然・アウトドア型 / 奉仕・協力型）からバランスよく出すこと
3. 似たようなアイデアの重複を避け、10個それぞれが独自の特徴を持つこと
4. 実現性スコア・新規性スコアはスキルリファレンスの基準に従って1〜5点で採点すること
5. 全体的に現実的かつ実施しやすいものを優先すること

# 出力フォーマット（必ずこのJSONのみを返すこと）
{
  "ideas": [
    {
      "id": 1,
      "title": "イベントタイトル（20文字以内）",
      "summary": "イベントの概要（100文字以内）",
      "category": "カテゴリ名（上記6種類のいずれか）",
      "categoryIcon": "絵文字1文字",
      "feasibility": 整数(1〜5),
      "novelty": 整数(1〜5),
      "feasibilityReason": "実現性スコアの理由（40文字以内）",
      "noveltyReason": "新規性スコアの理由（40文字以内）",
      "timeline": "大まかな進行の流れ（例：集合10分→メイン30分→交流20分）",
      "preparation": ["準備物1", "準備物2", "準備物3"],
      "minigames": ["盛り上げアイデア1", "盛り上げアイデア2"],
      "tips": ["運営のコツ1", "運営のコツ2"]
    }
  ]
}
`;

  try {
    const genai = new GoogleGenAI({ apiKey });
    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text ?? "";

    // JSONをパース
    let parsed: GenerateResponse;
    try {
      parsed = JSON.parse(text);
    } catch {
      // コードブロックで囲まれている場合に対応
      const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        parsed = JSON.parse(match[1]);
      } else {
        throw new Error("JSONのパースに失敗しました");
      }
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: "アイデアの生成に失敗しました。しばらく待ってから再試行してください。" },
      { status: 500 }
    );
  }
}
