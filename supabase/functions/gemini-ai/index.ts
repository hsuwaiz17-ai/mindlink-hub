import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS Preflight အတွက်
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { mode, image, language, prompt: userPrompt } = await req.json()
    
    // Supabase Secrets ထဲက API Key ကို ယူသုံးခြင်း
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    const genAI = new GoogleGenerativeAI(apiKey!)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // AI ဆီ ပို့မယ့် ညွှန်ကြားချက် (System Prompt) ကို Language အလိုက် ပြင်ဆင်ခြင်း
    const systemInstruction = `
      You are a specialized education assistant. 
      Mode: ${mode} (summary, solution, explanation, or theory)
      Requested Language: ${language}
      Please provide the output strictly in ${language} and format it using Markdown.
      If it's a theory, explain it deeply. If it's a solution, show step-by-step.
    `;

    let result;
    
    if (image) {
      // ပုံပါလာရင် Image + Text Analysis လုပ်မယ်
      const imageData = image.split(',')[1] // remove data:image/png;base64,
      result = await model.generateContent([
        systemInstruction,
        {
          inlineData: {
            data: imageData,
            mimeType: "image/jpeg"
          }
        }
      ]);
    } else {
      // စာသားသက်သက်ဆိုရင်
      result = await model.generateContent([systemInstruction, userPrompt]);
    }

    const responseText = result.response.text();

    return new Response(
      JSON.stringify({ result: responseText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
