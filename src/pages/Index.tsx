import React, { useState } from "react";
import { Header } from "@/components/dashboard/Header";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { SummaryResult } from "@/components/dashboard/SummaryResult";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Lightbulb, MessageSquare, GraduationCap } from "lucide-react";

const Index = () => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<string>("Summary");
  const { toast } = useToast();

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    // AI Logic မှာ 'mode' ကိုပါ ထည့်သွင်းပေးပို့ရမည်
    setTimeout(() => {
      setSummary(`### ${mode} Result\n\nဒီနေရာမှာ ${mode} အတွက် AI ရဲ့ ရလဒ်တွေ ပေါ်လာပါလိမ့်မယ်။`);
      setIsLoading(false);
      toast({ title: "Completed", description: `${mode} process finished.` });
    }, 2000);
  };

  const modes = [
    { id: "Summary", label: "အနှစ်ချုပ်", icon: <BookOpen className="w-4 h-4" /> },
    { id: "Solution", label: "အဖြေရှာ", icon: <Lightbulb className="w-4 h-4" /> },
    { id: "Explanation", label: "စကားပြေ", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "Theory", label: "သီအိုရီ", icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
        <section className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Study Partner</h1>
          <p className="text-muted-foreground text-sm">လုပ်ဆောင်လိုသည့် ပုံစံကို အရင်ရွေးချယ်ပါ</p>
        </section>

        {/* Mode Selection Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {modes.map((m) => (
            <Button
              key={m.id}
              variant={mode === m.id ? "default" : "outline"}
              onClick={() => setMode(m.id)}
              className="flex gap-2"
            >
              {m.icon} {m.label}
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
