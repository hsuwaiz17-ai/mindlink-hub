import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export const ImageUpload = ({ onUpload, isLoading }: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center gap-6 p-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />
      <div className="flex flex-wrap justify-center gap-4 w-full">
        <Button
          variant="outline"
          className="flex-1 h-32 flex flex-col gap-3 bg-white hover:bg-slate-50 transition-all border-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <Upload className="h-8 w-8 text-indigo-600" />
          <span className="font-semibold">Upload Photo/Document</span>
        </Button>
        <Button
          className="flex-1 h-32 flex flex-col gap-3 bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <Camera className="h-8 w-8 text-white" />
          <span className="font-semibold text-white">Scan with Camera</span>
        </Button>
      </div>
    </div>
  );
};
