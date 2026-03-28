"use server";
import { auth } from "@/auth";

export async function generateAIContent(prompt: string, type: "content" | "title" | "outline" | "image" = "content") {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === "your_groq_api_key_here") {
    throw new Error("GROQ_API_KEY is not configured. Please add it to your .env file.");
  }

  const systemPrompts = {
    content: "You are a professional blog writer. Write a detailed, engaging blog post about the given topic. Use markdown formatting. CRITICAL: Use DOUBLE NEWLINES between all paragraphs and sections for clear spacing. Do not include titles at the start.",
    title: "Generate a catchy and SEO-friendly title for a blog post about the following topic.",
    outline: "Generate a structured outline for a blog post about the following topic. Use clear headings.",
    image: "Generate a single relevant keyword or short descriptive phrase (max 3 words) that would be suitable for searching a high-quality cover photo for a blog post about the given topic. Only return the keyword/phrase."
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompts[type] },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to generate AI content");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: unknown) {
    console.error("AI Generation Error:", error);
    throw new Error(error instanceof Error ? error.message : "Something went wrong while generating content.");
  }
}
