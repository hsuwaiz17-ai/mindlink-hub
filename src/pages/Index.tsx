import React, { useState, useRef } from 'react';
import { Camera, ImageIcon, FileText, Type, Download, History, User, FileUp, Sparkles, Languages, BookOpen, MessageSquare, RefreshCw, Lightbulb, Image as ImageSaveIcon, ChevronDown } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGUAGES = [
  "Myanmar", "English", "Japanese", "Thai", "Korean", 
  "Chinese", "French", "Spanish", "German", "Hindi", "Arabic"
];

const ACTION_TYPES = [
  { id: 'summarize', label: 'Summarize', icon: BookOpen, prompt: 'Summarize this content clearly and concisely' },
  { id: 'answer', label: 'Find Answer', icon: MessageSquare, prompt: 'Find and explain the answer to this question or problem' },
  { id: 'paraphrase', label: 'Paraphrase', icon: RefreshCw, prompt: 'Paraphrase this content in a clearer way' },
  { id: 'explain', label: 'Explain Theory', icon: Lightbulb, prompt: 'Explain the theory behind this concept in detail' },
];

const Index = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("Myanmar");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeInputType, setActiveInputType] = useState<'text' | 'camera' | 'image' | 'file'>('text');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setActiveInputType('image');
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInput(reader.result as string);
        setActiveInputType('file');
        toast.success(`File "${file.name}" loaded`);
      };
      reader.readAsText(file);
    }
  };

  const handleAIAction = async (actionType: typeof ACTION_TYPES[0]) => {
    if (!input && !selectedImage) {
      toast.error('Please enter text or upload an image first');
      return;
    }
    
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) {
      toast.error('API Key not configured');
      return;
    }

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      let prompt = `${actionType.prompt}. You must respond in ${targetLang} language only. Use markdown formatting for better readability.`;
      
      let result;
      if (selectedImage) {
        const imageData = selectedImage.split(',')[1];
        result = await model.generateContent([
          prompt,
          { inlineData: { data: imageData, mimeType: "image/jpeg" } },
          input ? `Additional context: ${input}` : ''
        ]);
      } else {
        result = await model.generateContent(`${prompt}\n\nContent: ${input}`);
      }
      
      const aiResponse = result.response.text();
      setResult(aiResponse);

      // Save to history
      if (user) {
        await supabase.from('history').insert({
          user_id: user.id,
          title: input.substring(0, 50) || 'Image Analysis',
          input_text: input,
          result_text: aiResponse,
          mode: actionType.id,
          language: targetLang
        });
      }

      toast.success('Analysis complete!');
    } catch (err) {
      console.error(err);
      toast.error('AI processing failed. Please try again.');
    }
    setLoading(false);
  };

  const exportAsPDF = async () => {
    const area = document.getElementById('result-display');
    if (!area) return;
    
    try {
      const canvas = await html2canvas(area, { scale: 2, useCORS: true });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('MindLink_Result.pdf');
      toast.success('PDF saved successfully!');
    } catch (err) {
      toast.error('Failed to export PDF');
    }
  };

  const exportAsImage = async () => {
    const area = document.getElementById('result-display');
    if (!area) return;
    
    try {
      const canvas = await html2canvas(area, { scale: 2, useCORS: true });
      const link = document.createElement('a');
      link.download = 'MindLink_Result.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Image saved successfully!');
    } catch (err) {
      toast.error('Failed to export image');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-2xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => navigate('/history')} 
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition-all"
          >
            <History size={20} className="text-blue-400"/>
            <span className="text-sm font-medium hidden sm:inline">History</span>
          </button>
          
          <div className="flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-blue-400" />
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">MindLink</h1>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2.5 bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition-all">
                <User size={22} className="text-blue-400"/>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 bg-slate-800 border-slate-700">
              <DropdownMenuItem onClick={() => navigate('/profile')} className="text-slate-200 focus:bg-slate-700">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="text-slate-200 focus:bg-slate-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-400 focus:bg-slate-700">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Input Type Buttons */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { type: 'camera' as const, icon: Camera, label: 'Camera' },
            { type: 'image' as const, icon: ImageIcon, label: 'Image' },
            { type: 'text' as const, icon: Type, label: 'Text' },
            { type: 'file' as const, icon: FileUp, label: 'File' },
          ].map(({ type, icon: Icon, label }) => (
            <button
              key={type}
              onClick={() => {
                setActiveInputType(type);
                if (type === 'image') imageInputRef.current?.click();
                if (type === 'file') fileInputRef.current?.click();
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                activeInputType === type
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Hidden File Inputs */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Image Preview */}
        {selectedImage && (
          <div className="mb-6 relative">
            <img 
              src={selectedImage} 
              alt="Uploaded" 
              className="w-full h-48 object-cover rounded-2xl border border-slate-700"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition"
            >
              ✕
            </button>
          </div>
        )}

        {/* Language Selector */}
        <div className="mb-6 bg-slate-800/30 backdrop-blur border border-slate-700/50 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="w-5 h-5 text-blue-400" />
            <span className="text-slate-400 text-sm font-medium">Result Language:</span>
          </div>
          <div className="relative">
            <select 
              className="appearance-none bg-slate-700/50 text-blue-400 font-bold pl-4 pr-10 py-2 rounded-xl outline-none cursor-pointer border border-slate-600 hover:border-blue-500 transition"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              {LANGUAGES.map(l => (
                <option key={l} value={l} className="bg-slate-800">{l}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Text Input */}
        <textarea 
          className="w-full h-36 bg-slate-800/30 backdrop-blur border border-slate-700/50 rounded-2xl p-5 mb-6 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-slate-500 resize-none"
          placeholder="Enter your question, text, or add context for the image..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {ACTION_TYPES.map((action) => {
            const Icon = action.icon;
            return (
              <button 
                key={action.id}
                onClick={() => handleAIAction(action)}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                <Icon size={20} />
                {action.label}
              </button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center gap-3 py-10">
            <div className="w-8 h-8 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-blue-400 font-medium">AI processing...</span>
          </div>
        )}

        {/* Result Display */}
        {result && !loading && (
          <div id="result-display" className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center p-4 bg-slate-900/50 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-blue-400 font-bold text-sm">MindLink AI Response</span>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={exportAsImage} 
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-xs font-medium text-blue-400 hover:bg-slate-600/50 transition"
                >
                  <ImageSaveIcon size={14} />
                  Save PNG
                </button>
                <button 
                  onClick={exportAsPDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 border border-slate-600 rounded-lg text-xs font-medium text-red-400 hover:bg-slate-600/50 transition"
                >
                  <Download size={14} />
                  Save PDF
                </button>
              </div>
            </div>
            <div className="p-6 prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
