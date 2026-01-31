import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome from MindLink",
      "scan": "Scan",
      "image": "Image",
      "text": "Text",
      "file": "File",
      "history": "History",
      "settings": "Settings",
      "profile": "Profile",
      "summarize": "Summarize",
      "answer": "Find Answer",
      "paraphrase": "Paraphrase",
      "explain": "Explain Theory",
      "signOut": "Sign Out",
      "appearance": "Appearance",
      "language": "App Language",
      "about": "About App",
      "security": "Security & Privacy"
    }
  },
  my: {
    translation: {
      "welcome": "MindLink မှ ကြိုဆိုပါသည်",
      "scan": "စကန်ဖတ်",
      "image": "ပုံ",
      "text": "စာသား",
      "file": "ဖိုင်",
      "history": "မှတ်တမ်း",
      "settings": "ဆက်တင်",
      "profile": "ပရိုဖိုင်",
      "summarize": "အနှစ်ချုပ်",
      "answer": "အဖြေရှာ",
      "paraphrase": "စကားပြေပြန်",
      "explain": "သီအိုရီရှင်း",
      "signOut": "ထွက်ရန်",
      "appearance": "အသွင်အပြင်",
      "language": "ဘာသာစကား",
      "about": "အက်ပ်အကြောင်း",
      "security": "လုံခြုံရေး"
    }
  },
  ja: {
    translation: {
      "welcome": "MindLinkへようこそ",
      "scan": "スキャン",
      "image": "画像",
      "text": "テキスト",
      "file": "ファイル",
      "history": "履歴",
      "settings": "設定",
      "profile": "プロフィール",
      "summarize": "要約",
      "answer": "回答を探す",
      "paraphrase": "言い換え",
      "explain": "理論の解説",
      "signOut": "ログアウト",
      "appearance": "外観",
      "language": "言語設定",
      "about": "アプリについて",
      "security": "セキュリティ"
    }
  },
  ko: { translation: { "scan": "스캔", "text": "텍스트", "summarize": "요약", "settings": "설정", "signOut": "로그아웃" } },
  zh: { translation: { "scan": "扫描", "text": "文本", "summarize": "总结", "settings": "设置", "signOut": "登出" } },
  th: { translation: { "scan": "สแกน", "text": "ข้อความ", "summarize": "สรุป", "settings": "การตั้งค่า", "signOut": "ออกจากระบบ" } },
  // ကျန်တဲ့ ဘာသာစကားတွေကိုလည်း ဒီပုံစံအတိုင်း ထပ်တိုးနိုင်ပါတယ်
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('i18nextLng') || 'en', // User ရွေးထားတဲ့ ဘာသာစကားကို မှတ်ထားပေးဖို့
    interpolation: { escapeValue: false }
  });

export default i18n;
