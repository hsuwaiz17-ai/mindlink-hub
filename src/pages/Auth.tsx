import React, { useState } from 'react';
import { Eye, EyeOff, Sparkles, Mail, Lock, ChevronRight, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Auth = () => {
  // States
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { signInWithEmail, signUpWithEmail, authLoading } = useAuth();
  const navigate = useNavigate();

  // Password Toggle Function
  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault(); // Form submit ဖြစ်မသွားအောင် တားတာပါ
    setShowPassword(!showPassword);
  };

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
      console.error("Auth Error:", error);
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
        redirectTo: `${window.location.origin}/auth/callback`,
      });

      if (error) throw error;
      toast.info('Password ပြန်လည်သတ်မှတ်ရန် link ကို email သို့ ပို့ပေးလိုက်ပါပြီ။');
    } catch (error: any) {
      toast.error(error.message || 'Email ပို့ရာတွင် အမှားတစ်ခုဖြစ်နေပါသည်။');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error('Google login failed. Please try again.');
    } finally {
      // OAuth က Redirect ဖြစ်သွားမှာမို့ loading false ပြန်လုပ်စရာမလိုပေမယ့် safety အတွက် ထားနိုင်ပါတယ်
      setTimeout(() => setGoogleLoading(false), 5000);
    }
  };

  const isProcessing = authLoading || forgotPasswordLoading || googleLoading;

  return (
    <div className="min-h-screen bg-[#050A18] flex items-center justify-center p-6 selection:bg-blue-500/30 font-sans">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        
        {/* Welcome Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2rem] mb-6 shadow-[0_0_30px_rgba(37,99,235,0.4)] rotate-12 hover:rotate-0 transition-transform duration-500 group">
            <Sparkles className="w-10 h-10 text-white fill-white/20 group-hover:animate-pulse" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">
            Welcome from <span className="text-blue-500">MindLink</span>
          </h1>
          <p className="text-slate-500 font-medium italic">"Empowering your thoughts with Intelligence"</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#0D1528]/80 backdrop-blur-2xl border border-blue-500/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
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
                  disabled={isProcessing}
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
                  disabled={isProcessing}
                  className="w-full pl-12 pr-12 py-4 bg-[#050A18]/50 border border-blue-500/5 rounded-2xl text-white placeholder-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-500 transition-colors z-20"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-bold text-blue-500/60 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isProcessing}
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
                  disabled={isProcessing}
                  className="text-[10px] font-black text-blue-500/80 hover:text-blue-400 uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  {forgotPasswordLoading ? 'SENDING...' : 'FORGOT PASSWORD?'}
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.2)] hover:shadow-[0_10px_25px_rgba(37,99,235,0.4)] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
            >
              {authLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-blue-500/10" />
            <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">OR</span>
            <div className="flex-1 h-px bg-blue-500/10" />
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isProcessing}
            className="w-full py-4 bg-[#ffffff05] border border-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {googleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Continue with Google"}
          </button>

          <div className="text-center mt-8">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={isProcessing}
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
          MindLink AI Assistant • Secure Authentication
        </p>
      </div>
    </div>
  );
};

export default Auth;
