export async function getEmbedding(text: string): Promise<number[]> {
    const response = await fetch("https://api.gemini.ai/embedding", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: text }),
    });
    const data = await response.json();
    return data.embedding; // Returns a vector
  }
  