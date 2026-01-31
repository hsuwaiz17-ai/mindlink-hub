import React, { useState, useEffect } from 'react';
import { ChevronLeft, Globe, Moon, Sun, Monitor, Shield, Info, Lock, Mail, Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

// Language list for global app
const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'my', name: 'မြန်မာ', nativeName: 'မြန်မာ' },
  { code: 'ja', name: '日本語', nativeName: '日本語' },
  { code: 'ko', name: '한국어', nativeName: '한국어' },
  { code: 'zh', name: '中文', nativeName: '中文' },
  { code: 'th', name: 'ไทย', nativeName: 'ไทย' },
  { code: 'hi', name: 'हिन्दी', nativeName: 'हिन्दी' },
  { code: 'fr', name: 'Français', nativeName: 'Français' },
  { code: 'de', name: 'Deutsch', nativeName: 'Deutsch' },
  { code: 'es', name: 'Español', nativeName: 'Español' },
  { code: 'ru', name: 'Русский', nativeName: 'Русский' },
  { code: 'ar', name: 'العربية', nativeName: 'العربية' },
  { code: 'pt', name: 'Português', nativeName: 'Português' },
  { code: 'it', name: 'Italiano', nativeName: 'Italiano' },
  { code: 'nl', name: 'Nederlands', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polski', nativeName: 'Polski' },
  { code: 'tr', name: 'Türkçe', nativeName: 'Türkçe' },
  { code: 'vi', name: 'Tiếng Việt', nativeName: 'Tiếng Việt' },
];

const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [language, setLanguage] = useState(i18n.language || 'en');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, [user]);

  useEffect(() => {
    applyTheme();
  }, [theme]);

  const applyTheme = () => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.toggle('dark', systemTheme === 'dark');
    }
  };

  const loadSettings = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setTheme(data.theme || 'system');
        const savedLanguage = data.language || 'en';
        setLanguage(savedLanguage);
        if (i18n.language !== savedLanguage) {
          i18n.changeLanguage(savedLanguage);
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          [key]: value,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
      
      toast.success(t('success'));
    } catch (error) {
      console.error('Update error:', error);
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error(t('passwordError') || 'Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error(t('passwordLength') || 'Password must be at least 6 characters');
      return;
    }

    setPasswordLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        toast.error(t('invalidPassword') || 'Current password is incorrect');
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast.success(t('passwordSuccess') || 'Password updated successfully');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error.message || t('error'));
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleThemeChange = (themeId: string) => {
    setTheme(themeId as any);
    updateSetting('theme', themeId);
  };

  const handleLanguageChange = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      setLanguage(langCode);
      updateSetting('language', langCode);
      
      // Show success message in the new language
      setTimeout(() => {
        toast.success(t('success'));
      }, 100);
    } catch (error) {
      console.error('Language change error:', error);
      toast.error(t('error'));
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      navigate('/auth');
      toast.success(t('signOutSuccess') || 'Signed out successfully');
    } catch (error) {
      toast.error(t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 pb-20 font-sans">
      <div className="max-w-lg mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl hover:bg-slate-700 transition active:scale-95 disabled:opacity-50"
            disabled={loading}
          >
            <ChevronLeft size={22}/>
          </button>
          <h1 className="text-xl font-bold">{t('settings')}</h1>
        </div>

        <div className="space-y-6">
          
          {/* 1. Appearance */}
          <section className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <span className="font-bold text-slate-200">{t('appearance')}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', icon: Sun },
                { id: 'dark', icon: Moon },
                { id: 'system', icon: Monitor }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleThemeChange(item.id)}
                  disabled={loading}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ${
                    theme === item.id 
                      ? 'bg-blue-600 shadow-lg shadow-blue-500/20 ring-1 ring-blue-400' 
                      : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/60'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <item.icon size={20} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {t(item.id)}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* 2. Language */}
          <section className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-amber-500/20 rounded-xl">
                <Globe className="w-5 h-5 text-amber-400" />
              </div>
              <span className="font-bold text-slate-200">{t('language')}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto p-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  disabled={loading}
                  className={`py-3 px-4 rounded-2xl text-left font-medium transition-all flex justify-between items-center ${
                    language === lang.code 
                      ? 'bg-blue-600 ring-1 ring-blue-400' 
                      : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/60'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <span className={`${lang.code === 'my' || lang.code === 'ar' ? 'font-myanmar' : ''}`}>
                    {lang.nativeName}
                  </span>
                  {language === lang.code && (
                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* 3. Security & Privacy */}
          <section className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-red-500/20 rounded-xl">
                <Shield className="w-5 h-5 text-red-400" />
              </div>
              <span className="font-bold text-slate-200">{t('security')}</span>
            </div>
            
            {/* Email Display */}
            <div className="mb-4">
              <label className="text-sm text-slate-400 mb-2 block">{t('email')}</label>
              <div className="p-3 bg-slate-700/30 rounded-xl flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{user?.email}</span>
              </div>
            </div>

            {/* Password Section */}
            {!showChangePassword ? (
              <button
                onClick={() => setShowChangePassword(true)}
                disabled={loading}
                className="w-full p-3 bg-slate-700/30 text-left rounded-xl hover:bg-slate-700/60 transition flex items-center justify-between disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4" />
                  <span>{t('changePassword')}</span>
                </div>
                <ChevronLeft className="w-4 h-4 rotate-180" />
              </button>
            ) : (
              <div className="space-y-4 p-4 bg-slate-700/20 rounded-xl">
                <h3 className="font-medium">{t('changePassword')}</h3>
                
                {/* Current Password */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">{t('currentPassword')}</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-3 bg-slate-700/30 rounded-xl pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">{t('newPassword')}</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-3 bg-slate-700/30 rounded-xl pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-sm text-slate-400 mb-2 block">{t('confirmPassword')}</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-3 bg-slate-700/30 rounded-xl pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowChangePassword(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="flex-1 py-2 bg-slate-700/30 rounded-xl hover:bg-slate-700/60 transition"
                    disabled={passwordLoading}
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handlePasswordChange}
                    disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                    className="flex-1 py-2 bg-blue-600 rounded-xl hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {passwordLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : null}
                    {t('update')}
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* 4. About App */}
          <section className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-purple-500/20 rounded-xl">
                <Info className="w-5 h-5 text-purple-400" />
              </div>
              <span className="font-bold text-slate-200">{t('about')}</span>
            </div>
            
            <div className="space-y-4">
              <p className="text-slate-300 leading-relaxed">
                {t('tagline')}
              </p>
              
              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-sm text-slate-400 mb-2">{t('owners')}:</p>
                <div className="space-y-2">
                  <p className="text-slate-300">• Arkar Kyaw (MIIT)</p>
                  <p className="text-slate-300">• Hsu Wai Zin (UCSMG)</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-700/50">
                <p className="text-sm text-slate-400 mb-2">{t('version')}:</p>
                <p className="text-slate-300">MindLink AI v1.0.0</p>
              </div>
            </div>
          </section>

          {/* 5. Sign Out */}
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-2xl hover:bg-red-500/20 transition active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {t('signOut')}
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {(loading || passwordLoading) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-2xl flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <p className="text-slate-300">{t('loading')}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
