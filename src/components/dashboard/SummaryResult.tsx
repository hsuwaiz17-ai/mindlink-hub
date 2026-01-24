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
  onExportComplete?: () => void;
}

const SummaryResult = ({ summary, isLoading }: SummaryResultProps) => {
  const handleDownloadPDF = async () => {
    const element = document.getElementById("summary-content");
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("MindLink-Summary.pdf");
      toast.success("PDF Downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF");
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
    <div className="glass-card rounded-2xl p-6 space-y-4 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-lg">Summary Result</h3>
        </div>
        <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export PDF
        </Button>
      </div>
      <div id="summary-content" className="prose prose-sm max-w-none dark:prose-invert">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  );
};

export default SummaryResult;
