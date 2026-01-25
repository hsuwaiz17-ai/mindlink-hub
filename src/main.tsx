import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n"; // i18n configuration ကို App မပွင့်ခင် အရင်ဆုံး load လုပ်ပေးရပါမယ်

createRoot(document.getElementById("root")!).render(<App />);
