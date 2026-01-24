import React from "react";
import { Loader2, FileText, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface SummaryResultProps {
  summary: string;
  isLoading: boolean;
}

const SummaryResult = ({ summary, isLoading }: SummaryResultProps) => {
  const handleDownloadPDF = async () => {
    // Printable area ကို ဖမ်းယူခြင်း
    const element = document.getElementById("printable-summary");
    if (!element) {
      toast.error("Summary content not found");
      return;
    }

    try {
      toast.info("Generating high-quality PDF...");
      
      // HTML ကို ပုံရိပ် (Canvas) အဖြစ်ပြောင်းလဲခြင်း (Scale 2 က စာသားကို ကြည်လင်စေသည်)
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff" // PDF နောက်ခံကို အဖြူရောင်ထားခြင်း
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // ပုံရိပ်ကို PDF ထဲသို့ ထည့်သွင်းခြင်း (စာသားအဖြစ် မဟုတ်ဘဲ ပုံအဖြစ် ထည့်ခြင်းဖြစ်လို့ ပုံစံမပျက်ပါ)
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("MindLink-Summary.pdf");
      
      toast.success("PDF Downloaded successfully!");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-t-2xl border-b">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Analysis Result</h3>
        </div>
        <Button onClick={handleDownloadPDF} variant="default" size="sm" className="gap-2 shadow-sm">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* ဤ ID ပါသော Div သည် PDF ထဲသို့ ပုံအဖြစ် ရောက်သွားမည်ဖြစ်သည် */}
      <div 
        id="printable-summary" 
        className="glass-card rounded-b-2xl p-8 bg-white text-black leading-relaxed"
      >
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default SummaryResult;
