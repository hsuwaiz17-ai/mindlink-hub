import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Settings2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const AI_MODELS = [
  { value: "gemini-1.5-flash", label: "Gemini Flash", desc: "Fast & Efficient" },
  { value: "gemini-1.5-pro", label: "Gemini Pro", desc: "High Accuracy" },
];

const LANGUAGES = [
  { value: "Myanmar", label: "🇲🇲 Myanmar" },
  { value: "English", label: "🇺🇸 English" },
  { value: "Korean", label: "🇰🇷 Korean" },
  { value: "Japanese", label: "🇯🇵 Japanese" },
];

const SummarySettings = ({ aiModel, language, onAiModelChange, onLanguageChange }: any) => {
  return (
    <div className="bg-[#0D1528]/50 backdrop-blur-xl border border-blue-500/10 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Settings2 className="h-5 w-5 text-blue-500" />
        </div>
        <h3 className="font-bold text-white tracking-tight">Summary Preferences</h3>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-3">
          <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Intelligence</Label>
          <Select value={aiModel} onValueChange={onAiModelChange}>
            <SelectTrigger className="bg-[#050A18] border-blue-500/20 text-white h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0D1528] border-blue-500/20 text-white">
              {AI_MODELS.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{m.label}</span>
                    <span className="text-[10px] text-slate-500">{m.desc}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Output Language</Label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="bg-[#050A18] border-blue-500/20 text-white h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0D1528] border-blue-500/20 text-white">
              {LANGUAGES.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SummarySettings;