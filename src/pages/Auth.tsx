import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Mail, Lock, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithGoogle, authLoading } = useAuth();
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

    try {
      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password);
        if (error) throw error;
        toast.success('အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်။ Email တွင် Confirm လုပ်ပေးပါ။');
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        toast.success('MindLink မှ ကြိုဆိုပါတယ်!');
        navigate('/');
      }
    } catch (error: any) {
      const message = error.message === "Invalid login credentials" 
        ? "Email သို့မဟုတ် Password မှားယွင်းနေပါသည်" 
        : error.message;
      toast.error(message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Email အရင်ရိုက်ထည့်ပေးပါ');
      return;
    }
    
    setForgotPasswordLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.info('Password ပြန်လည်သတ်မှတ်ရန် link ကို email သို့ ပို့ပေးလိုက်ပါပြီ။ Email ကိုစစ်ဆေးပေးပါ။');
      }
    } catch (error: any) {
      toast.error('Email ပို့ရာတွင် အမှားတစ်ခုဖြစ်နေပါသည်။');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error('Google အကောင့်ဖြင့် ဝင်ရောက်ရာတွင် အမှားတစ်ခုဖြစ်နေပါသည်။');
      }
      // Supabase will handle the OAuth redirect automatically
    } catch (error: any) {
      toast.error('Google sign in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050A18] flex items-center justify-center p-6 selection:bg-blue-500/30 font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        
        {/* Welcome Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] mb-6 shadow-[0_0_30px_rgba(37,99,235,0.4)] rotate-12 hover:rotate-0 transition-transform duration-500 group">
            <Sparkles className="w-10 h-10 text-white fill-white/20 group-hover:animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
            MindLink <span className="text-blue-500">AI</span>
          </h1>
          <p className="text-slate-500 font-medium italic">"Empowering your thoughts with Intelligence"</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#0D1528]/80 backdrop-blur-2xl border border-blue-500/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full" />
          
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-500/60 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={authLoading || forgotPasswordLoading || googleLoading}
                  className="w-full pl-12 pr-4 py-4 bg-[#050A18]/50 border border-blue-500/5 rounded-2xl text-white placeholder-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-500/60 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={authLoading || forgotPasswordLoading || googleLoading}
                  className="w-full pl-12 pr-12 py-4 bg-[#050A18]/50 border border-blue-500/5 rounded-2xl text-white placeholder-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={authLoading || forgotPasswordLoading || googleLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-500 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold text-blue-500/60 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={authLoading || forgotPasswordLoading || googleLoading}
                    className="w-full pl-12 pr-4 py-4 bg-[#050A18]/50 border border-blue-500/5 rounded-2xl text-white outline-none focus:border-blue-500 transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            {!isSignUp && (
              <div className="text-right">
                <button 
                  type="button" 
                  onClick={handleForgotPassword} 
                  disabled={authLoading || forgotPasswordLoading || googleLoading}
                  className="text-[10px] font-black text-blue-500/80 hover:text-blue-400 uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forgotPasswordLoading ? (
                    <span className="flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      SENDING EMAIL...
                    </span>
                  ) : (
                    'FORGOT PASSWORD?'
                  )}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading || forgotPasswordLoading || googleLoading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {authLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  PROCESSING...
                </>
              ) : (
                <>
                  {isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-blue-500/10" />
            <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">OR</span>
            <div className="flex-1 h-px bg-blue-500/10" />
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={authLoading || forgotPasswordLoading || googleLoading}
            className="w-full py-4 bg-[#ffffff05] border border-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                CONNECTING TO GOOGLE...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="text-center mt-8">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={authLoading || forgotPasswordLoading || googleLoading}
              className="text-slate-400 text-sm font-medium disabled:opacity-50"
            >
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <span className="text-blue-500 font-black ml-2 uppercase tracking-tighter hover:underline">
                {isSignUp ? "Sign In" : "Sign Up"}
              </span>
            </button>
          </div>
        </div>

        <p className="text-center text-slate-700 text-[10px] font-bold uppercase tracking-[0.2em] mt-10">
          MindLink AI Assistant • Secure Authentication
        </p>
      </div>
    </div>
  );
};

export default Auth;
