import { supabase } from "@/lib/supabase";

export type AiTask =
  | "summary"
  | "answer"
  | "paraphrase"
  | "theory";

interface RunAiParams {
  content: string;
  task: AiTask;
  language: string;
}

export async function runAi({
  content,
  task,
  language,
}: RunAiParams): Promise<string> {
  const { data, error } = await supabase.functions.invoke("gemini-ai", {
    body: {
      content,
      task,
      language,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.result as string;
}
