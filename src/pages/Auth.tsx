import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail, Lock, ArrowLeft } from "lucide-react"; // ArrowLeft ထပ်ပေါင်းထားတယ်
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
import { supabase } from "@/integrations/supabase/client"; // Supabase client တိုက်ရိုက်ခေါ်သုံးဖို့

const authSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal('')),
});

type AuthFormData = z.infer<typeof authSchema>;

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Forgot Password state အသစ်
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { user, signInWithEmail, signUpWithEmail } = useAuth();

  const form = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) { navigate("/"); }
  }, [user, navigate]);

  // Forgot Password လုပ်ဆောင်ချက်
  const handleForgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?type=recovery`,
      });
      if (error) throw error;
      toast.success("Password reset link sent to your email!");
      setIsForgotPassword(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: AuthFormData) => {
    if (isForgotPassword) {
      handleForgotPassword(data.email);
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error } = await signUpWithEmail(data.email, data.password!);
        if (error) {
          toast.error(error.message.includes("already registered") 
            ? "This email is already registered." 
            : error.message);
        } else {
          toast.success("Account created! Please check your email.");
        }
      } else {
        const { error } = await signInWithEmail(data.email, data.password!);
        if (error) {
          toast.error(error.message.includes("Invalid login credentials") 
            ? "Invalid email or password." 
            : error.message);
        } else {
          toast.success("Welcome back!");
          navigate("/");
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">M</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">MindLink</h1>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-2">
            {isForgotPassword ? "Reset Password" : isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground text-center mb-6">
            {isForgotPassword 
              ? "Enter your email to receive a reset link" 
              : isSignUp ? "Sign up to start summarizing content" : "Sign in to continue to MindLink"}
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="you@example.com" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isForgotPassword && ( // Password field ကို Forgot Password mode မှာ ဖျောက်ထားမယ်
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        {!isSignUp && (
                          <button
                            type="button"
                            onClick={() => setIsForgotPassword(true)}
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot?
                          </button>
                        )}
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                ) : isForgotPassword ? (
                  "Send Reset Link"
                ) : isSignUp ? (
                  "Create account"
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isForgotPassword ? (
              <button 
                onClick={() => setIsForgotPassword(false)} 
                className="flex items-center gap-2 mx-auto text-primary hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Sign In
              </button>
            ) : (
              <>
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="font-medium text-primary hover:underline"
                >
                  {isSignUp ? "Sign in" : "Sign up"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
