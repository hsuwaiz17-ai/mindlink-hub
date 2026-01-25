import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Globe, Shield, Info, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-full"><ChevronLeft/></button>
        <h1 className="text-2xl font-bold">ဆက်တင် (Settings)</h1>
      </div>

      <div className="space-y-6">
        {/* Language Section */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <div className="flex items-center gap-3 mb-4 text-blue-400">
            <Globe size={20}/> <span className="font-bold">App Language</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { code: 'en', name: 'English' },
              { code: 'mm', name: 'မြန်မာစာ' },
              { code: 'jp', name: '日本語' },
              { code: 'th', name: 'ไทย' }
            ].map((lang) => (
              <button 
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`py-3 rounded-2xl border ${i18n.language === lang.code ? 'bg-blue-600 border-blue-500' : 'bg-slate-800 border-slate-700'}`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Other Options */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800">
          <button className="w-full p-5 flex items-center gap-4 hover:bg-slate-800 border-b border-slate-800">
            <Shield className="text-emerald-500"/> Privacy Policy
          </button>
          <button className="w-full p-5 flex items-center gap-4 hover:bg-slate-800">
            <Info className="text-orange-500"/> About MindLink
          </button>
        </div>

        <button className="w-full p-5 bg-red-900/20 text-red-500 rounded-3xl flex items-center justify-center gap-2 font-bold border border-red-900/30">
          <LogOut size={20}/> Log Out
        </button>
      </div>
    </div>
  );
};
export default Settings;