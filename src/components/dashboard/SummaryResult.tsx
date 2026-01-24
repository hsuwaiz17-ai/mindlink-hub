import React from "react";
import { Loader2, FileText, Download, Share2 } from "lucide-react";
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
  const handleDownloadPDF = async () => {
    // PDF ထုတ်မည့် နေရာကို ရှာခြင်း
    const element = document.getElementById("printable-content");
    if (!element) {
      toast.error("Content area not found");
      return;
    }

    try {
      toast.info("Generating High-Quality PDF...");
      
      // စာသားများကို ပုံရိပ်အဖြစ် ဖမ်းယူခြင်း (Scale 3 က စာကို ပိုကြည်စေသည်)
      const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // ပုံရိပ်ကို PDF ထဲသို့ ထည့်ခြင်း
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("MindLink-Analysis-Result.pdf");
      
      toast.success("PDF Downloaded successfully!");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/50 rounded-xl border-2 border-dashed border-primary/20 animate-pulse">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground font-medium">Analyzing your document...</p>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 rounded-t-xl border-b shadow-sm">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <h3 className="font-bold text-lg">Analysis Result</h3>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="hidden sm:flex">
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
          <Button size="sm" variant="ghost" onClick={() => toast.info("Coming soon!")}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Printable Area - ဤ ID သည် PDF ထုတ်ရန် အလွန်အရေးကြီးပါသည် */}
      <div 
        id="printable-content" 
        className="p-8 bg-white text-slate-900 rounded-b-xl shadow-lg leading-relaxed overflow-hidden"
      >
        <div className="prose prose-slate max-w-none 
          prose-headings:text-slate-900 prose-headings:font-bold
          prose-p:text-slate-700 prose-li:text-slate-700
          prose-strong:text-primary prose-code:text-blue-600">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      </div>

      {/* Mobile-only Download Button */}
      <Button onClick={handleDownloadPDF} className="w-full sm:hidden" size="lg">
        <Download className="mr-2 h-5 w-5" /> Download Analysis (PDF)
      </Button>
    </div>
  );
};

export default SummaryResult;
