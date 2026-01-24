import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import SummaryResult from "@/components/dashboard/SummaryResult";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    // ဤနေရာတွင် သင်၏ API Calling logic များ ထည့်သွင်းရန်
    setTimeout(() => {
      setSummary("### Summary Example\nမြန်မာစာနှင့် Chemistry Formula: $E = mc^2$\n\nအနှစ်ချုပ် ရလဒ် ဤနေရာတွင် ပေါ်မည်။");
      setIsLoading(false);
      toast({ title: "Completed", description: "Analysis finished successfully!" });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            MindLink AI Assistant
          </h1>
          <p className="text-slate-500">Scan သင်္ချာနှင့် ဓာတုဗေဒ ပုစ္ဆာများကို ဓာတ်ပုံရိုက်ပြီး အဖြေရှာပါ။</p>
        </div>

        <ImageUpload onUpload={handleImageUpload} isLoading={isLoading} />

        {summary && (
          <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
            <SummaryResult summary={summary} isLoading={isLoading} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
