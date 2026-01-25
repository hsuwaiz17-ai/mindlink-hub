import React, { useState } from "react";
import { useTranslation } from 'react-i18next'; // ဘာသာစကားပြောင်းရန် Hook ထည့်သွင်းခြင်း
import { Header } from "@/components/dashboard/Header";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { SummaryResult } from "@/components/dashboard/SummaryResult";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Search, MessageCircle, FileText, Globe } from "lucide-react"; // Globe icon ထည့်သွင်းခြင်း

const Index = () => {
  const { t, i18n } = useTranslation(); // Translation function (t) နှင့် i18n instance ကိုယူခြင်း
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("Summary");
  const { toast } = useToast();

  // ဘာသာစကားပြောင်းလဲသည့် function
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleImageUpload = async (file: File) => {
    setIsLoading(true);
    // AI Processing logic goes here
    setTimeout(() => {
      // t('Summary') စသည်ဖြင့် သုံးထားသောကြောင့် ဘာသာစကားလိုက်ပြောင်းပါမည်
      setSummary(`### ${t(activeMode)} Result\n\nAI မှ ${t(activeMode)} ပုံစံဖြင့် ခွဲခြမ်းစိတ်ဖြာပေးထားသော ရလဒ် ဤနေရာတွင် ပေါ်လာပါမည်။`);
      setIsLoading(false);
      toast({ title: "Completed", description: `${t(activeMode)} process successful.` });
    }, 2500);
  };

  // ဘာသာစကားအလိုက် ပြောင်းလဲမည့် modes စာရင်း
  const modes = [
    { id: "Summary", label: t("Summary"), icon: <BookOpen className="w-4 h-4" /> },
    { id: "Solution", label: t("Solution"), icon: <Search className="w-4 h-4" /> },
    { id: "Explanation", label: t("Explanation"), icon: <MessageCircle className="w-4 h-4" /> },
    { id: "Theory", label: t("Theory"), icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* --- ဘာသာစကားရွေးချယ်မှုအပိုင်း (Language Switcher) --- */}
      <div className="container mx-auto px-4 pt-6 flex justify-end items-center gap-2">
        <Globe className="w-4 h-4 text-slate-500" />
        <select 
          className="text-sm border-none bg-transparent font-medium text-slate-600 focus:ring-0 cursor-pointer"
          onChange={(e) => changeLanguage(e.target.value)}
          value={i18n.language}
        >
          <option value="en">English</option>
          <option value="mm">မြန်မာ</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
        </select>
      </div>
      {/* ------------------------------------------- */}

      <main className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
        <div className="text-center space-y-4">
          {/* t('app_title') စသည်ဖြင့် i18n ဖိုင်ထဲမှ စာသားများကို လှမ်းယူပါမည် */}
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('app_title') || "AI Study Assistant"}
          </h2>
          <p className="text-slate-500 text-lg font-medium">
            {t('choose_action') || "ဘာလုပ်ဆောင်လိုသလဲ ရွေးချယ်ပေးပါ"}
          </p>
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
