import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserSettings {
  aiModel: string;
  language: string;
  fontSize: string;
  theme: string;
  summaryLanguage: string;
}

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    aiModel: "gemini-pro",
    language: "en",
    fontSize: "medium",
    theme: "system",
    summaryLanguage: "Myanmar",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from("user_settings")
            .select("ai_model_preference, summary_language, font_size, theme, language")
            .eq("user_id", user.id)
            .maybeSingle();

          if (data && !error) {
            setSettings({
              aiModel: data.ai_model_preference || "gemini-pro",
              language: data.language || "en",
              fontSize: data.font_size || "medium",
              theme: data.theme || "system",
              summaryLanguage: data.summary_language || "Myanmar",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase
          .from("user_settings")
          .update({
            ai_model_preference: updatedSettings.aiModel,
            summary_language: updatedSettings.summaryLanguage,
            font_size: updatedSettings.fontSize,
            theme: updatedSettings.theme,
            language: updatedSettings.language,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };

  const clearHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Delete all summaries first (due to foreign key constraint)
        const { data: docs } = await supabase
          .from("documents")
          .select("id")
          .eq("user_id", user.id);

        if (docs && docs.length > 0) {
          const docIds = docs.map(doc => doc.id);
          await supabase
            .from("summaries")
            .delete()
            .in("doc_id", docIds);
        }

        // Then delete all documents
        await supabase
          .from("documents")
          .delete()
          .eq("user_id", user.id);

        return { success: true };
      }
      return { success: false, error: "No user found" };
    } catch (error) {
      console.error("Error clearing history:", error);
      return { success: false, error };
    }
  };

  const deleteAccount = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Delete all user data in order (respect foreign keys)
        const { data: docs } = await supabase
          .from("documents")
          .select("id")
          .eq("user_id", user.id);

        if (docs && docs.length > 0) {
          const docIds = docs.map(doc => doc.id);
          await supabase.from("summaries").delete().in("doc_id", docIds);
        }

        await supabase.from("documents").delete().eq("user_id", user.id);
        await supabase.from("user_settings").delete().eq("user_id", user.id);
        await supabase.from("profiles").delete().eq("id", user.id);

        // Sign out the user (account deletion requires admin SDK)
        await supabase.auth.signOut();

        return { success: true };
      }
      return { success: false, error: "No user found" };
    } catch (error) {
      console.error("Error deleting account:", error);
      return { success: false, error };
    }
  };

  return { settings, updateSettings, isLoading, clearHistory, deleteAccount };
};
