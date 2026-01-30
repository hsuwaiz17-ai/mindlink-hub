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

  useEffect(() => {
    if (user) loadSettings();
  }, [user]);

  const loadSettings = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setTheme(data.theme as 'light' | 'dark' | 'system' || 'system');
      setFontSize(data.font_size || 'medium');
      setLanguage(data.language || 'en');
    }
  };

  const updateSetting = async (key: string, value: string) => {
    if (!user) return;
    
    await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        [key]: value,
        updated_at: new Date().toISOString()
      });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    updateSetting('theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
    toast.success(`Theme set to ${newTheme}`);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    updateSetting('font_size', size);
    toast.success(`Font size set to ${size}`);
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
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success('Password updated successfully');
      setNewPassword('');
      setShowSecurity(false);
    } catch (error: any) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-700/50 transition"
          >
            <ChevronLeft size={22}/>
          </button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>

        <div className="space-y-4">
          {/* Theme Section */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
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
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition ${
                    theme === value 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-xl">
                <Type className="w-5 h-5 text-green-400" />
              </div>
              <span className="font-semibold">Font Size</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {FONT_SIZES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleFontSizeChange(value)}
                  className={`py-3 rounded-xl text-sm font-medium transition ${
                    fontSize === value 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* App Language */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-xl">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <span className="font-semibold">App Language</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map(({ code, name }) => (
                <button
                  key={code}
                  onClick={() => handleLanguageChange(code)}
                  className={`py-3 rounded-xl text-sm font-medium transition ${
                    language === code 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700/50 text-slate-400 hover:bg-slate-600/50'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Security & Privacy */}
          <button
            onClick={() => setShowSecurity(!showSecurity)}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 flex items-center justify-between hover:bg-slate-700/50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-xl">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <span className="font-semibold">Security & Privacy</span>
            </div>
            <ChevronRight className={`w-5 h-5 text-slate-500 transition ${showSecurity ? 'rotate-90' : ''}`} />
          </button>

          {showSecurity && (
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-5 space-y-4 ml-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Current Email</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-900/50 rounded-xl text-slate-500">
                  <Mail size={18} />
                  <span>{user?.email}</span>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">New Password</label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <button
                    onClick={handlePasswordUpdate}
                    disabled={loading}
                    className="px-4 py-3 bg-blue-600 rounded-xl font-medium hover:bg-blue-500 transition disabled:opacity-50"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* About App */}
          <button
            onClick={() => setShowAbout(!showAbout)}
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 flex items-center justify-between hover:bg-slate-700/50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-xl">
                <Info className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="font-semibold">About MindLink</span>
            </div>
            <ChevronRight className={`w-5 h-5 text-slate-500 transition ${showAbout ? 'rotate-90' : ''}`} />
          </button>

          {showAbout && (
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-2xl p-5 ml-4">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-blue-400" />
                <div>
                  <h3 className="font-bold text-lg">MindLink</h3>
                  <p className="text-slate-500 text-sm">Version 1.0.0</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                MindLink is an AI-powered learning assistant that helps you summarize documents, 
                find answers to complex questions, paraphrase content, and explain scientific theories. 
                Powered by Google Gemini AI, it supports multiple languages including Myanmar, English, 
                Japanese, and more. Perfect for students, researchers, and lifelong learners.
              </p>
            </div>
          )}

          {/* App Owners Section */}
          <div className="text-center py-2 space-y-1">
            <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">App Owners</p>
            <p className="text-slate-300 text-sm font-medium">
              Arkar Kyaw (MIIT) & Hsu Wai Zin (UCSMG)
            </p>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-semibold rounded-2xl hover:bg-red-500/20 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;