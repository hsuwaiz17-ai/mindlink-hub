// File: /workspaces/mindlink-hub/src/components/dashboard/ImageUpload.tsx
import React, { useCallback, useState } from "react";
import { Loader2 } from "lucide-react";

interface ImageUploadProps {
  onUpload: (file: File) => void;
  isLoading?: boolean;  // isLoading prop ထည့်ပါ
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onUpload, 
  isLoading = false 
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Call parent handler
    onUpload(file);
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-2">ဓာတ်ပုံတင်ရန်</h3>
        <p className="text-slate-500">AI ဖြင့် ခွဲခြမ်းစိတ်ဖြာလိုသော ဓာတ်ပုံကို တင်ပေးပါ</p>
      </div>
      
      <div
        className={`relative border-3 border-dashed rounded-3xl p-12 text-center transition-all ${
          dragOver 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
        } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isLoading) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isLoading && document.getElementById('file-upload')?.click()}
      >
        {isLoading ? (
          <div className="py-12">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-700">Processing...</p>
            <p className="text-slate-500">ဓာတ်ပုံကို AI ဖြင့် ခွဲခြမ်းစိတ်ဖြာနေပါသည်</p>
          </div>
        ) : preview ? (
          <div className="space-y-6">
            <div className="relative mx-auto max-w-md">
              <img 
                src={preview} 
                alt="Preview" 
                className="rounded-2xl w-full h-auto max-h-72 object-cover shadow-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPreview(null);
                }}
                className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md"
              >
                ✕
              </button>
            </div>
            <div>
              <p className="text-green-600 font-medium text-lg mb-2">✓ ဓာတ်ပုံတင်ပြီးပါပြီ</p>
              <p className="text-slate-600">AI ဖြင့် ခွဲခြမ်းစိတ်ဖြာရန် ခလုတ်ကိုနှိပ်ပါ</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto w-24 h-24 mb-6">
              <div className="w-full h-full flex items-center justify-center bg-indigo-100 rounded-full">
                <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
            </div>
            <p className="text-slate-700 text-xl mb-3 font-medium">
              <span className="font-bold">ဓာတ်ပုံကိုနှိပ်ပါ</span> သို့မဟုတ် ဒီအတိုင်းဆွဲချတင်ပါ
            </p>
            <p className="text-slate-500 mb-6">
              PNG, JPG, GIF up to 10MB
            </p>
          </>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={isLoading}
        />
        
        {preview && !isLoading && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Trigger upload
              const input = document.getElementById('file-upload') as HTMLInputElement;
              if (input?.files?.[0]) {
                onUpload(input.files[0]);
              }
            }}
            className="mt-6 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-bold text-lg"
          >
            AI ဖြင့် ခွဲခြမ်းစိတ်ဖြာမည်
          </button>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-500">
        <div className="text-center p-4 bg-slate-50 rounded-xl">
          <div className="font-bold text-indigo-600 mb-1">📷</div>
          <p>မည်သည့်ဓာတ်ပုံမဆို</p>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-xl">
          <div className="font-bold text-indigo-600 mb-1">⚡</div>
          <p>စက္ကန့်ပိုင်းအတွင်း</p>
        </div>
        <div className="text-center p-4 bg-slate-50 rounded-xl">
          <div className="font-bold text-indigo-600 mb-1">🔒</div>
          <p>လုံခြုံစွာလုပ်ဆောင်</p>
        </div>
      </div>
    </div>
  );
};
