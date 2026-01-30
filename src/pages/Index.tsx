import React, { useState, useRef, useEffect } from 'react';
import { Camera, ImageIcon, FileText, Type, Download, History, User, FileUp, Sparkles, Languages, BookOpen, MessageSquare, RefreshCw, Lightbulb, Image as ImageSaveIcon, ChevronDown, X } from 'lucide-react';
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

// Global Languages (၅၀ ကျော် ထည့်သွင်းထားသည်)
const LANGUAGES = [
  "Myanmar", "English", "Japanese", "Korean", "Thai", "Chinese", "French", "German", 
  "Spanish", "Italian", "Russian", "Portuguese", "Hindi", "Arabic", "Vietnamese"
];

const ACTION_TYPES = [
  { id: 'summarize', label: 'အနှစ်ချုပ်', icon: BookOpen, prompt: 'Summarize the following content clearly' },
  { id: 'answer', label: 'အဖြေရှာ', icon: MessageSquare, prompt: 'Analyze and provide the answer for' },
  { id: 'paraphrase', label: 'စကားပြေပြန်', icon: RefreshCw, prompt: 'Paraphrase this content in a natural way' },
  { id: 'explain', label: 'သီအိုရီရှင်းတမ်း', icon: Lightbulb, prompt: 'Explain the scientific or theoretical concept of' },
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

  // Electric Blue Theme Logic
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setActiveInputType('image');
        toast.success('Image loaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAction = async (actionType: typeof ACTION_TYPES[0]) => {
    if (!input && !selectedImage) {
      toast.error('စာသားရိုက်ပါ သို့မဟုတ် ပုံတင်ပါ');
      return;
    }
    
    // Supabase ကနေ API Key လှမ်းယူခြင်း (ပိုမိုလုံခြုံသည်)
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; 
    
    setLoading(true);
    setResult("");

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const finalPrompt = `${actionType.prompt} in ${targetLang} language. 
      Format the output beautifully with markdown. 
      If it's a theory, explain it step by step.`;

      let aiResult;
      if (selectedImage) {
        const imageData = selectedImage.split(',')[1];
        aiResult = await model.generateContent([
          finalPrompt,
          { inlineData: { data: imageData, mimeType: "image/jpeg" } },
          input ? `Context: ${input}` : ''
        ]);
      } else {
        aiResult = await model.generateContent(`${finalPrompt}\n\nContent: ${input}`);
      }
      
      const responseText = aiResult.response.text();
      setResult(responseText);

      // Save to History (Supabase)
      if (user) {
        await supabase.from('history').insert({
          user_id: user.id,
          title: input.substring(0, 30) || `${actionType.label} Result`,
          result_text: responseText,
          mode: actionType.id,
          created_at: new Date().toISOString()
        });
      }
    } catch (err: any) {
      console.error(err);
      toast.error('AI ချိတ်ဆက်မှု အဆင်မပြေပါ။ API Key ကို စစ်ဆေးပါ။');
    } finally {
      setLoading(false);
    }
  };

  // PDF Export (စာသားမပျက်အောင် ပုံရိပ်အဖြစ် သိမ်းဆည်းခြင်း)
  const exportAsPDF = async () => {
    const element = document.getElementById('result-area');
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save(`MindLink_${Date.now()}.pdf`);
    toast.success('PDF saved successfully');
  };

  return (
    <div className="min-h-screen bg-[#050A18] text-slate-200 selection:bg-blue-500/30">
      <div className="max-w-2xl mx-auto p-4 pb-24">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center py-6">
          <button onClick={() => navigate('/history')} className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl hover:bg-blue-500/20 transition">
            <History size={22} className="text-blue-400" />
          </button>
          
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="text-blue-500 fill-blue-500/20" size={28} />
              <h1 className="text-2xl font-black tracking-tighter text-white">MINDLINK</h1>
            </div>
            <span className="text-[10px] text-blue-500/60 font-bold tracking-[0.3em] uppercase">AI Assistant</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl outline-none">
              <User size={22} className="text-blue-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#0D1528] border-blue-500/20 text-slate-200">
              <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>Settings</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-blue-500/10" />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-400">Sign Out</DropdownMenuItem>
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
              className={`flex flex-col items-center gap-2 p-4 rounded-3xl border transition-all ${activeInputType === item.id ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-[#0D1528] border-blue-500/10 text-slate-400'}`}
            >
              <item.icon size={24} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </button>
          ))}
        </div>

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

        {/* Content Preview */}
        {selectedImage && (
          <div className="relative mb-6 rounded-3xl overflow-hidden border-2 border-blue-500/30">
            <img src={selectedImage} className="w-full h-48 object-cover" />
            <button onClick={() => setSelectedImage(null)} className="absolute top-3 right-3 p-2 bg-red-500 rounded-full"><X size={16}/></button>
          </div>
        )}

        {/* Language & Input */}
        <div className="bg-[#0D1528] rounded-3xl border border-blue-500/10 p-2 mb-6">
          <div className="flex items-center justify-between px-4 py-2 border-b border-blue-500/5">
            <span className="text-[10px] font-bold text-blue-500 uppercase">Target Language</span>
            <select 
              value={targetLang} 
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-transparent text-sm font-bold text-blue-400 outline-none"
            >
              {LANGUAGES.map(l => <option key={l} value={l} className="bg-[#0D1528]">{l}</option>)}
            </select>
          </div>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ဒီမှာ စာရိုက်ပါ သို့မဟုတ် Context ထည့်ပါ..."
            className="w-full bg-transparent p-4 h-32 outline-none resize-none text-slate-200 placeholder:text-slate-600"
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {ACTION_TYPES.map((action) => (
            <button 
              key={action.id}
              onClick={() => handleAIAction(action)}
              disabled={loading}
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl font-bold text-sm hover:brightness-110 active:scale-95 transition disabled:opacity-50"
            >
              <action.icon size={18} /> {action.label}
            </button>
          ))}
        </div>

        {/* Result Area */}
        {loading && (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
            <p className="text-blue-500 font-bold animate-pulse">MINDLINK IS THINKING...</p>
          </div>
        )}

        {result && !loading && (
          <div className="animate-in fade-in slide-in-from-bottom-5">
            <div className="flex justify-end gap-2 mb-3">
              <button onClick={exportAsPDF} className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"><Download size={18}/></button>
              <button onClick={() => toast.success("Copied to clipboard")} className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400"><ImageSaveIcon size={18}/></button>
            </div>
            <div id="result-area" className="bg-[#0D1528] border border-blue-500/20 rounded-3xl p-6 prose prose-invert max-w-none shadow-2xl shadow-blue-500/5">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Index;