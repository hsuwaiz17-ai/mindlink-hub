miport { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Monitor, Type, Globe, FileText, Shield, Trash2, UserX, Lock } from "lucide-react";
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

const FONT_SIZES = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];

const APP_LANGUAGES = [
  { value: "en", label: "English" },
  { value: "my", label: "Myanmar" },
  { value: "ko", label: "Korean" },
  { value: "ja", label: "Japanese" },
  { value: "zh", label: "Chinese" },
];

const Settings = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, clearHistory, deleteAccount } = useUserSettings();
  const { theme, setTheme } = useTheme();
  const [isClearing, setIsClearing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    updateSettings({ theme: newTheme });
  };

  const handleFontSizeChange = (fontSize: string) => {
    updateSettings({ fontSize });
    document.documentElement.setAttribute("data-font-size", fontSize);
  };

  const handleLanguageChange = (language: string) => {
    updateSettings({ language });
  };

  const handleClearHistory = async () => {
    setIsClearing(true);
    const result = await clearHistory();
    setIsClearing(false);
    
    if (result.success) {
      toast.success("History cleared successfully");
    } else {
      toast.error("Failed to clear history");
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    const result = await deleteAccount();
    setIsDeleting(false);
    
    if (result.success) {
      toast.success("Account deleted successfully");
      navigate("/auth");
    } else {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-8 space-y-8">
        {/* Appearance Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            Appearance
          </h2>
          <div className="glass-card rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred color theme
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("light")}
                  className="gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("dark")}
                  className="gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("system")}
                  className="gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  System
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            Accessibility
          </h2>
          <div className="glass-card rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Font Size</Label>
                <p className="text-sm text-muted-foreground">
                  Adjust the text size throughout the app
                </p>
              </div>
              <Select value={settings.fontSize} onValueChange={handleFontSizeChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {FONT_SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Preferences
          </h2>
          <div className="glass-card rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">App Language</Label>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred language
                </p>
              </div>
              <Select value={settings.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {APP_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Legal Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Legal
          </h2>
          <div className="glass-card rounded-xl p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-foreground hover:bg-accent"
              onClick={() => navigate("/terms-of-service")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Terms of Service
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-foreground hover:bg-accent"
              onClick={() => navigate("/privacy-policy")}
            >
              <Shield className="mr-2 h-4 w-4" />
              Privacy Policy
            </Button>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Privacy & Security
          </h2>
          <div className="glass-card rounded-xl p-4 space-y-6">
            {/* Account Email Display */}
            <div className="space-y-2">
              <Label className="text-foreground">Account Email</Label>
              <div className="p-3 border border-border rounded-lg bg-muted/50 font-mono text-sm text-foreground">
                {userEmail || "Loading..."}
              </div>
            </div>

            {/* Change Password */}
            <div className="space-y-3 border-t border-border pt-4">
              <div className="space-y-0.5">
                <Label className="text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Change Password
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enter a new password (minimum 6 characters)
                </p>
              </div>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-background"
              />
              <Button
                onClick={handleUpdatePassword}
                disabled={isUpdatingPassword || !newPassword}
                className="w-full"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>

            {/* Clear History */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Clear History</Label>
                  <p className="text-sm text-muted-foreground">
                    Delete all your documents and summaries
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                      Clear
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Clear History</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all your documents and summaries. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearHistory}
                        disabled={isClearing}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isClearing ? "Clearing..." : "Clear All"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Delete Account */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground text-destructive">Delete Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all data
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="gap-2">
                      <UserX className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your account and all associated data including documents, summaries, and settings. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        {isDeleting ? "Deleting..." : "Delete Account"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
          </section>

      {/* App Ownership Section */}
      <div className="mt-12 pt-8 border-t border-muted text-center space-y-2 mb-8">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Developed & Owned by
        </p>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">
            Arkar Kyaw (2025-MIIT-ECE-050)
          </p>
          <p className="text-sm font-semibold text-foreground">
            & Hsu Wai Zin (UCSMG-25019)
          </p>
        </div>
        <p className="text-[10px] text-muted-foreground mt-4 italic">
          © 2025 MindLink. All Rights Reserved.
        </p>
      </div>
    </main>
  </div>
  );
};

export default Settings;
