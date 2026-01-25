import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: { translation: { "scan": "Scan", "text": "Text", "summarize": "Summarize", "settings": "Settings", "history": "History" }},
  mm: { translation: { "scan": "စကန်ဖတ်", "text": "စာသား", "summarize": "အနှစ်ချုပ်", "settings": "ဆက်တင်", "history": "မှတ်တမ်း" }},
  jp: { translation: { "scan": "スキャン", "text": "テキスト", "summarize": "要約", "settings": "設定", "history": "履歴" }}
};

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources, fallbackLng: 'en', interpolation: { escapeValue: false }
});

export default i18n;