import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, KeyRound, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- UTILS ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- COMPONENT: GLASS CARD ---
const GlassCard = ({ children, className = "" }: any) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-orange-100/60 bg-white/60 backdrop-blur-xl shadow-xl shadow-orange-900/5",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    // Simulate API call or redirect
    navigate("/reset-password", { state: { email: email } });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FFF8F0] relative overflow-hidden p-4 font-sans selection:bg-orange-200 selection:text-orange-900">
      
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-r from-orange-200 to-amber-100 rounded-full blur-[100px] opacity-50" 
        />
        <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-l from-red-200 to-orange-100 rounded-full blur-[100px] opacity-50" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-soft-light"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6, ease: "easeOut" }} 
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
              <div className="relative w-16 h-16 bg-white border border-orange-100 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/10">
                <KeyRound className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Forgot Password?</h2>
            <p className="text-slate-500 text-sm font-medium">Enter your email to proceed to password reset.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <Label htmlFor="email" className="text-slate-700 font-bold group-focus-within:text-orange-600 transition-colors">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors w-5 h-5" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email} 
                  onChange={(e) => { setEmail(e.target.value); setError(""); }} 
                  className="bg-white/50 border-orange-200/50 text-slate-900 pl-10 placeholder:text-slate-400 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl h-12 transition-all duration-300 font-medium"
                />
              </div>
              {error && <p className="text-red-500 text-xs flex items-center gap-1 mt-1"><AlertTriangle className="w-3 h-3" /> {error}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300 hover:scale-[1.02]"
            >
              Proceed to Reset
            </Button>
          </form>

          <div className="mt-8 text-center border-t border-orange-100 pt-6">
            <Link to="/auth" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors text-sm font-bold group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}