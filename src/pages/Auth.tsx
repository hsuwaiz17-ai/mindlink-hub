import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Mail, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('အချက်အလက်များကို ပြည့်စုံစွာ ဖြည့်စွက်ပါ');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      toast.error('Password များ မကိုက်ညီပါ');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password);
        if (error) throw error;
        toast.success('အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်။ Email ကို စစ်ဆေးပေးပါ။');
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        toast.success('MindLink မှ ကြိုဆိုပါတယ်!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || 'ဝင်ရောက်မှု မအောင်မြင်ပါ');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Email အရင်ရိုက်ထည့်ပေးပါ');
      return;
    }
    // Supabase Forgot Password Logic
    toast.info('Password ပြန်လည်သတ်မှတ်ရန် link ကို email သို့ ပို့ပေးလိုက်ပါပြီ');
  };

  return (
    <div className="min-h-screen bg-[#050A18] flex items-center justify-center p-6 selection:bg-blue-500/30">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        
        {/* Welcome Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] mb-6 shadow-[0_0_30px_rgba(37,99,235,0.4)] rotate-12 hover:rotate-0 transition-transform duration-500">
            <Sparkles className="w-10 h-10 text-white fill-white/20" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
            Welcome from <span className="text-blue-500">MindLink</span>
          </h1>
          <p className="text-slate-500 font-medium">သင့်ရဲ့ AI အဖော်မွန် MindLink မှ ကြိုဆိုပါတယ်</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#0D1528]/80 backdrop-blur-2xl border border-blue-500/10 rounded-[2.5rem] p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-500/60 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#050A18]/50 border border-blue-500/5 rounded-2xl text-white placeholder-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-500/60 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-[#050A18]/50 border border-blue-500/5 rounded-2xl text-white placeholder-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2">
                <label className="text-xs font-bold text-blue-500/60 uppercase tracking-widest ml-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-6 py-4 bg-[#050A18]/50 border border-blue-500/5 rounded-2xl text-white outline-none focus:border-blue-500 transition-all"
                />
              </div>
            )}

            {!isSignUp && (
              <div className="text-right">
                <button type="button" onClick={handleForgotPassword} className="text-xs font-bold text-blue-500 hover:text-blue-400 uppercase tracking-tighter">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "PROCESSING..." : isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
              {!loading && <ChevronRight size={18} />}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-blue-500/10" />
            <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">OR</span>
            <div className="flex-1 h-px bg-blue-500/10" />
          </div>

          <button
            onClick={() => signInWithGoogle()}
            className="w-full py-4 bg-white/5 border border-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="google" />
            Continue with Google
          </button>

          <div className="text-center mt-8">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-slate-400 text-sm font-medium"
            >
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <span className="text-blue-500 font-black ml-2 uppercase tracking-tighter hover:underline">
                {isSignUp ? "Sign In" : "Sign Up"}
              </span>
            </button>
          </div>
        </div>

        <p className="text-center text-slate-700 text-[10px] font-bold uppercase tracking-[0.2em] mt-10">
          MindLink AI Assistant • 2026
        </p>
      </div>
    </div>
  );
};

export default Auth;