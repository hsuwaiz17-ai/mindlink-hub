import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/dashboard/Header";
import ContentInput from "@/components/dashboard/ContentInput";
import SummarySettings from "@/components/dashboard/SummarySettings";
import SummaryResult from "@/components/dashboard/SummaryResult";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useSummarize } from "@/hooks/useSummarize";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [summary, setSummary] = useState("");
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  
  const { settings, updateSettings } = useUserSettings();
  const { summarize, isLoading } = useSummarize();

  // Convert image to base64 when selected
  useEffect(() => {
    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        setImageBase64(base64);
      };
      reader.readAsDataURL(selectedImage);
    } else {
      setImageBase64(null);
    }
  }, [selectedImage]);

  const handleSummarize = async () => {
    if (!content && !imageBase64) {
      toast.error("Please enter some content or upload an image");
      return;
    }

    const result = await summarize({
      content,
      language: settings.language,
      aiModel: settings.aiModel,
      imageBase64: imageBase64 || undefined,
    });

    if (result) {
      setSummary(result);
      
      // Save to database if user is logged in
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Create document
          const { data: doc, error: docError } = await supabase
            .from("documents")
            .insert({
              user_id: user.id,
              original_content: content || "Image content",
              input_type: imageBase64 ? "image" : "text",
              title: content?.slice(0, 50) || "Untitled Document",
            })
            .select()
            .single();

          if (doc && !docError) {
            setCurrentDocId(doc.id);
            
            // Create summary
            await supabase.from("summaries").insert({
              doc_id: doc.id,
              summary_text: result,
              summary_type: settings.aiModel,
            });
          }
        }
      } catch (error) {
        console.error("Error saving to database:", error);
      }
    }
  };

  const handleExportComplete = async (url: string, type: "pdf" | "image") => {
    if (!currentDocId) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Get the summary for this document
        const { data: summaryData } = await supabase
          .from("summaries")
          .select("id")
          .eq("doc_id", currentDocId)
          .single();

        if (summaryData) {
          await supabase
            .from("summaries")
            .update({
              export_type: type,
              export_url: url,
            })
            .eq("id", summaryData.id);
        }
      }
    } catch (error) {
      console.error("Error saving export URL:", error);
    }
  };

  const hasContent = content.trim().length > 0 || imageBase64 !== null;

  return (
    <div className="min-h-screen bg-background">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-accent/10 blur-3xl" />
      </div>

      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Welcome to MindLink
          </h2>
          <p className="text-muted-foreground">
            Transform your content into intelligent summaries
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          {/* Content Input */}
          <ContentInput
            content={content}
            onContentChange={setContent}
            onImageSelected={setSelectedImage}
          />

          {/* Summary Settings */}
          <SummarySettings
            aiModel={settings.aiModel}
            language={settings.language}
            onAiModelChange={(value) => updateSettings({ aiModel: value })}
            onLanguageChange={(value) => updateSettings({ language: value })}
          />

          {/* Summarize Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleSummarize}
              disabled={!hasContent || isLoading}
              className="min-w-[200px] gap-2 rounded-xl shadow-lg transition-all hover:shadow-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Summarize
                </>
              )}
            </Button>
          </div>

          {/* Summary Result */}
          <SummaryResult
            summary={summary}
            isLoading={isLoading}
            onExportComplete={handleExportComplete}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
