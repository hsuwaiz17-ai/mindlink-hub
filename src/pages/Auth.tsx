import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl border border-slate-800 text-center shadow-2xl">
        <h1 className="text-3xl font-bold text-blue-500 mb-2 italic">Welcome from MindLink</h1>
        <p className="text-slate-400 mb-8 text-sm">သင့်ရဲ့ AI အဖော်မွန် MindLink မှ ကြိုဆိုပါတယ်</p>
        <div className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-4 bg-slate-800 rounded-xl outline-none border border-transparent focus:border-blue-500" />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Password" className="w-full p-4 bg-slate-800 rounded-xl outline-none border border-transparent focus:border-blue-500" />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-4 text-slate-500">
              {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
            </button>
          </div>
          <button className="w-full bg-blue-600 py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 active:scale-95 transition">Sign In</button>
        </div>
      </div>
    </div>
  );
};
export default Auth;