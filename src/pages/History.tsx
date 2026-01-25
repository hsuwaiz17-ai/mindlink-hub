import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Trash2, ChevronLeft, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase.from('history').select('*').order('created_at', { ascending: false });
      if (!error) setHistory(data);
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-full"><ChevronLeft/></button>
        <h1 className="text-2xl font-bold">History</h1>
      </div>
      <div className="space-y-4">
        {history.map((item: any) => (
          <div key={item.id} className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-lg">
            <h3 className="font-bold text-blue-400 mb-1">{item.title}</h3>
            <p className="text-slate-400 text-sm">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default History;