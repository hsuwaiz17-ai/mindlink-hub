import React, { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { SummaryResult } from "@/components/dashboard/SummaryResult";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    // AI Logic goes here
    setTimeout(() => {
      setSummary("Success! AI has analyzed your document.");
      setIsLoading(false);
      toast({ title: "Completed", description: "Analysis finished." });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">AI Study Assistant</h2>
        </div>
        <ImageUpload onUpload={handleImageUpload} isLoading={isLoading} />
        {summary && <SummaryResult summary={summary} isLoading={isLoading} />}
      </main>
    </div>
  );
};

export default Index;
