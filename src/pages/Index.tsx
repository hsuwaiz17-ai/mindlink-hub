import React, { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { SummaryResult } from "@/components/dashboard/SummaryResult";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Search, MessageCircle, FileText } from "lucide-react";

const Index = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("Summary");
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    setTimeout(() => {
      setSummary(`### ${mode} Result\n\nAI မှ ${mode} ပုံစံဖြင့် ခွဲခြမ်းစိတ်ဖြာပေးထားသော ရလဒ် ဤနေရာတွင် ပေါ်လာပါမည်။`);
      setIsLoading(false);
    }, 2000);
  };

  const modes = [
    { id: "Summary", label: "အနှစ်ချုပ်", icon: <BookOpen className="w-4 h-4" /> },
    { id: "Solution", label: "အဖြေရှာ", icon: <Search className="w-4 h-4" /> },
    { id: "Explanation", label: "စကားပြေ", icon: <MessageCircle className="w-4 h-4" /> },
    { id: "Theory", label: "သီအိုရီ", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
        <div className="flex flex-wrap justify-center gap-2">
          {modes.map((m) => (
            <Button
              key={m.id}
              variant={mode === m.id ? "default" : "outline"}
              onClick={() => setMode(m.id)}
              className="flex gap-2 rounded-full"
            >
              {m.icon} {m.label}
            </Button>
          ))}
        </div>
        <ImageUpload onUpload={handleImageUpload} isLoading={isLoading} />
        {summary && <SummaryResult summary={summary} isLoading={isLoading} />}
      </main>
    </div>
  );
};

export default Index;
