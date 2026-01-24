import React from "react";
import { Loader2, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";

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

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Summary Result</h3>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Generating summary...</p>
        </div>
      ) : (
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default SummaryResult;
