import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Header } from "../components/dashboard/Header";
import { ImageUpload } from "../components/dashboard/ImageUpload";
import { SummaryResult } from "../components/dashboard/SummaryResult";
import { Globe, History, User, FileDown, Camera, Image as ImageIcon, FileText, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supportedLanguages } from "../i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("summary");
  const [resultLanguage, setResultLanguage] = useState(i18n.language);

  const exportToPDF = async () => {
    const element = document.getElementById("result-area");
    if (!element) return;
    setIsLoading(true);
    try {
      const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MindLink_Result_${Date.now()}.pdf`);
      toast.success(t('export_pdf_success') || "PDF Exported!");
    } catch (error) {
      toast.error("PDF export failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (file?: File) => {
    setIsLoading(true);
    setSummary(null); // အရင်ရှိနေတဲ့ Result ကို ဖျက်ပြီး Loading ပြမယ်

    try {
      toast.info(t('processing') || "Processing with Gemini AI...");
      
      // ဒီနေရာမှာ Backend (Supabase Functions) နဲ့ ချိတ်တဲ့ ကုဒ်ထည့်ရပါမယ်
      // အခုက Demo အနေနဲ့ Result ပေါ်အောင် လုပ်ပြထားတာပါ
      setTimeout(() => {
        const demoResult = `### ${t(activeMode)} ${t('result')}\n**${t('target_language')}:** ${resultLanguage}\n\n${t('demo_message') || "This is a real-time analysis result based on your selection."}`;
        setSummary(demoResult);
        setIsLoading(false);
        toast.success(t('analysis_complete') || "Complete!");
      }, 2000);

    } catch (err) {
      toast.error(t('error_processing') || "AI processing failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950">
      {/* Top Nav */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Button variant="ghost" onClick={() => navigate("/history")} className="gap-2 text-indigo-600 font-bold">
          <History className="w-5 h-5" /> {t('history')}
        </Button>
        <h1 className="text-xl font-extrabold text-indigo-600">MindLink</h1>
        <Button variant="ghost" onClick={() => navigate("/profile")} className="gap-2 text-indigo-600 font-bold">
          <User className="w-5 h-5" /> {t('profile')}
        </Button>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        
        {/* Input Buttons */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <Button variant="outline" className="flex-col h-20 rounded-2xl gap-1 bg-white dark:bg-slate-900 border-indigo-100">
            <Camera className="w-6 h-6 text-indigo-600" /> <span className="text-[10px]">{t('scan')}</span>
          </Button>
          <Button variant="outline" className="flex-col h-20 rounded-2xl gap-1 bg-white dark:bg-slate-900 border-indigo-100">
            <ImageIcon className="w-6 h-6 text-indigo-600" /> <span className="text-[10px]">{t('image')}</span>
          </Button>
          <Button variant="outline" className="flex-col h-20 rounded-2xl gap-1 bg-white dark:bg-slate-900 border-indigo-100">
            <FileText className="w-6 h-6 text-indigo-600" /> <span className="text-[10px]">{t('file')}</span>
          </Button>
          <Button variant="outline" className="flex-col h-20 rounded-2xl gap-1 bg-white dark:bg-slate-900 border-indigo-100">
            <Type className="w-6 h-6 text-indigo-600" /> <span className="text-[10px]">{t('text')}</span>
          </Button>
        </div>

        {/* Language Picker */}
        <div className="bg-indigo-600 p-4 rounded-2xl text-white flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Globe className="w-4 h-4" /> {t('result_language')}:
          </div>
          <select 
            className="bg-indigo-700 text-white text-sm border-none rounded-lg focus:ring-0 cursor-pointer"
            value={resultLanguage}
            onChange={(e) => setResultLanguage(e.target.value)}
          >
            {supportedLanguages.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>

        {/* Action Modes */}
        <div className="grid grid-cols-2 gap-3">
          {["summary", "solution", "explanation", "theory"].map((mode) => (
            <Button
              key={mode}
              variant={activeMode === mode ? "default" : "secondary"}
              onClick={() => setActiveMode(mode)}
              className={`h-12 rounded-xl font-bold transition-all ${
                activeMode === mode ? 'bg-indigo-600 shadow-md scale-105' : 'bg-white dark:bg-slate-900 border border-indigo-100'
              }`}
            >
              {t(mode)}
            </Button>
          ))}
        </div>

        {/* Upload Component */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800">
          <ImageUpload onUpload={handleAction} isLoading={isLoading} />
        </div>

        {/* Result Area */}
        <div id="result-area" className="relative min-h-[200px] bg-white dark:bg-slate-900 rounded-3xl p-6 border border-indigo-50 dark:border-slate-800 shadow-inner">
          {summary && (
            <div className="flex gap-2 justify-end mb-4">
              <Button size="sm" variant="outline" onClick={exportToPDF} className="rounded-lg border-indigo-200">
                <FileDown className="w-4 h-4 mr-1" /> {t('export_pdf')}
              </Button>
            </div>
          )}
          <SummaryResult summary={summary} isLoading={isLoading} />
        </div>

      </main>
    </div>
  );
};

export default Index;
