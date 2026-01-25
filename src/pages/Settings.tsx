import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Globe, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-6">
      <div className="flex items-center gap-4 mb-10">
        <button onClick={() => navigate(-1)} className="p-2 bg-slate-800 rounded-full"><ChevronLeft/></button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center gap-3 mb-4 text-blue-400"><Globe/> <span className="font-bold">App Language</span></div>
        <div className="grid grid-cols-2 gap-3">
          {['en', 'mm', 'jp'].map((lang) => (
            <button key={lang} onClick={() => i18n.changeLanguage(lang)} className="py-3 rounded-2xl bg-slate-800 border border-slate-700 uppercase">{lang}</button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Settings;