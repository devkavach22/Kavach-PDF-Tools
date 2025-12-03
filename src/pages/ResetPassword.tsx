import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LockKeyhole, CheckCircle2, ShieldCheck, Check, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
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

function RequirementItem({ isValid, text }: { isValid: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs transition-colors duration-200 ${isValid ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
      {isValid ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />}
      <span className={`${isValid ? "text-emerald-700" : "text-slate-500"}`}>{text}</span>
    </div>
  );
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || "user@example.com"; 

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [apiError, setApiError] = useState(""); 
  
  const [newPasswordChecks, setNewPasswordChecks] = useState({
    minChars: false,
    firstUpper: false,
    hasNumber: false,
    hasSpecial: false,
    match: false,
    notOldPassword: false,
  });
  
  const [strength, setStrength] = useState({ score: 0, label: "Weak", color: "bg-red-500" });

  useEffect(() => {
    const minChars = newPassword.length >= 8;
    const firstUpper = /^[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const match = newPassword === confirm && newPassword.length > 0;
    const notOldPassword = newPassword !== oldPassword && newPassword.length > 0;

    setNewPasswordChecks({ 
      minChars, firstUpper, hasNumber, hasSpecial, match, notOldPassword 
    });

    let score = 0;
    if (minChars) score++;
    if (firstUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    if (score <= 1) setStrength({ score, label: "Weak", color: "bg-red-500" });
    else if (score === 2) setStrength({ score, label: "Medium", color: "bg-yellow-500" });
    else if (score >= 3) {
       if(newPassword.length >= 12) setStrength({ score, label: "Strong", color: "bg-emerald-500" });
       else setStrength({ score, label: "Good", color: "bg-emerald-400" });
    }

  }, [newPassword, confirm, oldPassword]);

  const isNewPasswordValid = Object.entries(newPasswordChecks)
    .filter(([key]) => key !== 'match')
    .every(([, value]) => value);

  const isFormValid = isNewPasswordValid && newPasswordChecks.match && oldPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOldPasswordError("");
    setApiError("");

    if (!isFormValid) return;

    const API_URL = 'http://localhost:5000/api/auth/change-password';

    try {
      setLoading(true);
      const payload = { email, oldPassword, newPassword };
      await axios.put(API_URL, payload);
      setLoading(false);
      setIsSubmitted(true);
      setTimeout(() => navigate("/auth"), 2000);

    } catch (err: any) {
      setLoading(false);
      let errorMsg = "An unexpected error occurred.";
      if (err.response) {
        const backendError = err.response.data?.error || err.response.data?.message;
        if (err.response.status === 401 && (backendError?.toLowerCase().includes("incorrect old password") || backendError?.toLowerCase().includes("unauthorized"))) {
           setOldPasswordError("Incorrect Old Password. Please try again.");
        } else {
           errorMsg = backendError || `Server Error: ${err.response.status}`;
           setApiError(errorMsg);
        }
      } else {
        errorMsg = err.message;
        setApiError(errorMsg);
      }
    }
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
        className="w-full max-w-lg relative z-10"
      >
        <GlassCard className="p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white border border-orange-100 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/10">
              {isSubmitted ? <ShieldCheck className="w-8 h-8 text-emerald-500" /> : <LockKeyhole className="w-8 h-8 text-orange-500" />}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-slate-900 mb-2">Change Password</h2>
                  <p className="text-slate-500 text-sm font-medium">Verify your current password to set a new one for: <br/><span className="text-orange-600 font-bold">{email}</span></p>
                </div>
                
                {apiError && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200 font-medium" role="alert">
                    {apiError}
                  </motion.div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                   <div className="space-y-2 group">
                    <Label className="text-slate-700 font-bold group-focus-within:text-orange-600 transition-colors">Old Password</Label>
                    <Input 
                      type="password" 
                      value={oldPassword} 
                      onChange={(e) => { setOldPassword(e.target.value); setOldPasswordError(""); setApiError(""); }} 
                      className={`bg-white/50 border-orange-200/50 text-slate-900 h-11 pl-3 focus:border-orange-500 rounded-xl transition-all ${oldPasswordError ? 'border-red-500/50' : ''}`} 
                      placeholder="••••••••"
                      required
                    />
                    {oldPasswordError && (
                        <p className="text-xs text-red-500 pt-1 font-bold">{oldPasswordError}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2 group">
                    <Label className="text-slate-700 font-bold group-focus-within:text-orange-600 transition-colors">New Password</Label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        className="bg-white/50 border-orange-200/50 text-slate-900 h-11 pl-3 pr-10 focus:border-orange-500 rounded-xl transition-all" 
                        placeholder="••••••••"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {newPassword && (
                      <div className="space-y-1 mt-2 px-1">
                         <div className="flex justify-between text-xs font-bold">
                            <span className={strength.score > 0 ? "text-slate-700" : "text-slate-400"}>Strength</span>
                            <span className={`${strength.color.replace('bg-', 'text-')}`}>{strength.label}</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(strength.score / 4) * 100}%` }}
                              className={`h-full ${strength.color} transition-all duration-300`} 
                            />
                         </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 group">
                    <Label className="text-slate-700 font-bold group-focus-within:text-orange-600 transition-colors">Re-Enter Password</Label>
                    <Input 
                      type="password" 
                      value={confirm} 
                      onChange={(e) => setConfirm(e.target.value)} 
                      className={`bg-white/50 border-orange-200/50 text-slate-900 h-11 pl-3 focus:border-orange-500 rounded-xl transition-all ${confirm.length > 0 && !newPasswordChecks.match ? 'border-red-500/50' : ''}`} 
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  <div className="bg-orange-50/50 p-4 rounded-xl border border-orange-100 space-y-2">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Requirements</p>
                    <RequirementItem isValid={newPasswordChecks.firstUpper} text="Starts with uppercase letter" />
                    <RequirementItem isValid={newPasswordChecks.hasNumber} text="Contains a number" />
                    <RequirementItem isValid={newPasswordChecks.hasSpecial} text="Contains special character" />
                    <RequirementItem isValid={newPasswordChecks.minChars} text="Min 8 characters long" />
                    <RequirementItem isValid={newPasswordChecks.match} text="Passwords match" />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading || !isFormValid || !!oldPasswordError || !!apiError} 
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white h-12 rounded-xl font-bold shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                  <CheckCircle2 className="w-24 h-24 text-emerald-500 mx-auto drop-shadow-xl" />
                </motion.div>
                <h2 className="text-3xl text-slate-900 font-black mt-6">Success!</h2>
                <p className="text-slate-500 font-medium mt-2">Your password has been securely updated.</p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-8 text-center border-t border-orange-100 pt-6">
            <Link to="/auth" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 transition-colors font-bold group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}