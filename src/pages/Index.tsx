import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/dashboard/Header";
import ContentInput from "@/components/dashboard/ContentInput";
import SummarySettings from "@/components/dashboard/SummarySettings";
import SummaryResult from "@/components/dashboard/SummaryResult";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useSummarize } from "@/hooks/useSummarize";
import { useAuth } from "@/hooks/useAuth";
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
  const { user } = useAuth();

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

  // Upload image to Supabase Storage
  const uploadImageToStorage = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("document-images")
        .upload(fileName, file);

      if (error) {
        console.error("Error uploading image:", error);
        return null;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("document-images")
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSummarize = async () => {
    if (!content && !imageBase64) {
      toast.error("Please enter some content or upload an image");
      return;
    }

    if (!user) {
      toast.error("Please sign in to summarize content");
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
      
      try {
        // Upload image to storage if present
        let imageUrl: string | null = null;
        if (selectedImage) {
          imageUrl = await uploadImageToStorage(selectedImage);
        }

        // Determine input type
        const inputType = imageBase64 ? "image" : "text";

        // Create document in database
        const { data: doc, error: docError } = await supabase
          .from("documents")
          .insert({
            user_id: user.id,
            original_content: content || null,
            input_type: inputType,
            title: content?.slice(0, 50) || "Untitled Document",
            image_url: imageUrl,
          })
          .select()
          .single();

        if (docError) {
          console.error("Error creating document:", docError);
          toast.error("Failed to save document");
          return;
        }

        if (doc) {
          setCurrentDocId(doc.id);
          
          // Create summary linked to document
          const { error: summaryError } = await supabase
            .from("summaries")
            .insert({
              doc_id: doc.id,
              summary_text: result,
              summary_type: settings.aiModel,
            });

          if (summaryError) {
            console.error("Error creating summary:", summaryError);
            toast.error("Failed to save summary");
          } else {
            toast.success("Document and summary saved successfully");
          }
        }
      } catch (error) {
        console.error("Error saving to database:", error);
        toast.error("Failed to save to database");
      }
    }
  };

  const handleExportComplete = async (url: string, type: "pdf" | "image") => {
    if (!currentDocId || !user) return;

    try {
      // Get the summary for this document
      const { data: summaryData, error: fetchError } = await supabase
        .from("summaries")
        .select("id")
        .eq("doc_id", currentDocId)
        .single();

      if (fetchError) {
        console.error("Error fetching summary:", fetchError);
        return;
      }

      if (summaryData) {
        const { error: updateError } = await supabase
          .from("summaries")
          .update({
            export_type: type,
            export_url: url,
          })
          .eq("id", summaryData.id);

        if (updateError) {
          console.error("Error updating export URL:", updateError);
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
