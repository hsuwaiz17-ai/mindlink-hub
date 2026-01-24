import React, { useState, useEffect, lazy, Suspense } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/dashboard/Header";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useSummarize } from "@/hooks/useSummarize";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Lazy load heavy components for performance
const ContentInput = lazy(() => import("@/components/dashboard/ContentInput"));
const SummarySettings = lazy(() => import("@/components/dashboard/SummarySettings"));
const SummaryResult = lazy(() => import("@/components/dashboard/SummaryResult"));
const SummaryExportActions = lazy(() => import("@/components/dashboard/SummaryExportActions"));

const ComponentLoader = () => (
  <div className="glass-card rounded-2xl p-6 animate-pulse">
    <div className="h-32 bg-muted/30 rounded-lg" />
  </div>
);

const Index = () => {
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagesBase64, setImagesBase64] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  
  const { settings, updateSettings } = useUserSettings();
  const { summarize, isLoading } = useSummarize();
  const { user } = useAuth();

  useEffect(() => {
    if (selectedImages.length > 0) {
      const convertPromises = selectedImages.map(file => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64 = (reader.result as string).split(",")[1];
            resolve(base64);
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(convertPromises).then(base64s => {
        setImagesBase64(base64s);
      });
    } else {
      setImagesBase64([]);
    }
  }, [selectedImages]);

  const uploadImagesToStorage = async (files: File[]): Promise<string[]> => {
    if (!user) return [];
    
    const urls: string[] = [];
    for (const file of files) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("document-images")
          .upload(fileName, file);

        if (!error) {
          const { data: urlData } = supabase.storage
            .from("document-images")
            .getPublicUrl(data.path);
          urls.push(urlData.publicUrl);
        }
      } catch (error) {
        console.error("Upload error:", error);
      }
    }
    return urls;
  };

  const handleSummarize = async () => {
    if (!content && imagesBase64.length === 0) {
      toast.error("Please enter some content or upload images");
      return;
    }

    if (!user) {
      toast.error("Please sign in to summarize content");
      return;
    }

    // Combine multiple images or process the first one based on your hook logic
    const result = await summarize({
      content,
      language: settings.language,
      aiModel: settings.aiModel,
      imageBase64: imagesBase64[0] || undefined, 
    });

    if (result) {
      setSummary(result);
      
      try {
        let imageUrls: string[] = [];
        if (selectedImages.length > 0) {
          imageUrls = await uploadImagesToStorage(selectedImages);
        }

        const inputType = imagesBase64.length > 0 ? "image" : "text";

        const { data: doc, error: docError } = await supabase
          .from("documents")
          .insert({
            user_id: user.id,
            original_content: content || null,
            input_type: inputType,
            title: content?.slice(0, 50) || "Untitled Document",
            image_url: imageUrls[0] || null,
          })
          .select()
          .single();

        if (doc) {
          setCurrentDocId(doc.id);
          await supabase.from("summaries").insert({
            doc_id: doc.id,
            summary_text: result,
            summary_type: settings.aiModel,
          });
          toast.success("Saved successfully");
        }
      } catch (error) {
        console.error("Database error:", error);
      }
    }
  };

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(prev => [...prev, ...files]);
  };

  const hasContent = content.trim().length > 0 || imagesBase64.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Chrome optimization: Pre-rendered background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-accent/10 blur-3xl" />
      </div>

      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Welcome to MindLink
          </h2>
          <p className="text-muted-foreground">
            Transform your content into intelligent summaries
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-6">
          <Suspense fallback={<ComponentLoader />}>
            <ContentInput
              content={content}
              onContentChange={setContent}
              onImagesSelected={handleImagesSelected}
            />
          </Suspense>

          <Suspense fallback={<ComponentLoader />}>
            <SummarySettings
              aiModel={settings.aiModel}
              language={settings.language}
              onAiModelChange={(value) => updateSettings({ aiModel: value })}
              onLanguageChange={(value) => updateSettings({ language: value })}
            />
          </Suspense>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleSummarize}
              disabled={!hasContent || isLoading}
              className="min-w-[200px] gap-2 rounded-xl shadow-lg transition-all hover:shadow-xl"
            >
              {isLoading ? (
                <><Loader2 className="h-5 w-5 animate-spin" /> Processing...</>
              ) : (
                <><Sparkles className="h-5 w-5" /> Summarize</>
              )}
            </Button>
          </div>

          {/* Combined display to prevent duplicate headers */}
          {summary && (
            <div id="printable-summary" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Suspense fallback={<ComponentLoader />}>
                <SummaryResult
                  summary={summary}
                  isLoading={isLoading}
                />
              </Suspense>

              {!isLoading && (
                <Suspense fallback={<ComponentLoader />}>
                  <SummaryExportActions
                    summaryText={summary}
                    title="MindLink Summary"
                    onExportComplete={() => {}}
                  />
                </Suspense>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
