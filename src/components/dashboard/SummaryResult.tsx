// File: /workspaces/mindlink-hub/src/components/dashboard/SummaryResult.tsx
import React from "react";
import { Loader2, Copy, Check } from "lucide-react";

interface SummaryResultProps {
  summary: string | null;
  isLoading: boolean;
}

export const SummaryResult: React.FC<SummaryResultProps> = ({ 
  summary, 
  isLoading 
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
          <Loader2 className="w-6 h-6 mr-3 animate-spin text-indigo-600" />
          AI ခွဲခြမ်းစိတ်ဖြာနေသည်...
        </h3>
        <div className="space-y-4">
          <div className="h-4 bg-slate-200 rounded-full animate-pulse w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded-full animate-pulse w-full"></div>
          <div className="h-4 bg-slate-200 rounded-full animate-pulse w-5/6"></div>
          <div className="h-4 bg-slate-200 rounded-full animate-pulse w-4/5"></div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">ရလဒ်</h3>
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center bg-slate-100 rounded-full">
            <div className="text-slate-400 text-3xl">📄</div>
          </div>
          <p className="text-slate-500 text-lg">ဓာတ်ပုံတင်ပြီးရင် ရလဒ်က ဒီမှာပေါ်လာပါမယ်</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-slate-800">AI ခွဲခြမ်းစိတ်ဖြာချက်</h3>
        <button
          onClick={handleCopy}
          className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-green-600" />
              <span className="text-green-600 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      <div className="prose prose-lg max-w-none">
        <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-2xl p-6 border border-slate-200">
          <pre className="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed text-lg">
            {summary}
          </pre>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between text-slate-500">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <div className="text-indigo-600">🤖</div>
            </div>
            <div>
              <p className="font-medium">AI Study Assistant</p>
              <p className="text-sm">Generated just now</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✓ Verified
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              မြန်မာ
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
