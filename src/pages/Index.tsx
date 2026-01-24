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
  const [activeMode, setActiveMode] = useState("Summary");
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    toast({ title: "Processing...", description: `${activeMode} Mode အသုံးပြုနေပါသည်။` });
    
    // AI Processing Logic (Simulation)
    setTimeout(() => {
      setSummary(`### ${activeMode} Result\n\nAI မှ ${activeMode} အလိုက် ပြင်ဆင်ပေးထားသော ရလဒ် ဤနေရာတွင် ပေါ်လာပါမည်။`);
      setIsLoading(false);
    }, 2500);
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
      <main className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Academic Assistant</h2>
          <p className="text-slate-500 text-lg">လုပ်ဆောင်လိုသည့် ပုံစံကို ရွေးချယ်ပြီး ပုံတင်ပါ</p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex flex-wrap justify-center gap-3">
          {modes.map((mode) => (
            <Button
              key={mode.id}
              variant={activeMode === mode.id ? "default" : "secondary"}
              onClick={() => setActiveMode(mode.id)}
              className={`rounded-full px-6 py-5 flex gap-2 transition-all ${
                activeMode === mode.id ? "bg-indigo-600 hover:bg-indigo-700 shadow-md" : ""
              }`}
            >
              {mode.icon} {mode.label}
            </Button>
          ))}
        </div>

        <ImageUpload onUpload={handleImageUpload} isLoading={isLoading} />

        {summary && (
          <SummaryResult summary={summary} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
};

export default Index;
