// Lovable AI Gateway powered summarization

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

    // Use Lovable AI Gateway for all models
    const model = aiModel === "gpt-4o" ? "openai/gpt-5" : "google/gemini-3-flash-preview";
    summary = await summarizeWithLovableGateway(content, language, imageBase64, model);

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


async function summarizeWithLovableGateway(
  content: string, 
  language: string, 
  imageBase64?: string,
  model: string = "google/gemini-3-flash-preview"
): Promise<string> {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) {
    throw new Error("LOVABLE_API_KEY is not configured");
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

  console.log(`Calling Lovable AI Gateway with model: ${model}`);

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Lovable AI Gateway error:", response.status, errorData);
    
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }
    if (response.status === 402) {
      throw new Error("AI usage limit reached. Please add credits to continue.");
    }
    
    throw new Error("Failed to get AI response. Please try again.");
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("No summary generated");
  }

  return text;
}
