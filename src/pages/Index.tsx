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

  // PDF အား ကြည်လင်ပြတ်သားစွာ ထုတ်ယူရန် (Scale ကို မြှင့်ထားသည်)
  const exportToPDF = async () => {
    const element = document.getElementById("result-area");
    if (!element) return;
    setIsLoading(true);
    try {
      const canvas = await html2canvas(element, { 
        scale: 3, // Clarity အတွက် scale မြှင့်ထားသည်
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`MindLink_Result_${Date.now()}.pdf`);
      toast.success("High-quality PDF exported!");
    } catch (error) {
      toast.error("PDF export failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (file?: File) => {
    setIsLoading(true);
    // Gemini API Logic (မင်းရဲ့ Supabase Edge Function 'gemini-ai' နဲ့ ချိတ်ဆက်မည်)
    try {
      // API call logic goes here...
      toast.info("Processing with Gemini AI...");
      // Demo Result (Backend မပြီးမချင်း)
      setTimeout(() => {
        setSummary(`### ${activeMode.toUpperCase()} Result\nTarget Language: ${resultLanguage}\n\nThis is a processed response from MindLink AI.`);
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      toast.error("AI processing failed");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top Navigation Bar: History & Profile */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Button variant="ghost" onClick={() => navigate("/history")} className="gap-2 text-indigo-600 font-bold">
          <History className="w-5 h-5" /> History
        </Button>
        <h1 className="text-xl font-extrabold text-indigo-600">MindLink</h1>
        <Button variant="ghost" onClick={() => navigate("/profile")} className="gap-2 text-indigo-600 font-bold">
          <User className="w-5 h-5" /> Profile
        </Button>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
        
        {/* Input Type Selection (Camera, Image, File, Text) */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <Button variant="outline" className="flex-col h-20 rounded-2xl gap-1 border-indigo-100 bg-white hover:bg-indigo-50">
            <Camera className="w-6 h-6 text-indigo-600" /> <span className="text-[10px]">Scan</span>
          </Button>
          <Button variant="outline" className="flex-col h-20 rounded-2xl gap-1 border-indigo-100 bg-white hover:bg-indigo-50">
            <ImageIcon className="w-6 h-6 text-indigo-600" /> <span className="text-[10px]">Image</span>
          </Button>
          <Button variant="outline" className="flex-col h-20 rounded-2xl gap-1 border-indigo-100 bg-white hover:bg-indigo-50">
            <FileText className="w-6 h-6 text-indigo-600" /> <span className="text-[10px]">File</span>
          </Button>
          <Button variant="outline" className="flex-col h-20 rounded-2xl gap-1 border-indigo-100 bg-white hover:bg-indigo-50">
            <Type className="w-6 h-6 text-indigo-600" /> <span className="text-[10px]">Text</span>
          </Button>
        </div>

        {/* Result Language Picker */}
        <div className="bg-indigo-600 p-4 rounded-2xl text-white flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Globe className="w-4 h-4" /> Result Language:
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

        {/* Action Buttons (Summary, Answer, etc.) */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "summary", label: "အနှစ်ချုပ်" },
            { id: "solution", label: "အဖြေရှာ" },
            { id: "explanation", label: "စကားပြေပြန်" },
            { id: "theory", label: "သီအိုရီရှင်းတမ်း" }
          ].map((mode) => (
            <Button
              key={mode.id}
              variant={activeMode === mode.id ? "default" : "secondary"}
              onClick={() => setActiveMode(mode.id)}
              className={`h-12 rounded-xl font-bold transition-all ${activeMode === mode.id ? 'bg-indigo-600 shadow-lg scale-105' : 'bg-white border border-indigo-100'}`}
            >
              {mode.label}
            </Button>
          ))}
        </div>

        {/* Upload & Loading Area */}
        <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
          <ImageUpload onUpload={handleAction} isLoading={isLoading} />
        </div>

        {/* Result Area */}
        <div id="result-area" className="relative min-h-[200px] bg-white rounded-3xl p-6 border border-indigo-50 shadow-inner">
          {summary && (
            <div className="flex gap-2 justify-end mb-4 no-print">
              <Button size="sm" variant="outline" onClick={() => toast.info("Image save feature coming soon!")} className="rounded-lg border-indigo-200">
                <ImageIcon className="w-4 h-4 mr-1" /> Save Image
              </Button>
              <Button size="sm" variant="outline" onClick={exportToPDF} className="rounded-lg border-indigo-200">
                <FileDown className="w-4 h-4 mr-1" /> Save PDF
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
