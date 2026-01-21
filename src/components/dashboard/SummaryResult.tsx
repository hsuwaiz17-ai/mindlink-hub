import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Button } from "@/components/ui/button";
import { Download, FileImage, FileText, Loader2, Copy, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import jsPDF from "jspdf";
import * as htmlToImage from "html-to-image";

interface SummaryResultProps {
  summary: string;
  isLoading?: boolean;
  onExportComplete?: (url: string, type: "pdf" | "image") => void;
}

const SummaryResult = ({ summary, isLoading, onExportComplete }: SummaryResultProps) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const handleExportPDF = async () => {
    if (!resultRef.current) return;
    
    setIsExporting(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const maxWidth = pageWidth - margin * 2;
      
      pdf.setFontSize(12);
      const lines = pdf.splitTextToSize(summary, maxWidth);
      
      let y = margin;
      const lineHeight = 7;
      
      for (const line of lines) {
        if (y + lineHeight > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, margin, y);
        y += lineHeight;
      }
      
      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      
      // Download the file
      const link = document.createElement("a");
      link.href = url;
      link.download = `mindlink-summary-${Date.now()}.pdf`;
      link.click();
      
      toast.success("PDF exported successfully");
      onExportComplete?.(url, "pdf");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportImage = async () => {
    if (!resultRef.current) return;
    
    setIsExporting(true);
    try {
      const dataUrl = await htmlToImage.toPng(resultRef.current, {
        backgroundColor: "#ffffff",
        pixelRatio: 2,
      });
      
      // Download the file
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `mindlink-summary-${Date.now()}.png`;
      link.click();
      
      toast.success("Image exported successfully");
      onExportComplete?.(dataUrl, "image");
    } catch (error) {
      console.error("Image export error:", error);
      toast.error("Failed to export image");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-8">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-muted animate-pulse" />
            <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-spin" />
          </div>
          <div className="text-center">
            <p className="font-medium text-foreground">Processing your content...</p>
            <p className="text-sm text-muted-foreground mt-1">
              AI is analyzing and summarizing
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <h3 className="font-semibold text-foreground">Summary Result</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isExporting}>
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Save as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportImage}>
                <FileImage className="h-4 w-4 mr-2" />
                Save as Image
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div ref={resultRef} className="p-6 bg-background">
        <div className="markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {summary}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default SummaryResult;
