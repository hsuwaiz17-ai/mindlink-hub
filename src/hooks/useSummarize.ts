import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SummarizeParams {
  content: string;
  language: string;
  aiModel: string;
  imageBase64?: string;
}

interface UseSummarizeReturn {
  summarize: (params: SummarizeParams) => Promise<string | null>;
  isLoading: boolean;
  error: string | null;
}

export const useSummarize = (): UseSummarizeReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = async ({ content, language, aiModel, imageBase64 }: SummarizeParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("summarize-text", {
        body: {
          content,
          language,
          aiModel,
          imageBase64,
        },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      return data?.summary || null;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to summarize content";
      setError(message);
      toast.error(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { summarize, isLoading, error };
};
