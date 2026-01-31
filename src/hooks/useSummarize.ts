import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SummarizeParams {
  content: string;
  language: string;
  aiModel: string;
  imageBase64?: string;
}

export const useSummarize = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = async ({ content, language, aiModel, imageBase64 }: SummarizeParams) => {
    if (!content && !imageBase64) {
      toast.error("ကျေးဇူးပြု၍ စာသား သို့မဟုတ် ပုံ ထည့်သွင်းပေးပါ");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("summarize-text", {
        body: { content, language, aiModel, imageBase64 },
      });

      if (fnError) throw new Error(fnError.message);
      if (data?.error) throw new Error(data.error);

      return data?.summary || null;
    } catch (err: any) {
      const msg = err.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { summarize, isLoading, error };
};