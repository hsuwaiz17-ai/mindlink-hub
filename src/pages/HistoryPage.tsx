import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Trash2, ChevronLeft, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error) setHistory(data);
    setLoading(false);
  };

  const deleteItem = async (id) => {
    const { error } = await supabase.from('history').delete().eq('id', id);
    if (!error) setHistory(history.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6 font-sans">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-full"><ChevronLeft/></button>
        <h1 className="text-2xl font-bold">မှတ်တမ်းများ (History)</h1>
      </div>

      {loading ? <div className="text-center animate-pulse">ခဏစောင့်ပါ...</div> : (
        <div className="space-y-4">
          {history.length === 0 ? <p className="text-slate-500 text-center mt-10">မှတ်တမ်းမရှိသေးပါ။</p> : 
            history.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 p-5 rounded-3xl flex justify-between items-start shadow-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-blue-500 text-xs mb-2">
                    <Calendar size={14}/> {new Date(item.created_at).toLocaleDateString()}
                  </div>
                  <h3 className="font-bold text-slate-200 mb-2 truncate">{item.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 italic">{item.content}</p>
                </div>
                <button onClick={() => deleteItem(item.id)} className="text-slate-600 hover:text-red-500 p-2"><Trash2 size={20}/></button>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};
export default History;