import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Moon, Sun, Type, Globe, Shield, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUserSettings } from "@/hooks/useUserSettings";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { supportedLanguages } from "../i18n";

const FONT_SIZES = [
  { value: "text-sm", label: "Small" },
  { value: "text-base", label: "Medium" },
  { value: "text-lg", label: "Large" },
  { value: "text-xl", label: "Extra Large" },
];

const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { settings, updateSettings, clearHistory } = useUserSettings();
  const { theme, setTheme } = useTheme();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserEmail(user?.email || null);
    };
    getUser();
  }, []);

  const handleLanguageChange = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      updateSettings({ language: langCode });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Option: Profile ထဲမှာ Language preferences သိမ်းချင်ရင်
        await supabase.from('profiles').update({ updated_at: new Date().toISOString() }).eq('id', user.id);
      }
      
      toast.success(`${t('language_changed')} to ${langCode.toUpperCase()}`);
    } catch (error) {
      toast.error("Failed to change language");
    }
  };

  const handleFontSizeChange = (size: string) => {
    updateSettings({ fontSize: size });
    // Root element မှာ class ထည့်ပြီး App တစ်ခုလုံး font size ပြောင်းမယ်
    document.documentElement.setAttribute('data-font-size', size);
    toast.success("Font size updated");
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsUpdatingPassword(false);
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully");
      setNewPassword("");
    }
  };

  const handleDeleteHistory = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('history')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      toast.error("Failed to clear history");
    } else {
      clearHistory();
      toast.success("All history cleared permanently");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight">{t('settings')}</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8 space-y-8">
        {/* Appearance */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Sun className="h-4 w-4" /> Appearance
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base font-semibold">Theme Mode</Label>
                <p className="text-sm text-slate-500">Switch between light and dark</p>
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <Button 
                  variant={theme === "light" ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setTheme("light")}
                  className="rounded-md px-3"
                >
                  <Sun className="h-4 w-4 mr-1.5" /> Light
                </Button>
                <Button 
                  variant={theme === "dark" ? "secondary" : "ghost"} 
                  size="sm" 
                  onClick={() => setTheme("dark")}
                  className="rounded-md px-3"
                >
                  <Moon className="h-4 w-4 mr-1.5" /> Dark
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Type className="h-4 w-4" /> Preferences
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Font Size</Label>
              <Select value={settings.fontSize} onValueChange={handleFontSizeChange}>
                <SelectTrigger className="w-36 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONT_SIZES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-6">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-indigo-500" />
                <Label className="text-base font-semibold">App Language</Label>
              </div>
              <Select value={i18n.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-36 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map(l => (
                    <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Shield className="h-4 w-4" /> Security & Privacy
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <div className="space-y-2">
              <Label className="text-slate-500">Account Email</Label>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl font-mono text-sm border border-slate-100 dark:border-slate-800">
                {userEmail || "loading..."}
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-50 dark:border-slate-800 pt-6">
              <Label className="flex items-center gap-2 font-semibold">
                <Lock className="h-4 w-4 text-amber-500" /> Change Password
              </Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="rounded-xl"
                />
                <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword || !newPassword} className="rounded-xl bg-indigo-600">
                  {isUpdatingPassword ? "..." : "Update"}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-6">
              <div className="space-y-0.5">
                <Label className="text-red-500 font-bold">Clear History</Label>
                <p className="text-xs text-slate-400">Permanently delete AI chat logs</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" className="text-red-500 hover:bg-red-50 rounded-xl">
                    <Trash2 className="h-4 w-4 mr-1" /> Clear
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-3xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will erase your entire history from our database. This action is irreversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteHistory} className="bg-red-500 hover:bg-red-600 rounded-xl">
                      Yes, Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-8 text-center space-y-3 mb-10">
          <div className="flex flex-col items-center gap-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Developed & Owned By</p>
            <p className="text-sm font-black text-slate-800 dark:text-slate-200">ARKAR KYAW & HSU WAI ZIN</p>
          </div>
          <p className="text-[10px] text-slate-400 italic">© 2026 MindLink AI. All Rights Reserved.</p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
