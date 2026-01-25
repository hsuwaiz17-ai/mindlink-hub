import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // i18n သုံးဖို့
import { ArrowLeft, Moon, Sun, Monitor, Type, Globe, Shield, Lock } from "lucide-react";
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
import { supportedLanguages } from "../i18n"; // i18n.ts က language list ကို ယူသုံးမယ်

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
  const [isClearing, setIsClearing] = useState(false);
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

  // ဘာသာစကားပြောင်းလဲခြင်း
  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    updateSettings({ language: langCode });
    toast.success(`Language changed to ${langCode.toUpperCase()}`);
  };

  // စာလုံးအရွယ်အစား ပြောင်းလဲခြင်း
  const handleFontSizeChange = (size: string) => {
    updateSettings({ fontSize: size });
    // HTML tag မှာ class အနေနဲ့ ထည့်ပေးခြင်းဖြင့် App တစ်ခုလုံးကို သက်ရောက်စေမယ်
    document.documentElement.className = `${theme} ${size}`;
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
      toast.error("Failed to update password");
    } else {
      toast.success("Password updated successfully");
      setNewPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">{t('settings')}</h1>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8 space-y-8">
        {/* Appearance Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            Appearance
          </h2>
          <div className="glass-card rounded-xl p-4 space-y-4 border border-border bg-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Dark & Light mode toggle</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant={theme === "light" ? "default" : "outline"} size="sm" onClick={() => setTheme("light")}>
                  <Sun className="h-4 w-4 mr-1" /> Light
                </Button>
                <Button variant={theme === "dark" ? "default" : "outline"} size="sm" onClick={() => setTheme("dark")}>
                  <Moon className="h-4 w-4 mr-1" /> Dark
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            Preferences
          </h2>
          <div className="glass-card rounded-xl p-4 space-y-4 border border-border bg-card">
            {/* Font Size Selector */}
            <div className="flex items-center justify-between">
              <Label>Font Size</Label>
              <Select value={settings.fontSize} onValueChange={handleFontSizeChange}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Select size" /></SelectTrigger>
                <SelectContent>
                  {FONT_SIZES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Global Language Selector */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary" />
                <Label>App Language</Label>
              </div>
              <Select value={i18n.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map(l => (
                    <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security
          </h2>
          <div className="glass-card rounded-xl p-4 space-y-6 border border-border bg-card">
            <div className="space-y-2">
              <Label>Account Email</Label>
              <div className="p-3 border rounded-lg bg-muted/50 font-mono text-sm">{userEmail || "..."}</div>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <Label className="flex items-center gap-2"><Lock className="h-4 w-4" /> Change Password</Label>
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Button onClick={handleUpdatePassword} disabled={isUpdatingPassword || !newPassword} className="w-full">
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>

            {/* Clear History */}
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="space-y-0.5">
                <Label className="text-destructive">Clear All History</Label>
                <p className="text-xs text-muted-foreground">This action cannot be undone</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild><Button variant="outline" size="sm">Delete</Button></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently clear your AI analysis history.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { setIsClearing(true); clearHistory(); setIsClearing(false); }} className="bg-destructive text-white">Clear All</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </section>

        {/* Ownership Footer */}
        <div className="mt-12 pt-8 border-t border-muted text-center space-y-2 mb-8">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Developed & Owned by</p>
          <p className="text-sm font-bold text-foreground">Arkar Kyaw & Hsu Wai Zin</p>
          <p className="text-[10px] text-muted-foreground mt-4 italic">© 2025 MindLink. All Rights Reserved.</p>
        </div>
      </main>
    </div>
  );
};

export default Settings;
