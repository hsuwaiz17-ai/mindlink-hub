import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Globe, Moon, Sun, Monitor, Type, Shield, Info, ChevronRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'my', name: 'Myanmar' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'zh', name: '中文' },
  { code: 'th', name: 'ไทย' },
];

const FONT_SIZES = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

const Settings = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('en');
  const [showSecurity, setShowSecurity] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) loadSettings();
  }, [user]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else if (theme === 'light') root.classList.remove('dark');
    else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    }
  }, [theme]);

  const loadSettings = async () => {
    try {
      const { data } = await supabase.from('user_settings').select('*').eq('user_id', user?.id).single();
      if (data) {
        setTheme(data.theme as any || 'system');
        setFontSize(data.font_size || 'medium');
        setLanguage(data.language || 'en');
        i18n.changeLanguage(data.language || 'en');
      }
    } catch (error) { console.error(error); }
  };

  const updateSetting = async (key: string, value: string) => {
    if (!user) return;
    const { error } = await supabase.from('user_settings').upsert({
      user_id: user.id,
      [key]: value,
      updated_at: new Date().toISOString()
    });
    if (error) toast.error("Cloud sync failed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 pb-20 font-sans">
      <div className="max-w-lg mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-700 transition active:scale-95">
            <ChevronLeft size={22}/>
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>

        <div className="space-y-6">
          
          {/* 1. Appearance (Theme Loop) */}
          <section className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-indigo-500/20 rounded-xl"><Sparkles className="w-5 h-5 text-indigo-400" /></div>
              <span className="font-bold text-slate-200">Appearance</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', icon: Sun, label: 'Light' },
                { id: 'dark', icon: Moon, label: 'Dark' },
                { id: 'system', icon: Monitor, label: 'System' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setTheme(item.id as any); updateSetting('theme', item.id); }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ${
                    theme === item.id ? 'bg-blue-600 shadow-lg shadow-blue-500/20 ring-1 ring-blue-400' : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/60'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 2. Font Size (Loop) */}
          <section className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-emerald-500/20 rounded-xl"><Type className="w-5 h-5 text-emerald-400" /></div>
              <span className="font-bold text-slate-200">Text Size</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {FONT_SIZES.map((f) => (
                <button
                  key={f.value}
                  onClick={() => { setFontSize(f.value); updateSetting('font_size', f.value); }}
                  className={`py-3 rounded-2xl font-bold transition-all ${
                    fontSize === f.value ? 'bg-blue-600 ring-1 ring-blue-400' : 'bg-slate-700/30 text-slate-400'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </section>

          {/* 3. Language (Loop) */}
          <section className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-amber-500/20 rounded-xl"><Globe className="w-5 h-5 text-amber-400" /></div>
              <span className="font-bold text-slate-200">Language</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); i18n.changeLanguage(lang.code); updateSetting('language', lang.code); }}
                  className={`py-3 px-4 rounded-2xl text-left font-medium transition-all flex justify-between items-center ${
                    language === lang.code ? 'bg-blue-600 ring-1 ring-blue-400' : 'bg-slate-700/30 text-slate-400'
                  }`}
                >
                  {lang.name}
                  {language === lang.code && <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />}
                </button>
              ))}
            </div>
          </section>

          {/* Sign Out */}
          <button
            onClick={() => signOut().then(() => navigate('/auth'))}
            className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-2xl hover:bg-red-500/20 transition active:scale-[0.98]"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;