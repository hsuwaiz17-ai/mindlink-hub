import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, ArrowLeft, Eye, EyeOff } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
});

type AuthFormData = z.infer<typeof authSchema>;

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Password toggle state
  const navigate = useNavigate();
  const { user, signInWithEmail, signUpWithEmail } = useAuth();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (user) { navigate("/"); }
  }, [user, navigate]);

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email);
        if (error) throw error;
        toast.success("Reset link sent!");
      } else if (isSignUp) {
        const { error } = await signUpWithEmail(data.email, data.password!);
        if (error) throw error;
        toast.success("Check your email to confirm!");
      } else {
        const { error } = await signInWithEmail(data.email, data.password!);
        if (error) throw error;
        toast.success("Welcome back!");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg mb-4">
            <span className="text-3xl font-bold text-white">M</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">MindLink</h1>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">
            {isForgotPassword ? "Reset Password" : isSignUp ? "Create Account" : "Welcome To MindLink"}
          </h2>
          <p className="text-slate-500 text-center mb-6">
            {isSignUp ? "Join us today" : "Your AI-powered knowledge hub"}
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Input placeholder="name@email.com" className="pl-11 h-12 rounded-xl border-slate-200 focus:border-indigo-500" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isForgotPassword && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between">
                        <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
                        <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-indigo-600 font-semibold hover:underline">Forgot?</button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-11 pr-11 h-12 rounded-xl border-slate-200" {...field} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-lg font-bold transition-all shadow-md" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : (isSignUp ? "Sign Up" : "Sign In")}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <button onClick={() => { setIsSignUp(!isSignUp); setIsForgotPassword(false); }} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              {isSignUp ? "Already have an account? Sign In" : "New to MindLink? Create an account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
