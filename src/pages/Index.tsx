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
    // AI Processing logic goes here
    setTimeout(() => {
      setSummary(`### ${activeMode} Result\n\nAI မှ ${activeMode} ပုံစံဖြင့် ခွဲခြမ်းစိတ်ဖြာပေးထားသော ရလဒ် ဤနေရာတွင် ပေါ်လာပါမည်။`);
      setIsLoading(false);
      toast({ title: "Completed", description: `${activeMode} process successful.` });
    }, 2500);
  };

  const modes = [
    { id: "Summary", label: "အနှစ်ချုပ်", icon: <BookOpen className="w-4 h-4" /> },
    { id: "Solution", label: "အဖြေရှာ", icon: <Search className="w-4 h-4" /> },
    { id: "Explanation", label: "စကားပြေ", icon: <MessageCircle className="w-4 h-4" /> },
    { id: "Theory", label: "သီအိုရီ", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">AI Study Assistant</h2>
          <p className="text-slate-500 text-lg font-medium">ဘာလုပ်ဆောင်လိုသလဲ ရွေးချယ်ပေးပါ</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {modes.map((m) => (
            <Button
              key={m.id}
              variant={activeMode === m.id ? "default" : "secondary"}
              onClick={() => setActiveMode(m.id)}
              className={`rounded-full px-8 py-6 text-md font-bold transition-all ${
                activeMode === m.id ? "bg-indigo-600 shadow-indigo-200 shadow-xl scale-105" : "hover:bg-slate-200"
              }`}
            >
              <span className="mr-2">{m.icon}</span> {m.label}
            </Button>
          ))}
        </div>

        <div className="bg-white p-2 rounded-[2rem] shadow-2xl shadow-slate-200">
          <ImageUpload onUpload={handleImageUpload} isLoading={isLoading} />
        </div>

        {summary && <SummaryResult summary={summary} isLoading={isLoading} />}
      </main>
    </div>
  );
};

export default Index;
