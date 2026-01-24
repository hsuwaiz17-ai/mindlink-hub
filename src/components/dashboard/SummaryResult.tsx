import React from "react";
import { Download, Image as ImageIcon, FileText, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface SummaryResultProps {
  summary: string;
  isLoading: boolean;
}

export const SummaryResult = ({ summary, isLoading }: SummaryResultProps) => {
  const exportFile = async (format: 'pdf' | 'png') => {
    // PDF ထုတ်မည့် ဧရိယာကို ID ဖြင့် တိတိကျကျ သတ်မှတ်ထားသည်
    const element = document.getElementById("printable-content");
    if (!element) return;

    try {
      toast.info(`Generating High-Quality ${format.toUpperCase()}...`);
      
      // စာသားနှင့် ပုံသေနည်းများ မပျက်စေရန် High Resolution (Scale 3) ဖြင့် ပုံဖမ်းခြင်း
      const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
      });
      
      const imgData = canvas.toDataURL("image/png");

      if (format === 'pdf') {
        // A4 Size PDF ဖန်တီးခြင်း
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // ပုံရိပ်ကို PDF ထဲသို့ ထည့်ခြင်း (မူရင်းပုံစံအတိုင်း ရှိနေမည်)
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("MindLink-Analysis-Result.pdf");
      } else {
        // Image အနေဖြင့် သိမ်းဆည်းခြင်း
        const link = document.createElement('a');
        link.download = 'MindLink-Analysis-Result.png';
        link.href = imgData;
        link.click();
      }
      toast.success("Saved successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed. Please try again.");
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-12 bg-white/50 rounded-xl border-2 border-dashed border-primary/20">
      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
      <p className="text-muted-foreground font-medium">Processing High Quality Result...</p>
    </div>
  );

  if (!summary) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      {/* Control Panel */}
      <div className="flex items-center justify-between p-4 bg-slate-50 border-b">
        <h3 className="font-bold text-slate-700 flex items-center gap-2">
          <FileText className="w-4 h-4" /> Analysis Result
        </h3>
        <div className="flex gap-2">
          <Button onClick={() => exportFile('pdf')} variant="default" size="sm" className="bg-red-600 hover:bg-red-700">
            <Download className="w-4 h-4 mr-2" /> Save PDF
          </Button>
          <Button onClick={() => exportFile('png')} variant="outline" size="sm">
            <ImageIcon className="w-4 h-4 mr-2" /> Save Image
          </Button>
        </div>
      </div>

      {/* Printable Area - ဤ ID ကို html2canvas က အသုံးပြုမည်ဖြစ်သည် */}
      <div 
        id="printable-content" 
        className="p-10 bg-white text-slate-900 leading-relaxed overflow-x-auto"
      >
        <div className="prose prose-slate max-w-none 
          prose-headings:text-slate-900 prose-headings:font-bold
          prose-p:text-slate-700 prose-strong:text-primary
          prose-code:bg-slate-100 prose-code:p-1 prose-code:rounded">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default SummaryResult;
