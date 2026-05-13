import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ 
      error: "API Configuration Error: OPENROUTER_API_KEY is missing from environment variables. Please add it to your .env file and restart your terminal (pnpm dev)." 
    }, { status: 500 });
  }

  try {
    const { code, language, filename } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided for review." }, { status: 400 });
    }

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      defaultHeaders: {
        "HTTP-Referer": "https://synthetix-editor.vercel.app",
        "X-OpenRouter-Title": "Synthetix Editor",
      }
    });

    const prompt = `You are a professional code reviewer. Analyze the following ${language} code from the file "${filename}".
    Check for:
    1. Logical bugs or errors.
    2. Performance bottlenecks.
    3. Security vulnerabilities.
    4. Code style and readability improvements.
    
    Provide your feedback in a concise, professional Markdown format with clear headings.
    
    Code to review:
    \`\`\`${language}
    ${code}
    \`\`\``;

    // Using Gemini 2.0 Flash via OpenRouter for speed and quality
    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001", 
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    return NextResponse.json({ 
      result: response.choices[0]?.message?.content || "AI could not generate a review at this time." 
    });
  } catch (error: unknown) {
    console.error("OpenRouter API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate review";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
