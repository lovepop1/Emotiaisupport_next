import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use Service Role Key for write access
);

// Initialize Google Generative AI API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export async function GET(req: NextRequest) {
  try {
    console.log("🔍 Fetching records with NULL embeddings...");

    // Step 1: Fetch all records where embeddings are NULL
    const { data: records, error: fetchError } = await supabase
      .from("cbt_guide")
      .select("id, content") // Select only ID & Content
      .is("embedding", null);

    if (fetchError) throw fetchError;
    if (!records || records.length === 0) {
      return NextResponse.json({ message: "No records to update" }, { status: 200 });
    }

    console.log(`📌 Found ${records.length} records to update.`);

    // Step 2: Generate embeddings for each record
    for (const record of records) {
      try {
        const response = await model.embedContent(record.content);
        const embedding = response.embedding.values;

        if (!embedding) throw new Error("Failed to generate embedding");

        // Step 3: Update Supabase table with new embeddings
        const { error: updateError } = await supabase
          .from("cbt_guide")
          .update({ embedding })
          .eq("id", record.id);

        if (updateError) throw updateError;

        console.log(`✅ Updated embedding for record ID: ${record.id}`);
      } catch (embedError) {
        console.error(`❌ Error generating/updating embedding for ID: ${record.id}`, embedError);
      }
    }

    return NextResponse.json({ message: "Embeddings updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating embeddings:", error);
    return NextResponse.json({ message: "Error updating embeddings", error }, { status: 500 });
  }
}
