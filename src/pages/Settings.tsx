import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Moon, Sun, Monitor, Type, Globe, FileText, Shield, Trash2, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
          </h2
  <div className="glass-card rounded-xl p-4 space-y-6">
    {/* Email Display */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-muted-foreground">Account Email</label>
      <div className="p-2 border rounded-lg bg-muted/50 font-mono text-sm">
        {/* Supabase user ရဲ့ email ကို ဒီမှာပြပါမယ် */}
        {user?.email || "Loading..."}
      </div>
    </div>

    {/* Change Password Form */}
    <div className="space-y-3">
      <label className="text-sm font-medium text-muted-foreground">Change Password</label>
      <input 
        type="password" 
        placeholder="Enter new password" 
        className="w-full p-2 border rounded-lg bg-background"
        id="new-password"
      />
      <Button 
        onClick={() => {/* Password update function ကို ဒီမှာခေါ်ပါမယ် */}}
        className="w-full"
      >
        Update Password
      </Button>
    </div>

    <div className="border-t pt-4">
      {/* လက်ရှိရှိနေတဲ့ Clear History ခလုတ်ကို ဒီအောက်မှာ ဆက်ထားပါ */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Clear History</p>
          <p className="text-xs text-muted-foreground">Delete all your documents and summaries</p>
        </div>
        {/* ... Clear History Button ... */}
      </div>
    </div>
  </div>
</section>
          <div className="glass-card rounded-xl p-4 space-y-4">
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
      </main>
    </div>
  );
};

export default Settings;
