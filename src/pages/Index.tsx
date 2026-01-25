import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Header } from "../components/dashboard/Header";
import { ImageUpload } from "../components/dashboard/ImageUpload";
import { SummaryResult } from "../components/dashboard/SummaryResult";
import { Globe, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const { t, i18n } = useTranslation();
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("summary");

  // AI ခွဲခြမ်းစိတ်ဖြာမှု လုပ်ဆောင်ချက်
  const handleAction = async (file?: File) => {
    setIsLoading(true);
    setTimeout(() => {
      setSummary(`### ${t(activeMode)} Result\n\nAI analysis completed using ${i18n.language.toUpperCase()} interface.`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
        {/* Language Selection Bar */}
        <div className="flex justify-end items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <Globe className="w-4 h-4 text-indigo-600" />
          <select 
            className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer font-medium"
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            value={i18n.language}
          >
            <option value="en">English</option>
            <option value="mm">မြန်မာ</option>
            <option value="zh">中文</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="th">ไทย</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>

        {/* AI Modes Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["summary", "solution", "explanation", "theory"].map((mode) => (
            <Button
              key={mode}
              variant={activeMode === mode ? "default" : "outline"}
              onClick={() => setActiveMode(mode)}
              className="h-14 rounded-2xl font-bold transition-all hover:scale-105"
            >
              {t(mode)}
            </Button>
          ))}
        </div>

        {/* Input System */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
          <h2 className="text-xl font-bold mb-6 text-center">{t('upload')}</h2>
          <ImageUpload onUpload={handleAction} isLoading={isLoading} />
        </div>

        {/* Result Area */}
        <SummaryResult summary={summary} isLoading={isLoading} />

        {/* Bottom Navigation for History & Settings */}
        <div className="flex justify-center gap-10 py-6 border-t border-slate-200 mt-10">
          <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium">
            <History className="w-5 h-5" /> {t('history')}
          </button>
          <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium">
            <Settings className="w-5 h-5" /> {t('settings')}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Index;
