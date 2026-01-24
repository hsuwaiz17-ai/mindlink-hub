import React from "react";
import { Download, FileDown, ImageIcon, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const SummaryResult = ({ summary, isLoading }: { summary: string, isLoading: boolean }) => {
  const handleExport = async (type: 'pdf' | 'png') => {
    const element = document.getElementById("result-box");
    if (!element) return;
    try {
      toast.info(`${type.toUpperCase()} ဖန်တီးနေပါသည်...`);
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      if (type === 'pdf') {
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("Study-Result.pdf");
      } else {
        const link = document.createElement("a");
        link.download = "Study-Result.png";
        link.href = imgData;
        link.click();
      }
      toast.success("Successfully saved!");
    } catch (e) {
      toast.error("Export Error: " + e);
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin h-10 w-10 text-indigo-600" /></div>;

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between p-5 bg-slate-50 border-b gap-4">
        <h3 className="font-bold text-slate-800">Analysis Result</h3>
        <div className="flex gap-2">
          <Button onClick={() => handleExport('pdf')} size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
            <FileDown className="w-4 h-4 mr-2" /> PDF ဖြင့်သိမ်းမည်
          </Button>
          <Button onClick={() => handleExport('png')} size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
            <ImageIcon className="w-4 h-4 mr-2" /> ပုံဖြင့်သိမ်းမည်
          </Button>
        </div>
      </div>
      <div id="result-box" className="p-10 bg-white">
        <div className="prose prose-indigo max-w-none prose-headings:font-bold prose-p:text-slate-700">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
