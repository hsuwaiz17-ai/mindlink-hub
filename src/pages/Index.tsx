import React, { useState } from 'react';
import { Camera, ImageIcon, FileText, Type, Download, History, User, Save } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client"; // Supabase ချိတ်ဆက်မှု
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Index = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [targetLang, setTargetLang] = useState("Myanmar");
  const navigate = useNavigate();

  // Gemini AI နဲ့ အလုပ်လုပ်တဲ့အပိုင်း
  const handleAIAction = async (actionType: string) => {
    if (!input) return alert("စာသား အရင်ရိုက်ထည့်ပါ");
    
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!API_KEY) return alert("API Key မရှိသေးပါ။ .env ဖိုင်ကို စစ်ဆေးပါ။");

    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `Action: ${actionType}. Content: ${input}. You must respond in ${targetLang} language only.`;
      const res = await model.generateContent(prompt);
      const aiResponse = res.response.text();
      
      setResult(aiResponse);

      // --- History ထဲသို့ အလိုအလျောက် သိမ်းဆည်းခြင်း ---
      const { data: userData } = await supabase.auth.getUser();
      if (userData?.user) {
        await supabase.from('history').insert([
          {
            user_id: userData.user.id,
            title: input.substring(0, 30) + (input.length > 30 ? "..." : ""),
            content: aiResponse,
            action_type: actionType,
            target_lang: targetLang
          }
        ]);
        console.log("Saved to history successfully");
      }
      // -------------------------------------------

    } catch (err) {
      setResult("Error: AI ချိတ်ဆက်မှု အဆင်မပြေပါ။");
      console.error(err);
    }
    setLoading(false);
  };

  const exportPDF = async () => {
    const area = document.getElementById('result-display');
    if (!area) return;
    const canvas = await html2canvas(area);
    const pdf = new jsPDF();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 0);
    pdf.save("MindLink_Result.pdf");
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => navigate('/history')} className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition">
          <History size={24} className="text-blue-400"/>
        </button>
        <h1 className="text-3xl font-black text-blue-500 italic tracking-tighter">MindLink</h1>
        <button onClick={() => navigate('/settings')} className="p-3 bg-slate-800 rounded-2xl hover:bg-slate-700 transition">
          <User size={24} className="text-blue-400"/>
        </button>
      </div>

      {/* Inputs Selection */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[<Camera/>, <ImageIcon/>, <FileText/>, <Type/>].map((icon, i) => (
          <button key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex justify-center text-blue-500 hover:bg-blue-600 hover:text-white transition shadow-xl">
            {icon}
          </button>
        ))}
      </div>

      {/* Result Language Picker */}
      <div className="mb-6 bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <span className="text-slate-400 text-sm font-medium">Result Language:</span>
        <select 
          className="bg-transparent text-blue-400 font-bold outline-none cursor-pointer"
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
        >
          {["Myanmar", "English", "Japanese", "Thai", "Korean", "Chinese", "French"].map(l => (
            <option key={l} value={l} className="bg-slate-900">{l}</option>
          ))}
        </select>
      </div>

      {/* Main Input Textarea */}
      <textarea 
        className="w-full h-44 bg-slate-900 border border-slate-800 rounded-3xl p-5 mb-6 focus:border-blue-500 outline-none transition shadow-inner placeholder-slate-600"
        placeholder="ဘာသိချင်လဲ မေးလို့ရပါပြီ..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {['အနှစ်ချုပ်', 'အဖြေရှာ', 'စကားပြေပြန်', 'သီအိုရီရှင်း'].map((act) => (
          <button 
            key={act}
            onClick={() => handleAIAction(act)}
            className="bg-blue-600 py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/30 active:scale-95 transition hover:bg-blue-500"
          >
            {act}
          </button>
        ))}
      </div>

      {/* AI Result Section */}
      {result && (
        <div id="result-display" className="bg-slate-900 border-2 border-blue-900/30 rounded-3xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-500 font-bold text-sm">MindLink AI Response</span>
            </div>
            <button onClick={exportPDF} className="p-2 bg-slate-800 rounded-xl text-blue-400 hover:text-white transition">
              <Download size={20}/>
            </button>
          </div>
          <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
            {loading ? <span className="animate-pulse">AI တွက်ချက်နေပါသည်...</span> : result}
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;