import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserSettings {
  aiModel: string;
  language: string;
}

export const useUserSettings = () => {
  const [settings, setSettings] = useState<UserSettings>({
    aiModel: "gemini-pro",
    language: "Myanmar",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from("user_settings")
            .select("ai_model_preference, summary_language")
            .eq("user_id", user.id)
            .single();

          if (data && !error) {
            setSettings({
              aiModel: data.ai_model_preference || "gemini-pro",
              language: data.summary_language || "Myanmar",
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
            summary_language: updatedSettings.language,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", user.id);
      }
    } catch (error) {
      console.error("Error updating user settings:", error);
    }
  };

  return { settings, updateSettings, isLoading };
};
