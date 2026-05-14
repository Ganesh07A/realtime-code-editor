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
    const { code, language, filename, selectedText } = await req.json();

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

    const isSelection = !!selectedText && selectedText.length > 0;
    
    let prompt = "";
    if (isSelection) {
      prompt = `You are a professional code reviewer. The user has selected a specific snippet of ${language} code in the file "${filename}".
      
      SELECTED SNIPPET:
      \`\`\`${language}
      ${selectedText}
      \`\`\`

      FULL FILE CONTEXT (for reference only):
      \`\`\`${language}
      ${code}
      \`\`\`

      Task:
      1. Analyze the SELECTED SNIPPET for bugs or improvements.
      2. Provide a concise explanation of issues.
      3. Provide a corrected version of ONLY the selected snippet.
      
      FORMATTING:
      End your response with a section titled "REVISED SNIPPET" followed by a code block containing ONLY the corrected snippet.`;
    } else {
      prompt = `You are a professional code reviewer. Analyze the following ${language} code from the file "${filename}".
      
      Code to review:
      \`\`\`${language}
      ${code}
      \`\`\`

      Task:
      1. Analyze for bugs, performance, security, and style.
      2. Provide concise feedback.
      3. Provide the FULL corrected version of the file.
      
      FORMATTING:
      End your response with a section titled "COMPLETE REVISED CODE" followed by a code block containing the entire corrected file.`;
    }

    // Using Gemini 1.5 Flash via OpenRouter for better rate-limit stability
    const response = await openai.chat.completions.create({
      model: "inclusionai/ring-2.6-1t:free", 
      messages: [
        {
          role: "system",
          content: "You are a world-class code reviewer. Your goal is to help developers write safer, cleaner, and more efficient code."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more precise code fixes
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
