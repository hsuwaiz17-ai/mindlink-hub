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
    // PDF ထုတ်မည့် Element ကို ရှာခြင်း
    const element = document.getElementById("printable-summary");
    if (!element) {
      toast.error("Summary content not found");
      return;
    }

    try {
      const loadingToast = toast.loading("Generating high-quality PDF...");
      
      // Canvas အဖြစ်ပြောင်းလဲခြင်း (Scale 3 က စာသားကို ပိုမိုကြည်လင်စေသည်)
      const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Analysis-Report.pdf");
      
      toast.dismiss(loadingToast);
      toast.success("PDF Downloaded successfully!");
    } catch (error) {
      console.error("PDF Error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  // ခေါင်းစဉ်နှစ်ခုမထပ်စေရန်နှင့် စာသားများ မပျောက်စေရန် ဤ function ကို ရှင်းလင်းလိုက်သည်
  const getDisplayContent = (text: string) => {
    if (!text) return "";
    // "MindLink Summary" ဆိုတဲ့ စာသားအပိုပါလာရင် ဖယ်ထုတ်ပေးခြင်း
    return text.replace(/### MindLink Summary/g, "").trim();
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
      <div className="flex items-center justify-between bg-secondary/30 p-4 rounded-t-2xl border-b no-print">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Analysis Result</h3>
        </div>
        <Button onClick={handleDownloadPDF} variant="default" size="sm" className="gap-2 shadow-sm">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <div 
        id="printable-summary" 
        className="glass-card rounded-b-2xl p-10 bg-white text-black leading-relaxed"
        style={{ minHeight: "200px" }}
      >
        <div className="prose prose-slate max-w-none prose-headings:text-black prose-p:text-black">
          <ReactMarkdown>{getDisplayContent(summary)}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default SummaryResult;
