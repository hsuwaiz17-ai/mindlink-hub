import { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { SummaryResult } from "@/components/dashboard/SummaryResult";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    try {
      // API ခေါ်ယူခြင်းနှင့် Summary လုပ်ငန်းစဉ်များကို ဤနေရာတွင် ဆောင်ရွက်သည်
      console.log("Processing file:", file.name);
      
      // မှတ်ချက်- သင်၏ လက်ရှိ API Logic ကို ဤနေရာတွင် ဆက်လက်ထားရှိပါ
      // ဥပမာ- const result = await processImage(file);
      // setSummary(result);

      toast({
        title: "Success",
        description: "Image processed successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process image. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8 animate-in fade-in duration-700">
          <section className="text-center space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              AI Study Assistant
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              သင်္ချာ၊ ဓာတုဗေဒ ပုစ္ဆာများနှင့် မှတ်စုများကို ဓာတ်ပုံရိုက်၍ အနှစ်ချုပ်ခိုင်းပါ။
            </p>
          </section>

          <ImageUpload onUpload={handleImageUpload} isLoading={isLoading} />

          {/* ဤနေရာတွင် summary ရှိမှသာ ပြသမည်ဖြစ်ပြီး ခေါင်းစဉ်အပိုကို ဖယ်ရှားထားပါသည် */}
          {summary && (
            <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
              <SummaryResult 
                summary={summary} 
                isLoading={isLoading} 
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
