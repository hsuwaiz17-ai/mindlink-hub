import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Header } from "../components/dashboard/Header";
import { ImageUpload } from "../components/dashboard/ImageUpload";
import { SummaryResult } from "../components/dashboard/SummaryResult";
import { Globe, History, Settings, FileDown } from "lucide-react"; // FileDown ထပ်ပေါင်းထားတယ်
import { Button } from "@/components/ui/button";
import { supportedLanguages } from "../i18n"; // i18n ဖိုင်က list ကိုယူသုံးမယ်
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf"; // PDF အတွက် library
import html2canvas from "html2canvas";

const Index = () => {
  const { t, i18n } = useTranslation();
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("summary");

  // PDF အဖြစ် သိမ်းဆည်းရန် လုပ်ဆောင်ချက် (Layout မပျက်စေရန် html2canvas သုံးထားသည်)
  const exportToPDF = async () => {
    const element = document.getElementById("result-area");
    if (!element) return;
    
    setIsLoading(true);
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MindLink_${activeMode}_${Date.now()}.pdf`);
      toast.success("PDF saved successfully!");
    } catch (error) {
      toast.error("Failed to export PDF");
    } finally {
      setIsLoading(false);
    }
  };

  // Gemini AI နှင့် ချိတ်ဆက်ရန် လုပ်ဆောင်ချက်
  const handleAction = async (file?: File) => {
    setIsLoading(true);
    try {
      // ၁။ ပုံပါလျှင် Base64 ပြောင်းခြင်း (OCR/Scan အတွက်)
      let base64Image = "";
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        base64Image = await new Promise((resolve) => {
          reader.onload = () => resolve(reader.result as string);
        });
      }

      // ၂။ Supabase ကတစ်ဆင့် Gemini ခေါ်ခြင်း (သို့မဟုတ် Edge Function)
      // ဒီနေရာမှာ သင့်ရဲ့ Gemini API logic ကို ထည့်ပါမယ်
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { 
          mode: activeMode, 
          image: base64Image,
          language: i18n.language // User ရွေးထားတဲ့ ဘာသာစကားနဲ့ Result ထွက်အောင် ပို့ပေးမယ်
        },
      });

      if (error) throw error;

      setSummary(data.result);
      toast.success("Analysis complete!");
    } catch (error: any) {
      // လက်ရှိ API မချိတ်ရသေးခင် Demo အနေနဲ့ ပြသရန်
      setTimeout(() => {
        setSummary(`### ${t(activeMode)} Result (${i18n.language.toUpperCase()})\n\nThis is a sample result. Please connect your Gemini API in Supabase to see real-time analysis.`);
        setIsLoading(false);
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-8">
        {/* Global Language Selection Bar */}
        <div className="flex justify-end items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
          <Globe className="w-4 h-4 text-indigo-600" />
          <select 
            className="text-sm bg-transparent border-none focus:ring-0 cursor-pointer font-medium"
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            value={i18n.language}
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
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

        {/* Result Area with Export Button */}
        <div id="result-area" className="relative">
          {summary && (
            <div className="absolute right-4 top-4 z-10">
              <Button size="sm" variant="secondary" onClick={exportToPDF} className="gap-2">
                <FileDown className="w-4 h-4" /> {t('export_pdf')}
              </Button>
            </div>
          )}
          <SummaryResult summary={summary} isLoading={isLoading} />
        </div>

        {/* Bottom Navigation */}
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
