import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export const ImageUpload = ({ onUpload, isLoading }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-xl">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <Button 
        onClick={() => fileInputRef.current?.click()} 
        disabled={isLoading}
        className="flex gap-2"
      >
        <Upload className="h-4 w-4" />
        {isLoading ? "Processing..." : "Upload Image or Note"}
      </Button>
    </div>
  );
};

export default ImageUpload;
