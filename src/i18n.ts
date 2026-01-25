import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ဘာသာစကားအားလုံးကို စာရင်းလုပ်ထားခြင်း (Global Platform အတွက်)
export const supportedLanguages = [
  { code: 'en', name: 'English' },
  { code: 'mm', name: 'မြန်မာဘာသာ' },
  { code: 'zh', name: '中文 (Chinese)' },
  { code: 'hi', name: 'हिन्दी (Hindi)' },
  { code: 'es', name: 'Español (Spanish)' },
  { code: 'fr', name: 'Français (French)' },
  { code: 'ar', name: 'العربية (Arabic)' },
  { code: 'ru', name: 'Русский (Russian)' },
  { code: 'ja', name: '日本語 (Japanese)' },
  { code: 'de', name: 'Deutsch (German)' },
  { code: 'ko', name: '한국어 (Korean)' },
  { code: 'th', name: 'ไทย (Thai)' },
  { code: 'vi', name: 'Tiếng Việt (Vietnamese)' }
  // ဒီမှာ နောက်ထပ် ဘာသာစကားတွေ အများကြီး ထပ်တိုးလို့ ရပါတယ်
];

const resources = {
  en: { translation: { 
    "app_title": "AI Study Assistant", 
    "summary": "Summary", 
    "solution": "Solution", 
    "explanation": "Explanation", 
    "theory": "Theory", 
    "upload": "Upload", 
    "history": "History", 
    "settings": "Settings",
    "forgot_password": "Forgot Password?",
    "export_pdf": "Save as PDF",
    "scan_text": "Scan Image",
    "input_placeholder": "Type or upload your question here..."
  }},
  mm: { translation: { 
    "app_title": "AI လေ့လာရေးလက်ထောက်", 
    "summary": "အနှစ်ချုပ်", 
    "solution": "အဖြေရှာ", 
    "explanation": "စကားပြေပြန်", 
    "theory": "သီအိုရီရှာ", 
    "upload": "ဖိုင်တင်ရန်", 
    "history": "မှတ်တမ်း", 
    "settings": "ဆက်တင်",
    "forgot_password": "စကားဝှက်မေ့နေပါသလား?",
    "export_pdf": "PDF ဖြင့်သိမ်းမည်",
    "scan_text": "စာသားဖတ်ရန် (Scan)",
    "input_placeholder": "မေးခွန်းရိုက်ပါ သို့မဟုတ် ဖိုင်တင်ပါ..."
  }},
  // ... တခြားဘာသာစကားများ (သင်ရေးထားတဲ့အတိုင်း ဆက်ရှိနေပါမယ်)
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage'] // User ရွေးထားတဲ့ ဘာသာစကားကို မှတ်ထားပေးမယ်
    }
  });

export default i18n;
