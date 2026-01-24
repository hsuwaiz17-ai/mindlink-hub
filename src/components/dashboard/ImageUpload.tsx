import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export const ImageUpload = ({ onUpload, isLoading }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
        id="image-input"
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          variant="outline"
          className="h-24 flex flex-col gap-2 border-2 border-dashed"
        >
          <Upload className="h-6 w-6" />
          <span>Upload Image</span>
        </Button>

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="h-24 flex flex-col gap-2"
        >
          <Camera className="h-6 w-6" />
          <span>Scan Document</span>
        </Button>
      </div>
    </div>
  );
};

export default ImageUpload;
