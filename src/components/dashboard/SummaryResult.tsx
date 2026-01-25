import React from "react";
import ReactMarkdown from "react-markdown";
import { Download, FileDown, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const SummaryResult = ({ summary, isLoading }: { summary: string | null, isLoading: boolean }) => {
  const exportResult = async (format: 'pdf' | 'png') => {
    const element = document.getElementById("result-content");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    if (format === 'pdf') {
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, 210, (canvas.height * 210) / canvas.width);
      pdf.save("Study-Analysis.pdf");
    } else {
      const link = document.createElement("a");
      link.download = "Study-Analysis.png"; link.href = imgData; link.click();
    }
  };

  if (isLoading) return <div className="text-center p-10 font-bold animate-pulse">Processing...</div>;
  if (!summary) return null;

  return (
    <div className="bg-white rounded-3xl shadow-lg border overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-slate-50 border-b">
        <span className="font-bold text-indigo-900">Analysis Result</span>
        <div className="flex gap-2">
          <Button onClick={() => exportResult('pdf')} size="sm" variant="outline" className="text-red-600 border-red-200">
            <FileDown className="w-4 h-4 mr-2" /> PDF
          </Button>
          <Button onClick={() => exportResult('png')} size="sm" variant="outline" className="text-blue-600 border-blue-200">
            <ImageIcon className="w-4 h-4 mr-2" /> PNG
          </Button>
        </div>
      </div>
      <div id="result-content" className="p-10 prose max-w-none bg-white">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  );
};
