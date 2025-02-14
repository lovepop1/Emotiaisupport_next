import { PrismaClient } from "@prisma/client";
import { getEmbedding, fetchGeminiResponse } from "@/utils/embedding";
import { NextResponse } from "next/server";

const prismaclient = new PrismaClient();

export async function POST() {
  const guides = await prismaclient.cbt_guide.findMany();
  for (const guide of guides) {
    const embedding = await getEmbedding(guide.content); // Call Gemini API
    await prismaclient.cbt_guide.update({
      where: { id: guide.id },
      data: { embedding: embedding },
    });
  }
  return NextResponse.json({ message: "Embeddings updated" });
}