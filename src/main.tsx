import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n'; // i18n localization စနစ်ကို ချိတ်ဆက်ခြင်း

// App တစ်ခုလုံးကို root element ထဲမှာ render လုပ်ပေးခြင်း
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);