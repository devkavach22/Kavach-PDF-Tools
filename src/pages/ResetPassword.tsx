import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
// Assuming these are standard UI component imports from a library like Shadcn/ui
// In a single-file component, these would be substituted with simple HTML/Tailwind elements.
// For this context, we will assume the imports are handled by the environment or replaced with div/button elements.
// Since the original file used these, I will keep the component names and assume their functionality.
// If this were a pure single-file component, I'd replace them with their HTML/Tailwind equivalents.
// For now, I'll keep the imports as they refer to local modules (`@/components/ui/button`, etc.) which is common in React projects.
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft, 
  LockKeyhole, 
  CheckCircle2, 
  ShieldCheck, 
  Check, 
  Eye, 
  EyeOff 
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate } from "framer-motion";
// Particles logic is complex but assumed to be correctly imported/configured
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import axios from "axios";

// --- Utility Components and Constants ---

const particlesOptions = {
  fullScreen: { enable: false, zIndex: 0 },
  background: { color: { value: "transparent" } },
  fpsLimit: 120,
  interactivity: { events: { onHover: { enable: true, mode: "repulse" }, resize: true }, modes: { repulse: { distance: 150, duration: 0.4 } } },
  particles: {
    color: { value: ["#fb923c", "#f87171", "#fbbf24"] },
    links: { color: "#fb923c", distance: 150, enable: true, opacity: 0.2, width: 1 },
    move: { enable: true, speed: 1, direction: "none", random: true, outModes: { default: "bounce" } },
    number: { density: { enable: true, area: 800 }, value: 80 },
    opacity: { value: 0.4 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
};

function RequirementItem({ isValid, text }: { isValid: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs transition-colors duration-200 ${isValid ? "text-emerald-400" : "text-slate-500"}`}>
      {isValid ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
      <span className={`${isValid ? "text-slate-300" : "text-slate-500"}`}>{text}</span>
    </div>
  );
}

// --- Main Component ---

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve email passed from ForgotPassword page or set a mock/default
  const email = location.state?.email || "user@example.com"; // Fallback email for testing/demo

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [apiError, setApiError] = useState(""); // General API error state
  
  // Validation State for New Password
  const [newPasswordChecks, setNewPasswordChecks] = useState({
    minChars: false,
    firstUpper: false,
    hasNumber: false,
    hasSpecial: false,
    match: false,
    notOldPassword: false,
  });
  
  const [strength, setStrength] = useState({ score: 0, label: "Weak", color: "bg-red-500" });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Redirect if no email is present (user accessed page directly),
  // but allowing a fallback email for the demo environment.
  useEffect(() => {
    // In a real app, you'd strictly redirect if no email is found.
    // if (!location.state?.email) {
    //   navigate("/forgot-password");
    // }
  }, [location.state?.email, navigate]);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const particlesInit = useCallback(async (engine: Engine) => { await loadSlim(engine); }, []);

  // Real-time Validation Logic for New Password
  useEffect(() => {
    const minChars = newPassword.length >= 8;
    const firstUpper = /^[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const match = newPassword === confirm && newPassword.length > 0;
    const notOldPassword = newPassword !== oldPassword && newPassword.length > 0;

    setNewPasswordChecks({ 
      minChars, 
      firstUpper, 
      hasNumber, 
      hasSpecial, 
      match, 
      notOldPassword 
    });

    // Strength Meter Logic
    let score = 0;
    if (minChars) score++;
    if (firstUpper) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    if (score <= 1) {
      setStrength({ score, label: "Weak", color: "bg-red-500" });
    } else if (score === 2) {
       setStrength({ score, label: "Medium", color: "bg-yellow-500" });
    } else if (score >= 3) {
       if(newPassword.length >= 12) {
        setStrength({ score, label: "Strong", color: "bg-emerald-500" });
       } else {
        setStrength({ score, label: "Good", color: "bg-emerald-400" });
       }
    }

  }, [newPassword, confirm, oldPassword]);

  // Check if New Password meets all technical requirements (excluding the match check)
  const isNewPasswordValid = Object.entries(newPasswordChecks)
    .filter(([key]) => key !== 'match')
    .every(([, value]) => value);

  // Check if form can be submitted 
  const isFormValid = isNewPasswordValid && newPasswordChecks.match && oldPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOldPasswordError("");
    setApiError("");

    if (!isFormValid) return;

    // Use the API URL provided in your request
    const API_URL = 'http://localhost:5000/api/auth/change-password';

    try {
      setLoading(true);
      
      // The payload structure matches your original axios request and component state
      const payload = { 
        email, // from state/location
        oldPassword, // from input state
        newPassword // from input state
      };

      // API call using axios.put() - similar to your original request setup
      const response = await axios.put(API_URL, payload);
      
      console.log("Password change successful:", response.data);
      
      setLoading(false);
      setIsSubmitted(true);
      
      // *** MODIFIED: Redirect immediately after successful submission and state update ***
      navigate("/auth");

    } catch (err: any) {
      setLoading(false);
      
      // Detailed error handling based on Axios response structure
      let errorMsg = "An unexpected error occurred.";
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const backendError = err.response.data?.error || err.response.data?.message;
        
        if (err.response.status === 401 && (backendError?.toLowerCase().includes("incorrect old password") || backendError?.toLowerCase().includes("unauthorized"))) {
           setOldPasswordError("Incorrect Old Password. Please try again.");
        } else {
           errorMsg = backendError || `Server Error: ${err.response.status}`;
           setApiError(errorMsg);
        }
      } else if (err.request) {
        // The request was made but no response was received (e.g., server offline)
        errorMsg = "Could not connect to the server. Please check the network or server status.";
        setApiError(errorMsg);
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMsg = err.message;
        setApiError(errorMsg);
      }
      
      console.error("Password change failed:", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-4">
      <div className="absolute inset-0 z-0">
        {/* @ts-ignore */}
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
      </div>

      <motion.div onMouseMove={handleMouseMove} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group relative z-10 w-full max-w-lg rounded-3xl p-[1px] overflow-hidden">
        <motion.div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{ background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(251, 146, 60, 0.15), transparent 80%)` }}
        />

        <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg">
              {isSubmitted ? <ShieldCheck className="w-8 h-8 text-emerald-400" /> : <LockKeyhole className="w-8 h-8 text-orange-400" />}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Change Password</h2>
                  <p className="text-slate-400 text-sm">Verify your current password to set a new one for: <span className="text-orange-400 font-medium">{email}</span></p>
                </div>
                
                {apiError && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 mb-4 text-sm text-red-300 bg-red-900/50 rounded-lg border border-red-500/50" role="alert">
                    {apiError}
                  </motion.div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                   {/* Old Password Field */}
                   <div className="space-y-2">
                    <Label className="text-slate-300">Old Password</Label>
                    <Input 
                      type="password" 
                      value={oldPassword} 
                      onChange={(e) => { setOldPassword(e.target.value); setOldPasswordError(""); setApiError(""); }} 
                      className={`bg-slate-950/50 border-white/10 text-slate-100 h-11 pl-3 focus:border-orange-500 transition-all ${oldPasswordError ? 'border-red-500/50' : ''}`} 
                      placeholder="••••••••"
                      required
                    />
                    {oldPasswordError && (
                        <p className="text-xs text-red-400 pt-1">{oldPasswordError}</p>
                    )}
                  </div>
                  
                  {/* New Password Field */}
                  <div className="space-y-2">
                    <Label className="text-slate-300">New Password</Label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)} 
                        className="bg-slate-950/50 border-white/10 text-slate-100 h-11 pl-3 pr-10 focus:border-orange-500 transition-all" 
                        placeholder="••••••••"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {/* Strength Meter Bar */}
                    {newPassword && (
                      <div className="space-y-1 mt-2">
                         <div className="flex justify-between text-xs">
                            <span className={strength.score > 0 ? "text-white" : "text-slate-500"}>Strength</span>
                            <span className={`${strength.color.replace('bg-', 'text-')} font-medium`}>{strength.label}</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(strength.score / 4) * 100}%` }}
                              className={`h-full ${strength.color} transition-all duration-300`} 
                            />
                         </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label className="text-slate-300">Re-Enter Password</Label>
                    <Input 
                      type="password" 
                      value={confirm} 
                      onChange={(e) => setConfirm(e.target.value)} 
                      className={`bg-slate-950/50 border-white/10 text-slate-100 h-11 pl-3 focus:border-orange-500 transition-all ${confirm.length > 0 && !newPasswordChecks.match ? 'border-red-500/50' : ''}`} 
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {/* Requirement Checklist */}
                  <div className="bg-slate-950/30 p-4 rounded-xl border border-white/5 space-y-2">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">New Password Requirements</p>
                    <RequirementItem isValid={newPasswordChecks.firstUpper} text="Starts with an uppercase letter" />
                    <RequirementItem isValid={newPasswordChecks.hasNumber} text="Contains at least one number" />
                    <RequirementItem isValid={newPasswordChecks.hasSpecial} text="Contains a special character (!@#...)" />
                    <RequirementItem isValid={newPasswordChecks.minChars} text="Minimum 8 characters long" />
                    <RequirementItem isValid={newPasswordChecks.notOldPassword} text="Must not be the same as old password" />
                    <RequirementItem isValid={newPasswordChecks.match} text="Passwords match" />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={loading || !isFormValid || !!oldPasswordError || !!apiError} 
                    className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white h-11 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-900/20"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center py-8">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                  <CheckCircle2 className="w-24 h-24 text-emerald-400 mx-auto drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
                </motion.div>
                <h2 className="text-3xl text-white font-bold mt-6">Success!</h2>
                <p className="text-slate-400 text-base mt-2">Your password has been securely changed.</p>
                {/* Removed the automatic redirect message as it is now immediate */}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <Link to="/auth" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}