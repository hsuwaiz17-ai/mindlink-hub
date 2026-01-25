import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: { translation: { "app_title": "AI Study Assistant", "summary": "Summary", "solution": "Solution", "explanation": "Explanation", "theory": "Theory", "upload": "Upload Image", "history": "History", "settings": "Settings" } },
  mm: { translation: { "app_title": "AI လေ့လာရေးလက်ထောက်", "summary": "အနှစ်ချုပ်", "solution": "အဖြေရှာ", "explanation": "စကားပြေ", "theory": "သီအိုရီ", "upload": "ဓာတ်ပုံတင်ရန်", "history": "မှတ်တမ်း", "settings": "ဆက်တင်" } },
  zh: { translation: { "app_title": "AI 学习助手", "summary": "总结", "solution": "解决方案", "explanation": "解释", "theory": "理论", "upload": "上传图片", "history": "历史", "settings": "设置" } },
  hi: { translation: { "app_title": "AI अध्ययन सहायक", "summary": "सारांश", "solution": "समाधान", "explanation": "व्याख्या", "theory": "सिद्धांत", "upload": "छवि अपलोड करें", "history": "इतिहास", "settings": "सेटिंग्स" } },
  es: { translation: { "app_title": "Asistente de Estudio IA", "summary": "Resumen", "solution": "Solución", "explanation": "Explicación", "theory": "Teoría", "upload": "Subir imagen", "history": "Historial", "settings": "Ajustes" } },
  fr: { translation: { "app_title": "Assistant d'Étude IA", "summary": "Résumé", "solution": "Solution", "explanation": "Explication", "theory": "Théorie", "upload": "Charger image", "history": "Historique", "settings": "Paramètres" } },
  ar: { translation: { "app_title": "مساعد الدراسة الذكي", "summary": "ملخص", "solution": "حل", "explanation": "شرح", "theory": "نظرية", "upload": "تحميل صورة", "history": "سجل", "settings": "إعدادات" } },
  ru: { translation: { "app_title": "ИИ Помощник для учебы", "summary": "Краткое содержание", "solution": "Решение", "explanation": "Объяснение", "theory": "Теория", "upload": "Загрузить фото", "history": "История", "settings": "Настройки" } },
  ja: { translation: { "app_title": "AI 学習アシスタント", "summary": "要約", "solution": "解決策", "explanation": "説明", "theory": "理論", "upload": "画像をアップロード", "history": "履歴", "settings": "設定" } },
  de: { translation: { "app_title": "KI-Lernassistent", "summary": "Zusammenfassung", "solution": "Lösung", "explanation": "Erklärung", "theory": "Theorie", "upload": "Bild hochladen", "history": "Verlauf", "settings": "Einstellungen" } },
  ko: { translation: { "app_title": "AI 학습 보조 도구", "summary": "요약", "solution": "해결책", "explanation": "설명", "theory": "이론", "upload": "이미지 업로드", "history": "기록", "settings": "설정" } },
  th: { translation: { "app_title": "ผู้ช่วยการเรียนรู้ AI", "summary": "สรุป", "solution": "วิธีแก้", "explanation": "คำอธิบาย", "theory": "ทฤษฎี", "upload": "อัปโหลดรูปภาพ", "history": "ประวัติ", "settings": "การตั้งค่า" } },
  vi: { translation: { "app_title": "Trợ lý Học tập AI", "summary": "Tóm tắt", "solution": "Giải pháp", "explanation": "Giải thích", "theory": "Lý thuyết", "upload": "Tải ảnh lên", "history": "Lịch sử", "settings": "Cài đặt" } }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
