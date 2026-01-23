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
  onImagesSelected?: (files: File[]) => void; // Prop အမည်ကို plural ပြောင်းထားပါတယ်
}

const ContentInput = ({ content, onContentChange, onImagesSelected }: ContentInputProps) => {
  const [activeMode, setActiveMode] = useState<InputMode>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // Array ဖြစ်သွားပါပြီ
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleModeSelect = (mode: InputMode) => {
    setActiveMode(mode);
    if (mode === "type") setSelectedImages([]);
    
    if (mode === "upload" && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (mode === "scan" && cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isCamera: boolean) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      
      // Image ဟုတ်မဟုတ် စစ်ဆေးခြင်း
      const invalidFile = newFiles.find(file => !file.type.startsWith("image/"));
      if (invalidFile) {
        toast.error("Please select image files only");
        return;
      }

      // Preview ပြရန်အတွက် FileReader ဖြင့်ဖတ်ခြင်း
      const newImagePreviews: string[] = [];
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          newImagePreviews.push(reader.result as string);
          if (newImagePreviews.length === newFiles.length) {
            setSelectedImages(prev => [...prev, ...newImagePreviews]);
          }
        };
        reader.readAsDataURL(file);
      });

      onImagesSelected?.(newFiles);
      setActiveMode(isCamera ? "scan" : "upload");
    }
    e.target.value = ""; // Reset input
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    if (selectedImages.length <= 1) setActiveMode(null);
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        multiple // ပုံအများကြီးရွေးနိုင်ရန်
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
          description="Add by camera"
          icon={ScanLine}
          isActive={activeMode === "scan"}
          onClick={() => handleModeSelect("scan")}
        />
        <GlassCard
          title="Upload Images"
          description="Select multiple"
          icon={ImagePlus}
          isActive={activeMode === "upload"}
          onClick={() => handleModeSelect("upload")}
        />
      </div>

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

      {(activeMode === "scan" || activeMode === "upload") && selectedImages.length > 0 && (
        <div className="glass-card rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {selectedImages.map((src, index) => (
              <div key={index} className="relative group">
                <img
                  src={src}
                  alt={`Selected ${index}`}
                  className="w-full h-32 object-cover rounded-lg border border-muted"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 text-center">
            {selectedImages.length} images selected - Ready for processing
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentInput;
