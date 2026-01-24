import React from "react";
import { Download, FileDown, ImageIcon, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const SummaryResult = ({ summary, isLoading }: { summary: string, isLoading: boolean }) => {
  const exportFile = async (type: 'pdf' | 'png') => {
    const element = document.getElementById("result-box");
    if (!element) return;
    try {
      toast.info(`${type.toUpperCase()} ထုတ်နေပါသည်...`);
      const canvas = await html2canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");

      if (type === 'pdf') {
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("Result.pdf");
      } else {
        const link = document.createElement("a");
        link.download = "Result.png";
        link.href = imgData;
        link.click();
      }
      toast.success("Done!");
    } catch (e) { toast.error("Error: " + e); }
  };

  if (isLoading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="border rounded-xl shadow-lg overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-slate-50 border-b">
        <span className="font-bold">Result</span>
        <div className="flex gap-2">
          <Button onClick={() => exportFile('pdf')} size="sm" variant="outline" className="text-red-600"><FileDown className="w-4 h-4 mr-1" /> PDF</Button>
          <Button onClick={() => exportFile('png')} size="sm" variant="outline" className="text-blue-600"><ImageIcon className="w-4 h-4 mr-1" /> Image</Button>
        </div>
      </div>
      <div id="result-box" className="p-8 bg-white prose prose-indigo max-w-none">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  );
};
