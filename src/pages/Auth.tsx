import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Shield, ArrowRight, CheckCircle2, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from "framer-motion";
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";
import Kavachlogo from "@/assets/kavach (3).png"; // Ensure this exists
import axios from "axios";

// --- Particles Config (Matched to Landing.tsx) ---
const particlesOptions = {
  fullScreen: { enable: false, zIndex: 0 },
  background: { color: { value: "transparent" } },
  fpsLimit: 120,
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      resize: true,
    },
    modes: {
      repulse: { distance: 150, duration: 0.4 },
    },
  },
  particles: {
    color: { value: ["#fb923c", "#f87171", "#fbbf24"] }, // Orange, Red, Amber
    links: {
      color: "#fb923c",
      distance: 150,
      enable: true,
      opacity: 0.2,
      width: 1,
    },
    move: {
      enable: true,
      speed: 1,
      direction: "none",
      random: true,
      outModes: { default: "bounce" },
    },
    number: { density: { enable: true, area: 800 }, value: 80 },
    opacity: { value: 0.4 },
    shape: { type: "circle" },
    size: { value: { min: 1, max: 3 } },
  },
  detectRetina: true,
};

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // --- Form State ---
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [activeTab, setActiveTab] = useState("login");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token") || "";
    const data = JSON.stringify({ "email": loginEmail, "password": loginPassword });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:5000/api/auth/login',
      headers: { 'Authorization': token, 'Content-Type': 'application/json' },
      data : data
    };

    try {
      const response = await axios.request(config);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      localStorage.setItem("user", JSON.stringify(response.data));
      toast({ title: "Access Granted", description: response.data.message || "Welcome back to Kavach Protocol." });
      navigate("/dashboard");
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Login Error",
        description: error.response?.data?.message || "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const token = localStorage.getItem("token") || "";
    const data = JSON.stringify({
      "name": signupName,
      "email": signupEmail,
      "password": signupPassword,
      "role": "user"
    });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'http://localhost:5000/api/auth/register',
      headers: { 'Authorization': token, 'Content-Type': 'application/json' },
      data : data
    };

    try {
      const response = await axios.request(config);
      localStorage.setItem("registrationData", JSON.stringify(response.data));
      toast({ title: "Identity Verified", description: "Your secure workspace is initializing. Please log in." });
      setLoginEmail(signupEmail);
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      setActiveTab("login");
    } catch (error: any) {
      toast({
        title: "Signup Error",
        description: error.response?.data?.message || "Could not create account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-4 md:p-8 font-sans selection:bg-orange-500/30 selection:text-orange-100">
      
      {/* --- Background Ambience --- */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-orange-600/20 blur-[120px] rounded-full mix-blend-screen" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-red-600/15 blur-[120px] rounded-full mix-blend-screen" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
         {/* @ts-ignore */}
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className="h-full w-full" />
      </div>

      <motion.div
        onMouseMove={handleMouseMove}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="group relative z-10 w-full max-w-5xl rounded-3xl p-[1px] overflow-hidden"
      >
        {/* Spotlight Gradient Border (Orange/Red) */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(251, 146, 60, 0.15),
                transparent 80%
              )
            `,
          }}
        />

        <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          
          {/* === Left Column: Form Section === */}
          <motion.div layout className="flex flex-col justify-center p-8 md:p-12 relative z-20">
            <div className="flex justify-center lg:justify-start mb-8 items-center gap-2">
              <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">KAVACH</span>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-950/60 border border-white/10 rounded-xl p-1 mb-8">
                <TabsTrigger
                  value="login"
                  className="rounded-lg data-[state=active]:bg-slate-800 data-[state=active]:text-orange-400 text-slate-400 font-medium transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="rounded-lg data-[state=active]:bg-slate-800 data-[state=active]:text-orange-400 text-slate-400 font-medium transition-all duration-300"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent key="login" value="login" className="mt-0 focus-visible:outline-none">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
                      <p className="text-slate-400">Enter your credentials to decrypt your vault.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-5">
                      <div className="space-y-2 group">
                        <Label htmlFor="email" className="text-slate-300 transition-colors group-focus-within:text-orange-400">Email Address</Label>
                        <Input
                          id="email" type="email" placeholder="name@company.com" required
                          className="bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg h-11 transition-all duration-300"
                          value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 group">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="password" className="text-slate-300 transition-colors group-focus-within:text-orange-400">Password</Label>
                          <a href="/forgot-password" className="text-sm text-orange-500 hover:text-orange-400 hover:underline">Forgot?</a>
                        </div>
                        <div className="relative">
                          <Input
                            id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required
                            className="bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg h-11 pr-10 transition-all duration-300"
                            value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-400 transition-colors">
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <Button type="submit" className="w-full relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all duration-300 hover:scale-[1.02] group" disabled={isLoading}>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isLoading ? "Authenticating..." : <>Access Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                        </span>
                      </Button>
                    </form>
                  </motion.div>
                </TabsContent>

                <TabsContent key="signup" value="signup" className="mt-0 focus-visible:outline-none">
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
                    <div className="mb-6">
                      <h2 className="text-3xl font-bold text-white mb-2">Initialize Account</h2>
                      <p className="text-slate-400">Secure your digital workspace in seconds.</p>
                    </div>
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2 group">
                        <Label htmlFor="fullname" className="text-slate-300 group-focus-within:text-red-400 transition-colors">Full Name</Label>
                        <Input
                          id="fullname" placeholder="John Doe" required
                          className="bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-red-500 focus:ring-red-500/20 rounded-lg h-11 transition-all duration-300"
                          value={signupName} onChange={(e) => setSignupName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 group">
                        <Label htmlFor="signup-email" className="text-slate-300 group-focus-within:text-red-400 transition-colors">Email Address</Label>
                        <Input
                          id="signup-email" type="email" placeholder="name@company.com" required
                          className="bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-red-500 focus:ring-red-500/20 rounded-lg h-11 transition-all duration-300"
                          value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 group">
                        <Label htmlFor="signup-password" className="text-slate-300 group-focus-within:text-red-400 transition-colors">Password</Label>
                        <Input
                          id="signup-password" type="password" placeholder="Create a strong password" required
                          className="bg-slate-950/50 border-white/10 text-slate-100 placeholder:text-slate-600 focus:border-red-500 focus:ring-red-500/20 rounded-lg h-11 transition-all duration-300"
                          value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all duration-300 hover:scale-[1.02] group" disabled={isLoading}>
                        <span className="flex items-center justify-center gap-2">
                            {isLoading ? "Processing..." : <>Create Secure Account <CheckCircle2 size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" /></>}
                        </span>
                      </Button>
                    </form>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </motion.div>

          {/* === Right Column: Holographic Showcase === */}
          <div className="relative hidden lg:flex flex-col items-center justify-center p-12 overflow-hidden bg-slate-950">
            <div className="absolute inset-0 opacity-20">
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>
            <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px]" 
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-slate-900/90 to-red-900/40 z-0 mix-blend-overlay" />
            
            <div className="relative z-10 text-center space-y-10">
              <div className="relative h-40 w-40 mx-auto">
                <motion.div
                  animate={{ rotate: [0, 10, 0], y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-orange-600/20 rounded-2xl border border-red-500/30 backdrop-blur-sm transform rotate-6 scale-90"
                />
                <motion.div
                  animate={{ rotate: [0, -5, 0], y: [0, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-amber-600/20 rounded-2xl border border-orange-500/30 backdrop-blur-md transform -rotate-3 scale-95"
                />
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center bg-slate-900/80 rounded-2xl border border-orange-400/50 shadow-[0_0_30px_rgba(249,115,22,0.2)]"
                >
                   <Shield className="w-16 h-16 text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                </motion.div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-10 rounded-full border border-orange-500/10 border-dashed"
                />
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <h3 className="text-4xl font-extrabold text-white tracking-tight">
                  Military-Grade <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 animate-gradient-x">
                    Protection.
                  </span>
                </h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                    Kavach ensures your documents are encrypted, processed efficiently, and always accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}