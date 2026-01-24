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
    const element = document.getElementById("printable-content");
    if (!element) return;

    try {
      toast.info("Preparing PDF...");
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("MindLink-Analysis.pdf");
      toast.success("PDF saved successfully!");
    } catch (error) {
      toast.error("Error generating PDF");
    }
  };

  if (isLoading) return <div className="p-12 text-center"><Loader2 className="animate-spin inline" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-4 bg-white/50 rounded-t-xl border-b">
        <h3 className="font-bold flex items-center gap-2"><FileText /> Analysis Result</h3>
        <Button onClick={handleDownloadPDF} size="sm"><Download className="mr-2 h-4 w-4" /> Export PDF</Button>
      </div>
      {/* ဤနေရာရှိ ID သည် PDF ထုတ်ရန် အဓိကဖြစ်သည် */}
      <div id="printable-content" className="p-6 bg-white rounded-b-xl text-black">
        <ReactMarkdown className="prose max-w-none">{summary}</ReactMarkdown>
      </div>
    </div>
  );
};

export default SummaryResult;
