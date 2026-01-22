import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  content: string;
  language: string;
  aiModel: string;
  imageBase64?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, language, aiModel, imageBase64 }: RequestBody = await req.json();

    console.log(`Summarization request - Model: ${aiModel}, Language: ${language}`);
    console.log(`Content length: ${content?.length || 0}, Has image: ${!!imageBase64}`);

    if (!content && !imageBase64) {
      return new Response(
        JSON.stringify({ error: "No content or image provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let summary: string;

    if (aiModel === "gemini-pro") {
      summary = await summarizeWithGemini(content, language, imageBase64);
    } else if (aiModel === "gpt-4o") {
      summary = await summarizeWithOpenAI(content, language, imageBase64);
    } else {
      return new Response(
        JSON.stringify({ error: "Invalid AI model specified" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Summary generated successfully, length: ${summary.length}`);

    return new Response(
      JSON.stringify({ summary }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Summarization error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to summarize content";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function summarizeWithGemini(content: string, language: string, imageBase64?: string): Promise<string> {
  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    throw new Error("Gemini API key not configured. Please add GEMINI_API_KEY to your Supabase secrets.");
  }

  const prompt = `You are an expert summarizer. Summarize the following content in ${language} language. 
Use proper formatting with Markdown. If there are mathematical formulas or scientific concepts, use LaTeX notation (e.g., $E = mc^2$ for inline or $$\\int_a^b f(x)dx$$ for block equations).

Content to summarize:
${content || "Please analyze the provided image and summarize its content."}

Provide a clear, concise, and well-structured summary.`;

  const parts: any[] = [{ text: prompt }];

  if (imageBase64) {
    parts.push({
      inline_data: {
        mime_type: "image/jpeg",
        data: imageBase64,
      },
    });
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Gemini API error:", errorData);
    
    // Parse error to provide better user feedback
    try {
      const errorJson = JSON.parse(errorData);
      if (errorJson.error?.code === 429) {
        throw new Error("Gemini API quota exceeded. Please try using GPT-4o model instead, or wait a few minutes and try again.");
      }
    } catch (parseError) {
      // If parsing fails, use generic error
    }
    
    throw new Error("Failed to get response from Gemini. Please try using GPT-4o model instead.");
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No summary generated from Gemini");
  }

  return text;
}

async function summarizeWithOpenAI(content: string, language: string, imageBase64?: string): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const prompt = `You are an expert summarizer. Summarize the following content in ${language} language. 
Use proper formatting with Markdown. If there are mathematical formulas or scientific concepts, use LaTeX notation (e.g., $E = mc^2$ for inline or $$\\int_a^b f(x)dx$$ for block equations).

Content to summarize:
${content || "Please analyze the provided image and summarize its content."}

Provide a clear, concise, and well-structured summary.`;

  const messages: any[] = [];

  if (imageBase64) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: prompt },
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
        },
      ],
    });
  } else {
    messages.push({
      role: "user",
      content: prompt,
    });
  }

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-3-flash-preview",
      messages,
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("OpenAI API error:", errorData);
    throw new Error("Failed to get response from OpenAI");
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("No summary generated from OpenAI");
  }

  return text;
}
