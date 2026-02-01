import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Email နှင့် Password ဖြည့်ပါ");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Account ဖန်တီးပြီးပါပြီ — Email စစ်ဆေးပါ");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Password reset လုပ်ရန် Email ထည့်ပါ");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Password reset link ကို Email သို့ပို့ပြီးပါပြီ");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center">
          Welcome from <span className="text-primary">MindLink</span>
        </h1>

        {/* Email */}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Forgot password */}
        {!isSignup && (
          <button
            onClick={handleForgotPassword}
            className="text-sm text-right text-primary hover:underline w-full"
          >
            Forgot password?
          </button>
        )}

        {/* Sign in / Sign up */}
        <Button
          className="w-full"
          onClick={handleAuth}
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : isSignup
            ? "Create Account"
            : "Sign In"}
        </Button>

        {/* Toggle */}
        <p className="text-center text-sm">
          {isSignup ? "Account ရှိပြီးသားလား?" : "Account မရှိသေးဘူးလား?"}{" "}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-primary font-medium hover:underline"
          >
            {isSignup ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </Card>
    </div>
  );
}
