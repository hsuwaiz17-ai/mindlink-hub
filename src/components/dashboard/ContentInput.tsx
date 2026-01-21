import { useState, useRef } from "react";
import { FileText, ScanLine, ImagePlus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import GlassCard from "./GlassCard";

type InputMode = "type" | "scan" | "upload" | null;

interface ContentInputProps {
  content: string;
  onContentChange: (content: string) => void;
  onImageSelected?: (file: File) => void;
}

const ContentInput = ({ content, onContentChange, onImageSelected }: ContentInputProps) => {
  const [activeMode, setActiveMode] = useState<InputMode>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleModeSelect = (mode: InputMode) => {
    setActiveMode(mode);
    setSelectedImage(null);
    
    if (mode === "upload" && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (mode === "scan" && cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isCamera: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setActiveMode(isCamera ? "scan" : "upload");
      };
      reader.readAsDataURL(file);
      
      onImageSelected?.(file);
    }
    // Reset input
    e.target.value = "";
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setActiveMode(null);
  };

  return (
    <div className="space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileChange(e, false)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileChange(e, true)}
      />

      {/* Mode selection cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <GlassCard
          title="Type Content"
          description="Enter text manually"
          icon={FileText}
          isActive={activeMode === "type"}
          onClick={() => handleModeSelect("type")}
        />
        <GlassCard
          title="Scan Document"
          description="Use camera for OCR"
          icon={ScanLine}
          isActive={activeMode === "scan"}
          onClick={() => handleModeSelect("scan")}
        />
        <GlassCard
          title="Upload Image"
          description="Select from gallery"
          icon={ImagePlus}
          isActive={activeMode === "upload"}
          onClick={() => handleModeSelect("upload")}
        />
      </div>

      {/* Content area based on mode */}
      {activeMode === "type" && (
        <div className="glass-card rounded-2xl p-4">
          <Textarea
            placeholder="Enter or paste your content here..."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
          />
        </div>
      )}

      {(activeMode === "scan" || activeMode === "upload") && selectedImage && (
        <div className="glass-card rounded-2xl p-4">
          <div className="relative">
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full max-h-[300px] object-contain rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
              onClick={handleClearImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-3 text-center">
            {activeMode === "scan" ? "Document captured" : "Image selected"} - Ready for processing
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentInput;
