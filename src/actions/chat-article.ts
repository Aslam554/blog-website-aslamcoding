"use server";

import { auth } from "@/auth";

export async function chatWithArticle(articleContent: string, userMessage: string, history: { role: "user" | "assistant", content: string }[] = []) {
  await auth();
  // We allow anonymous chat, but you could restrict it if needed.

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const systemPrompt = `
    You are an AI Assistant for "Aslam Coding Blog". 
    You are helping a reader understand the following blog post:
    ---
    ${articleContent}
    ---
    
    CRITICAL FORMATTING RULES:
    1. Keep responses NEAT, CLEAN, and MINIMALIST.
    2. DO NOT use excessive symbols like "***", "###", "---", or "===" in your response.
    3. Use simple paragraphs. Avoid long blocks of text.
    4. Use **bold** only for essential terms.
    5. No unnecessary headers or styling. Just clear, readable text.
    6. Respond ONLY based on the article content above and general programming knowledge.
    7. Be professional and encouraging.
    8. Do not sign off with your name.
  `;

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
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: userMessage }
        ],
        temperature: 0.5,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Failed to get AI response");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error: unknown) {
    console.error("AI Chat Error:", error);
    throw new Error(error instanceof Error ? error.message : "Something went wrong while chatting.");
  }
}
