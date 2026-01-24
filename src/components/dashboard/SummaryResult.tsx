
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

const SummaryResult = ({
  summary,
  isLoading,
}: SummaryResultProps) => {
  if (!summary && !isLoading) {
    return null;
  }

  const exportToPDF = async () => {
    const element = document.getElementById('printable-summary-content');
    if (!element) {
      toast.error("Export element not found");
      return;
    }

    try {
      toast.info("Preparing your PDF...");
      
      // Screen ပေါ်ကအတိုင်း Snapshot ရိုက်ခြင်း
      const canvas = await html2canvas(element, {
        scale: 2, // စာသားကြည်လင်စေရန်
        useCORS: true,
        backgroundColor: "#ffffff" // PDF နောက်ခံကို အဖြူရောင်ထားခြင်း
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('MindLink-Summary.pdf');
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Summary Result</h3>
        </div>
        
        {summary && !isLoading && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToPDF}
            className="gap-2 border-primary/20 hover:bg-primary/10"
          >
            <Download className="h-4 w-4" />
            Save PDF
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Generating summary...</p>
        </div>
      ) : (
        <div 
          id="printable-summary-content" 
          className="prose prose-sm dark:prose-invert max-w-none p-2 bg-white dark:bg-transparent rounded-lg"
        >
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default SummaryResult;