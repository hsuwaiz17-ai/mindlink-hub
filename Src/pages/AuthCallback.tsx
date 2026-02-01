import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        navigate('/'); // Login အောင်မြင်ရင် Dashboard သွားမယ်
      } else {
        navigate('/auth'); // မအောင်မြင်ရင် Auth ပြန်သွားမယ်
      }
    };
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#050A18] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-white font-medium">Authenticating MindLink...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
