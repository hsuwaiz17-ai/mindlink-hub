import ReactMarkdown from "react-markdown";
import { FileDown, ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export const SummaryResult = ({ summary, isLoading }: { summary: string | null, isLoading: boolean }) => {
  const exportResult = async (format: 'pdf' | 'png') => {
    const element = document.getElementById("result-content");
    if (!element) return;

    const toastId = toast.loading("Generating file...");
    try {
      const canvas = await html2canvas(element, { 
        scale: 3, 
        useCORS: true,
        backgroundColor: "#ffffff" 
      });
      const imgData = canvas.toDataURL("image/png");

      if (format === 'pdf') {
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save("MindLink-Analysis.pdf");
      } else {
        const link = document.createElement("a");
        link.download = "MindLink-Analysis.png";
        link.href = imgData;
        link.click();
      }
      toast.success("Export successful!", { id: toastId });
    } catch (error) {
      toast.error("Export failed", { id: toastId });
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      <p className="text-blue-500 font-bold animate-pulse uppercase tracking-widest text-xs">MindLink is thinking...</p>
    </div>
  );

  if (!summary) return null;

  return (
    <div className="mt-8 bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center p-6 bg-slate-50/50 border-b border-slate-100">
        <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg">Analysis Result</h3>
        <div className="flex gap-2">
          <Button onClick={() => exportResult('pdf')} size="sm" variant="outline" className="rounded-xl border-red-100 text-red-600 hover:bg-red-50">
            <FileDown className="w-4 h-4 mr-2" /> PDF
          </Button>
          <Button onClick={() => exportResult('png')} size="sm" variant="outline" className="rounded-xl border-blue-100 text-blue-600 hover:bg-blue-50">
            <ImageIcon className="w-4 h-4 mr-2" /> PNG
          </Button>
        </div>
      </div>
      <div id="result-content" className="p-10 prose prose-blue max-w-none text-slate-700 leading-relaxed font-myanmar">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  );
};