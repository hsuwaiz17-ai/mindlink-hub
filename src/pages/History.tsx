import React, { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Trash2, ChevronLeft, Calendar, Edit2, Check, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface HistoryItem {
  id: string;
  title: string | null;
  input_text: string | null;
  result_text: string | null;
  mode: string | null;
  language: string | null;
  created_at: string | null;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to load history');
    } else {
      setHistory(data || []);
    }
    setLoading(false);
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('history').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete item');
    } else {
      setHistory(history.filter(item => item.id !== id));
      toast.success('Item deleted');
    }
  };

  const startEditing = (item: HistoryItem) => {
    setEditingId(item.id);
    setEditTitle(item.title || '');
  };

  const saveTitle = async (id: string) => {
    const { error } = await supabase
      .from('history')
      .update({ title: editTitle })
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to update title');
    } else {
      setHistory(history.map(item => 
        item.id === id ? { ...item, title: editTitle } : item
      ));
      toast.success('Title updated');
    }
    setEditingId(null);
  };

  const filteredHistory = history.filter(item => 
    item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.result_text?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getModeColor = (mode: string | null) => {
    switch (mode) {
      case 'summarize': return 'bg-blue-500/20 text-blue-400';
      case 'answer': return 'bg-green-500/20 text-green-400';
      case 'paraphrase': return 'bg-purple-500/20 text-purple-400';
      case 'explain': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition"
          >
            <ChevronLeft size={22}/>
          </button>
          <h1 className="text-2xl font-bold">History</h1>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* History List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500">No history found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div 
                key={item.id} 
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-blue-500"
                            autoFocus
                          />
                          <button 
                            onClick={() => saveTitle(item.id)}
                            className="p-1.5 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-200 truncate">
                            {item.title || 'Untitled'}
                          </h3>
                          <button 
                            onClick={() => startEditing(item)}
                            className="p-1 text-slate-500 hover:text-blue-400 transition"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                          <Calendar size={12} />
                          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
                        </div>
                        {item.mode && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getModeColor(item.mode)}`}>
                            {item.mode}
                          </span>
                        )}
                        {item.language && (
                          <span className="text-xs text-slate-500">{item.language}</span>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => deleteItem(item.id)} 
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Preview */}
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="text-left w-full"
                  >
                    <p className={`text-slate-400 text-sm ${expandedId === item.id ? '' : 'line-clamp-2'}`}>
                      {item.result_text || 'No content'}
                    </p>
                  </button>
                </div>

                {/* Expanded Content */}
                {expandedId === item.id && item.result_text && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-700/50">
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{item.result_text}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
