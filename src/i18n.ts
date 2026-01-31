import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Login/Auth
      "welcome": "Welcome from MindLink",
      "tagline": "Empowering your thoughts with Intelligence",
      "email": "Email Address",
      "password": "Password",
      "forgotPassword": "Forgot Password?",
      "signIn": "SIGN IN",
      "signUp": "SIGN UP",
      "continueWithGoogle": "Continue with Google",
      "dontHaveAccount": "Don't have an account?",
      "alreadyHaveAccount": "Already have an account?",
      
      // Dashboard
      "dashboard": "Dashboard",
      "scan": "SCAN",
      "image": "IMAGE",
      "type": "TYPE",
      "file": "FILE",
      "targetLanguage": "TARGET LANGUAGE",
      "summarize": "Summarize",
      "solve": "Find Answer",
      "translate": "Paraphrase",
      "explain": "Explain Theory",
      "result": "RESULT",
      "saveAsImage": "Save as Image",
      "saveAsPDF": "Save as PDF",
      "history": "HISTORY",
      "profile": "PROFILE",
      
      // Settings
      "settings": "Settings",
      "appearance": "Appearance",
      "textSize": "Text Size",
      "language": "App Language",
      "security": "Security & Privacy",
      "about": "About App",
      "signOut": "Sign Out",
      "light": "Light",
      "dark": "Dark",
      "system": "System",
      "changePassword": "Change Password",
      "currentPassword": "Current Password",
      "newPassword": "New Password",
      "confirmPassword": "Confirm Password",
      "update": "Update",
      "cancel": "Cancel",
      "owners": "Owners",
      "version": "Version",
      
      // Common
      "home": "Home",
      "back": "Back",
      "next": "Next",
      "save": "Save",
      "edit": "Edit",
      "delete": "Delete",
      "search": "Search",
      "loading": "Loading...",
      "success": "Success",
      "error": "Error",
      "noResults": "No results found"
    }
  },
  
  my: {
    translation: {
      // Login/Auth
      "welcome": "MindLink မှ ကြိုဆိုပါသည်",
      "tagline": "သင့်အတွေးများကို ဉာဏ်ရည်တုဖြင့် အစွမ်းဖွင့်ပေးခြင်း",
      "email": "အီးမေးလ် လိပ်စာ",
      "password": "စကားဝှက်",
      "forgotPassword": "စကားဝှက် မေ့နေပါသလား?",
      "signIn": "အကောင့်ဝင်မည်",
      "signUp": "အကောင့်ဖွင့်မည်",
      "continueWithGoogle": "Google ဖြင့် ဆက်လုပ်မည်",
      "dontHaveAccount": "အကောင့်မရှိသေးပါ?",
      "alreadyHaveAccount": "အကောင့်ရှိပြီးသားလား?",
      
      // Dashboard
      "dashboard": "ပင်မစာမျက်နှာ",
      "scan": "စကင်ဖတ်",
      "image": "ဓာတ်ပုံ",
      "type": "စာရိုက်",
      "file": "ဖိုင်",
      "targetLanguage": "ဘာသာပြန်မည့် ဘာသာစကား",
      "summarize": "အနှစ်ချုပ်",
      "solve": "အဖြေရှာ",
      "translate": "စကားပြေပြန်",
      "explain": "သီအိုရီရှင်းတမ်း",
      "result": "ရလာဒ်",
      "saveAsImage": "ပုံအဖြစ်သိမ်း",
      "saveAsPDF": "PDF အဖြစ်သိမ်း",
      "history": "မှတ်တမ်း",
      "profile": "ပရိုဖိုင်",
      
      // Settings
      "settings": "ဆက်တင်များ",
      "appearance": "အပြင်အဆင်",
      "textSize": "စာသားအရွယ်အစား",
      "language": "ဘာသာစကား",
      "security": "လုံခြုံရေးနှင့် ကိုယ်ရေးကိုယ်တာ",
      "about": "အက်ပ်အကြောင်း",
      "signOut": "ထွက်မည်",
      "light": "အလင်း",
      "dark": "အမှောင်",
      "system": "စနစ်အတိုင်း",
      "changePassword": "စကားဝှက်ပြောင်းမည်",
      "currentPassword": "လက်ရှိစကားဝှက်",
      "newPassword": "စကားဝှက်အသစ်",
      "confirmPassword": "စကားဝှက်အတည်ပြုပါ",
      "update": "ပြောင်းလဲမည်",
      "cancel": "မလုပ်တော့ပါ",
      "owners": "ပိုင်ရှင်များ",
      "version": "ဗားရှင်း",
      
      // Common
      "home": "ပင်မစာမျက်နှာ",
      "back": "နောက်သို့",
      "next": "ရှေ့သို့",
      "save": "သိမ်းဆည်း",
      "edit": "တည်းဖြတ်",
      "delete": "ဖျက်",
      "search": "ရှာဖွေ",
      "loading": "လုပ်ဆောင်နေသည်",
      "success": "အောင်မြင်ပါသည်",
      "error": "အမှားတစ်ခုဖြစ်နေပါသည်",
      "noResults": "ရလာဒ်မတွေ့ပါ"
    }
  },
  
  ja: {
    translation: {
      "welcome": "MindLinkへようこそ",
      "tagline": "知性であなたの思考を強化",
      "email": "メールアドレス",
      "password": "パスワード",
      "forgotPassword": "パスワードをお忘れですか？",
      "signIn": "サインイン",
      "signUp": "サインアップ",
      "continueWithGoogle": "Googleで続行",
      "dashboard": "ダッシュボード",
      "scan": "スキャン",
      "image": "画像",
      "type": "タイプ",
      "file": "ファイル",
      "settings": "設定",
      "language": "言語",
      "signOut": "サインアウト",
      "light": "ライト",
      "dark": "ダーク",
      "system": "システム"
    }
  },
  
  ko: {
    translation: {
      "welcome": "MindLink에 오신 것을 환영합니다",
      "tagline": "지능으로 당신의 생각을 강화",
      "email": "이메일 주소",
      "password": "비밀번호",
      "forgotPassword": "비밀번호를 잊으셨나요?",
      "signIn": "로그인",
      "signUp": "회원가입",
      "continueWithGoogle": "Google로 계속하기",
      "dashboard": "대시보드",
      "scan": "스캔",
      "image": "이미지",
      "type": "입력",
      "file": "파일",
      "settings": "설정",
      "language": "언어",
      "signOut": "로그아웃",
      "light": "라이트",
      "dark": "다크",
      "system": "시스템"
    }
  },
  
  zh: {
    translation: {
      "welcome": "欢迎使用 MindLink",
      "tagline": "用智能赋能您的思想",
      "email": "电子邮件地址",
      "password": "密码",
      "forgotPassword": "忘记密码？",
      "signIn": "登录",
      "signUp": "注册",
      "continueWithGoogle": "使用 Google 继续",
      "dashboard": "仪表板",
      "scan": "扫描",
      "image": "图片",
      "type": "输入",
      "file": "文件",
      "settings": "设置",
      "language": "语言",
      "signOut": "退出登录",
      "light": "浅色",
      "dark": "深色",
      "system": "系统"
    }
  },
  
  th: {
    translation: {
      "welcome": "ยินดีต้อนรับสู่ MindLink",
      "tagline": "เสริมพลังความคิดด้วยปัญญา",
      "email": "อีเมล",
      "password": "รหัสผ่าน",
      "forgotPassword": "ลืมรหัสผ่าน?",
      "signIn": "เข้าสู่ระบบ",
      "signUp": "สมัครสมาชิก",
      "continueWithGoogle": "ดำเนินการต่อด้วย Google",
      "dashboard": "แดชบอร์ด",
      "scan": "สแกน",
      "image": "รูปภาพ",
      "type": "พิมพ์",
      "file": "ไฟล์",
      "settings": "การตั้งค่า",
      "language": "ภาษา",
      "signOut": "ออกจากระบบ",
      "light": "สว่าง",
      "dark": "มืด",
      "system": "ระบบ"
    }
  },
  
  // Add more languages as needed...
  // hi: { translation: { ... } }, // Hindi
  // fr: { translation: { ... } }, // French
  // de: { translation: { ... } }, // German
  // es: { translation: { ... } }, // Spanish
  // ru: { translation: { ... } }, // Russian
  // ar: { translation: { ... } }, // Arabic
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('mindlink-language') || 'en',
    interpolation: { 
      escapeValue: false 
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'mindlink-language',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: true,
    },
  });

// Save language preference
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('mindlink-language', lng);
  console.log('Language changed to:', lng);
});

export default i18n;
