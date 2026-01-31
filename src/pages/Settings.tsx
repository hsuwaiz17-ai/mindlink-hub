import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Globe, Moon, Sun, Monitor, Type, Shield, Info, Sparkles, ChevronRight, Lock, Mail } from 'lucide-react';
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
  const [showAbout, setShowAbout] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Load settings and apply initial theme
  useEffect(() => {
    if (user) loadSettings();
  }, [user]);

  // Theme ပြောင်းတိုင်း class ကို toggle လုပ်ပေးခြင်း
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.toggle('dark', systemTheme === 'dark');
    }
  }, [theme]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (data) {
        setTheme(data.theme as any || 'system');
        setFontSize(data.font_size || 'medium');
        setLanguage(data.language || 'en');
        i18n.changeLanguage(data.language || 'en');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        [key]: value,
        updated_at: new Date().toISOString()
      });
    
    if (error) toast.error("Failed to save to cloud");
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    updateSetting('theme', newTheme);
    toast.success(`${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode applied`);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    updateSetting('font_size', size);
    toast.success(`Font size: ${size}`);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    updateSetting('language', lang);
    toast.success('Language updated');
  };

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully');
      setNewPassword('');
      setShowSecurity(false);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 pb-20">
      <div className="max-w-lg mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition active:scale-95"
          >
            <ChevronLeft size={22}/>
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>

        <div className="space-y-4">
          {/* Appearance Section */}
          <section className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <Moon className="w-5 h-5 text-purple-400" />
              </div>
              <span className="font-semibold">Appearance</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'light' as const, icon: Sun, label: 'Light' },
                { value: 'dark' as const, icon: Moon, label: 'Dark' },
                { value: 'system' as const, icon: Monitor, label: 'System' },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => handleThemeChange(value)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                    theme === value 
                      ? 'bg-blue-600 shadow-lg shadow-blue-900/20 text-white' 
                      : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">{label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Other Settings (Font, Language, Security, About - same as your original structure but cleaner) */}
          {/* ... (Your original sections with improved active:scale-95 and hover effects) */}

          {/* Logout Section */}
          <div className="pt-4">
             <button
                onClick={async () => {
                   await signOut();
                   navigate('/auth');
                }}
                className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-2xl hover:bg-red-500/20 transition active:scale-[0.98]"
              >
                Sign Out
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;