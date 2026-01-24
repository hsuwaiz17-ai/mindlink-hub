import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Camera, 
  Upload, 
  X,
  Image as ImageIcon 
} from "lucide-react";
import { toast } from "sonner";

interface ContentInputProps {
  content: string;
  onContentChange: (content: string) => void;
  onImagesSelected?: (files: File[]) => void;
}

type InputMode = "text" | "scan" | "upload";

const ContentInput = ({
  content,
  onContentChange,
  onImagesSelected,
}: ContentInputProps) => {
  const [activeMode, setActiveMode] = useState<InputMode>("text");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isCamera: boolean
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);

    // Check if all files are images
    const invalidFile = newFiles.find(
      (file) => !file.type.startsWith("image/")
    );
    if (invalidFile) {
      toast.error("Please select image files only");
      return;
    }

    try {
      // Read all images concurrently and get preview URLs
      const previewPromises = newFiles.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });

      const newImagePreviews = await Promise.all(previewPromises);

      // Update states
      setSelectedImages((prev) => [...prev, ...newImagePreviews]);
      onImagesSelected?.(newFiles);

      // Keep scan mode if camera, otherwise switch to upload mode
      setActiveMode(isCamera ? "scan" : "upload");
    } catch (error) {
      console.error("Error reading files:", error);
      toast.error("Failed to process some images");
    } finally {
      // Reset input to allow re-selecting the same file
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setSelectedImages([]);
    onContentChange("");
  };

  const modes = [
    {
      id: "text" as InputMode,
      label: "Type Content",
      icon: FileText,
    },
    {
      id: "scan" as InputMode,
      label: "Scan Document",
      icon: Camera,
    },
    {
      id: "upload" as InputMode,
      label: "Upload Image",
      icon: Upload,
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      {/* Mode Toggle Buttons */}
      <div className="flex flex-wrap gap-2">
        {modes.map((mode) => (
          <Button
            key={mode.id}
            variant={activeMode === mode.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveMode(mode.id)}
            className="gap-2"
          >
            <mode.icon className="h-4 w-4" />
            {mode.label}
          </Button>
        ))}
      </div>

      {/* Text Input Mode */}
      {activeMode === "text" && (
        <div className="space-y-2">
          <Textarea
            placeholder="Paste or type your content here..."
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[200px] resize-none bg-background/50"
          />
          <p className="text-xs text-muted-foreground text-right">
            {content.length} characters
          </p>
        </div>
      )}

      {/* Scan Mode - Camera with capture="environment" for mobile */}
      {activeMode === "scan" && (
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              Tap to open camera and scan document
            </p>
            <p className="text-xs text-muted-foreground">
              Supports multiple images
            </p>
          </div>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={(e) => handleFileChange(e, true)}
            className="hidden"
          />
        </div>
      )}

      {/* Upload Mode */}
      {activeMode === "upload" && (
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              Click to select images from gallery
            </p>
            <p className="text-xs text-muted-foreground">
              Supports multiple images (PNG, JPG, WEBP)
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e, false)}
            className="hidden"
          />
        </div>
      )}

      {/* Image Preview Grid */}
      {selectedImages.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              Selected Images ({selectedImages.length})
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {selectedImages.map((src, index) => (
              <div key={index} className="relative group aspect-square">
                <img
                  src={src}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg border border-border"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentInput;
