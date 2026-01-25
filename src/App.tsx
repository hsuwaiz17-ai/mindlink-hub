import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import History from "./pages/History";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// React Query အတွက် client သတ်မှတ်ခြင်း
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Dashboard (ပင်မစာမျက်နှာ) */}
          <Route path="/" element={<Index />} />
          
          {/* Login/Register စာမျက်နှာ */}
          <Route path="/auth" element={<Auth />} />
          
          {/* History (မှတ်တမ်း) စာမျက်နှာ */}
          <Route path="/history" element={<History />} />
          
          {/* Settings (ဆက်တင်) စာမျက်နှာ */}
          <Route path="/settings" element={<Settings />} />
          
          {/* လမ်းကြောင်းမှားလျှင် 404 ပြရန် */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;