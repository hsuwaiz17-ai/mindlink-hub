import React, { useState, useRef, useEffect } from 'react';
import { Camera, ImageIcon, FileText, Type, Download, History, User, FileUp, Sparkles, Languages, BookOpen, MessageSquare, RefreshCw, Lightbulb, Image as ImageSaveIcon, ChevronDown, X, Copy, Loader2 } from 'lucide-react';
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
  "Myanmar", "English", "Japanese", "Korean", "Thai", "Chinese", "French", "German", 
  "Spanish", "Italian", "Russian", "Portuguese", "Hindi", "Arabic", "Vietnamese"
];

const ACTION_TYPES = [
  { id: 'summarize', label: 'အနှစ်ချုပ်', icon: BookOpen, prompt: 'Summarize the following content clearly and concisely' },
  { id: 'answer', label: 'အဖြေရှာ', icon: MessageSquare, prompt: 'Analyze the provided information and provide a detailed answer' },
  { id: 'paraphrase', label: 'စကားပြေပြန်', icon: RefreshCw, prompt: 'Paraphrase this content in a natural, easy-to-read way' },
  { id: 'explain', label: 'ရှင်းလင်းချက်', icon: Lightbulb, prompt: 'Explain the concept or theory step-by-step for better understanding' },
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
  const camInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      toast.error("Sign out လုပ်လို့မရပါ");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("File size က 4MB ထက်မကျော်ရပါ");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setActiveInputType('image');
        toast.success('Image loaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success("Clipboard ထဲသို့ ကူးယူပြီးပါပြီ");
  };

  const handleAIAction = async (actionType: typeof ACTION_TYPES[0]) => {
    if (!input && !selectedImage) {
      toast.error('စာသားရိုက်ပါ သို့မဟုတ် ပုံတင်ပါ');
      return;
    }
    
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
    if (!API_KEY) {
      toast.error("API Key မရှိသေးပါ။ Environment variables ကို စစ်ဆေးပါ။");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const finalPrompt = `
        User Request: ${actionType.prompt}
        Output Language: ${targetLang}
        Instructions: 
        1. Format the response using beautiful Markdown.
        2. If the output language is Myanmar, ensure the tone is helpful and polite.
        3. Break down complex points into bullet points.
      `;

      let aiResult;
      if (selectedImage) {
        const imageData = selectedImage.split(',')[1];
        aiResult = await model.generateContent([
          finalPrompt,
          { inlineData: { data: imageData, mimeType: "image/jpeg" } },
          input ? `Context/Question: ${input}` : ''
        ]);
      } else {
        aiResult = await model.generateContent(`${finalPrompt}\n\nContent to process: ${input}`);
      }
      
      const responseText = aiResult.response.text();
      setResult(responseText);
  
      if (user) {
        await supabase.from('history').insert({
          user_id: user.id,
          title: input.substring(0, 40) || `${actionType.label} Analysis`,
          result_text: responseText,
          mode: actionType.id,
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error('AI တုံ့ပြန်မှု မရရှိနိုင်ပါ။ ခဏကြာမှ ပြန်ကြိုးစားပါ။');
    } finally {
      setLoading(false);
    }
  };

  const exportAsPDF = async () => {
    const element = document.getElementById('result-area');
    if (!element) return;
    
    toast.loading("PDF ထုတ်ယူနေပါသည်...");
    
    try {
      const canvas = await html2canvas(element, { 
        scale: 2,
        backgroundColor: '#0D1528',
        useCORS: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`MindLink_Result_${Date.now()}.pdf`);
      toast.dismiss();
      toast.success('PDF သိမ်းဆည်းပြီးပါပြီ');
    } catch (error) {
      toast.dismiss();
      toast.error("PDF ထုတ်ယူရာတွင် အမှားအယွင်းရှိခဲ့ပါသည်");
    }
  };

  return (
    <div className="min-h-screen bg-[#050A18] text-slate-200 selection:bg-blue-500/30 font-sans">
      <div className="max-w-2xl mx-auto p-4 pb-24">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center py-6">
          <button onClick={() => navigate('/history')} className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl hover:bg-blue-500/20 transition-all active:scale-90">
            <History size={22} className="text-blue-400" />
          </button>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-500 animate-pulse" size={28} />
              <h1 className="text-2xl font-black tracking-tighter text-white">MINDLINK</h1>
            </div>
            <span className="text-[10px] text-blue-500/60 font-bold tracking-[0.3em] uppercase">Intelligence Companion</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl outline-none focus:ring-2 ring-blue-500/50">
              <User size={22} className="text-blue-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#0D1528] border-blue-500/20 text-slate-200 w-48 rounded-xl shadow-2xl">
              <DropdownMenuItem onClick={() => navigate('/profile')} className="py-3 cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')} className="py-3 cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-blue-500/10" />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-400 py-3 cursor-pointer font-bold">Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Input Methods */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { id: 'camera', icon: Camera, label: 'Scan', ref: camInputRef },
            { id: 'image', icon: ImageIcon, label: 'Image', ref: imageInputRef },
            { id: 'text', icon: Type, label: 'Type', ref: null },
            { id: 'file', icon: FileUp, label: 'File', ref: fileInputRef }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => {
                setActiveInputType(item.id as any);
                item.ref?.current?.click();
              }}
              className={`flex flex-col items-center gap-2 p-4 rounded-3xl border transition-all duration-300 ${activeInputType === item.id ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-[#0D1528] border-blue-500/10 text-slate-400 hover:border-blue-500/30'}`}
            >
              <item.icon size={24} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Hidden Inputs */}
        <input type="file" ref={imageInputRef} hidden accept="image/*" onChange={handleImageUpload} />
        <input type="file" ref={camInputRef} hidden accept="image/*" capture="environment" onChange={handleImageUpload} />
        <input type="file" ref={fileInputRef} hidden accept=".txt,.pdf" onChange={(e) => {
          const file = e.target.files?.[0];
          if(file) {
            const reader = new FileReader();
            reader.onload = (ev) => { setInput(ev.target?.result as string); toast.success("File Content Loaded"); };
            reader.readAsText(file);
          }
        }} />

        {/* Image Preview */}
        {selectedImage && (
          <div className="relative mb-6 rounded-3xl overflow-hidden border-2 border-blue-500/30 group">
            <img src={selectedImage} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => setSelectedImage(null)} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg">
                    <X size={20}/>
                </button>
            </div>
          </div>
        )}

        {/* Input Card */}
        <div className="bg-[#0D1528] rounded-3xl border border-blue-500/10 p-2 mb-6 focus-within:border-blue-500/40 transition-colors shadow-inner">
          <div className="flex items-center justify-between px-4 py-3 border-b border-blue-500/5">
            <div className="flex items-center gap-2">
                <Languages size={14} className="text-blue-500" />
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Translate to</span>
            </div>
            <select 
              value={targetLang} 
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-transparent text-xs font-bold text-blue-400 outline-none cursor-pointer hover:text-blue-300"
            >
              {LANGUAGES.map(l => <option key={l} value={l} className="bg-[#0D1528]">{l}</option>)}
            </select>
          </div>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ဒီမှာ စာရိုက်ပါ သို့မဟုတ် ဓာတ်ပုံထဲကစာကို ခိုင်းစေလိုရာ ရေးပါ..."
            className="w-full bg-transparent p-4 h-32 outline-none resize-none text-slate-200 placeholder:text-slate-700 leading-relaxed"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {ACTION_TYPES.map((action) => (
            <button 
              key={action.id}
              onClick={() => handleAIAction(action)}
              disabled={loading}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl font-bold text-sm text-white hover:shadow-[0_8px_20px_rgba(37,99,235,0.3)] active:scale-95 transition-all disabled:opacity-50"
            >
              <action.icon size={18} /> {action.label}
            </button>
          ))}
        </div>

        {/* Loading & Results */}
        {loading && (
          <div className="text-center py-12 animate-in fade-in zoom-in">
            <div className="relative inline-block">
                <div className="w-12 h-12 border-4 border-blue-500/10 border-t-blue-500 rounded-full animate-spin" />
                <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400 w-4 h-4" />
            </div>
            <p className="text-blue-500 font-black text-xs mt-4 tracking-[0.2em] uppercase animate-pulse">MindLink is analyzing...</p>
          </div>
        )}

        {result && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="flex justify-end gap-2 mb-3">
              <button onClick={exportAsPDF} title="PDF အဖြစ်သိမ်းမည်" className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 hover:bg-red-500/20 transition-colors">
                <Download size={18}/>
              </button>
              <button onClick={copyToClipboard} title="Copy ကူးမည်" className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 hover:bg-blue-500/20 transition-colors">
                <Copy size={18}/>
              </button>
            </div>
            <div id="result-area" className="bg-[#0D1528] border border-blue-500/20 rounded-[2rem] p-8 prose prose-invert prose-blue max-w-none shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/40" />
                <ReactMarkdown className="leading-relaxed text-slate-300">{result}</ReactMarkdown>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Index;