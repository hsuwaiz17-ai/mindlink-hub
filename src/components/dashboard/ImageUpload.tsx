import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Camera } from "lucide-react";

export const ImageUpload = ({ onUpload, isLoading }: { onUpload: (file: File) => void, isLoading: boolean }) => {
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
          className="flex-1 h-28 flex flex-col gap-2" 
          onClick={() => fileInputRef.current?.click()} 
          disabled={isLoading}
        >
          <Upload className="h-6 w-6 text-indigo-600" />
          <span>ပုံတင်ရန်</span>
        </Button>
        <Button 
          className="flex-1 h-28 flex flex-col gap-2 bg-indigo-600" 
          onClick={() => fileInputRef.current?.click()} 
          disabled={isLoading}
        >
          <Camera className="h-6 w-6 text-white" />
          <span className="text-white">Scan ဖတ်ရန်</span>
        </Button>
      </div>
    </div>
  );
};
