import React, { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { ImageUpload } from "@/components/dashboard/ImageUpload"; // လမ်းကြောင်းမှန်အောင် စစ်ပါ
import { SummaryResult } from "@/components/dashboard/SummaryResult";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    // API logic များကို ဤနေရာတွင် ဆက်လက်ထားရှိပါ
    setTimeout(() => {
      setSummary("Upload Success! Analysis will start here.");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-6 max-w-2xl">
        <ImageUpload onUpload={handleImageUpload} isLoading={isLoading} />
        {summary && <SummaryResult summary={summary} isLoading={isLoading} />}
      </main>
    </div>
  );
};

export default Index;
