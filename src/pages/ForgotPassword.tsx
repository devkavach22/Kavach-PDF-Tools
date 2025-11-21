import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, KeyRound } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import Particles from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import type { Engine } from "tsparticles-engine";

const particlesOptions = {
  fullScreen: { enable: false, zIndex: 0 },
  background: { color: { value: "transparent" } },
  fpsLimit: 120,
  interactivity: {
    events: { onHover: { enable: true, mode: "repulse" }, resize: true },
    modes: { repulse: { distance: 150, duration: 0.4 } },
  },
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const particlesInit = useCallback(async (engine: Engine) => { await loadSlim(engine); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Direct redirect to reset page, passing the email in state
      navigate("/reset-password", { state: { email: email } });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden p-4 font-sans selection:bg-orange-500/30 selection:text-orange-100">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-orange-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15], rotate: [0, -90, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }} className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-red-600/15 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
        {/* @ts-ignore */}
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className="h-full w-full" />
      </div>

      <motion.div onMouseMove={handleMouseMove} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="group relative z-10 w-full max-w-md rounded-3xl p-[1px] overflow-hidden">
        <motion.div className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{ background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(251, 146, 60, 0.15), transparent 80%)` }}
        />

        <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-8 md:p-10">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
              <div className="relative w-16 h-16 bg-slate-950 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner">
                <KeyRound className="w-8 h-8 text-orange-400" />
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
              <p className="text-slate-400 text-sm">Enter your email to proceed to password reset.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 group">
                <Label htmlFor="email" className="text-slate-300 group-focus-within:text-orange-400 transition-colors">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-orange-400 transition-colors w-5 h-5" />
                  <Input id="email" type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="bg-slate-950/50 border-white/10 text-slate-100 pl-10 placeholder:text-slate-600 focus:border-orange-500 focus:ring-orange-500/20 rounded-lg h-11 transition-all duration-300"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-bold h-11 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all duration-300 hover:scale-[1.02] group">
                Proceed to Reset
              </Button>
            </form>
          </motion.div>

          <div className="mt-8 text-center border-t border-white/10 pt-6">
            <Link to="/auth" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}