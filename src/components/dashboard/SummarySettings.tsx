import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Settings2 } from "lucide-react";

interface SummarySettingsProps {
  aiModel: string;
  language: string;
  onAiModelChange: (value: string) => void;
  onLanguageChange: (value: string) => void;
}

const AI_MODELS = [
  { value: "gemini-pro", label: "Gemini Pro" },
  { value: "gpt-4o", label: "GPT-4o" },
];

const LANGUAGES = [
  { value: "Myanmar", label: "Myanmar" },
  { value: "English", label: "English" },
  { value: "Korean", label: "Korean" },
  { value: "Japanese", label: "Japanese" },
  { value: "Chinese", label: "Chinese" },
];

const SummarySettings = ({
  aiModel,
  language,
  onAiModelChange,
  onLanguageChange,
}: SummarySettingsProps) => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Summary Preferences</h3>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ai-model" className="text-sm text-muted-foreground">
            AI Model
          </Label>
          <Select value={aiModel} onValueChange={onAiModelChange}>
            <SelectTrigger id="ai-model" className="w-full bg-background/50">
              <SelectValue placeholder="Select AI Model" />
            </SelectTrigger>
            <SelectContent>
              {AI_MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  {model.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language" className="text-sm text-muted-foreground">
            Target Language
          </Label>
          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger id="language" className="w-full bg-background/50">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SummarySettings;
