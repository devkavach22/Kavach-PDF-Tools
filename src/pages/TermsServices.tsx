import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import { Scale, Gavel, AlertTriangle, UserCheck, Ban } from "lucide-react";

// --- Shared Theme Configuration ---
const particlesOptions = {
  fullScreen: { enable: false, zIndex: 0 },
  background: { color: { value: "transparent" } },
  fpsLimit: 120,
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

const GradientBlob = ({ className }: { className?: string }) => (
  <motion.div 
    animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2], rotate: [0, 45, 0] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute rounded-full mix-blend-screen blur-[90px] filter ${className}`}
  />
);

export default function TermsServices() {
  const [init, setInit] = useState(false);
  useEffect(() => { initParticlesEngine(async (engine) => await loadSlim(engine)).then(() => setInit(true)); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 font-sans overflow-x-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#fb923c0a_1px,transparent_1px),linear-gradient(to_bottom,#fb923c0a_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <GradientBlob className="top-[10%] left-[20%] w-[600px] h-[600px] bg-orange-600/10" />
        <GradientBlob className="bottom-[10%] right-[10%] w-[500px] h-[500px] bg-amber-600/10" />
      </div>

      {init && <div className="absolute inset-0 z-0 opacity-50 pointer-events-none"><Particles id="tsparticles" options={particlesOptions} className="h-full w-full" /></div>}

      <div className="relative z-50"><Header /></div>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="container max-w-4xl mx-auto">
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 border-b border-white/10 pb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold mb-6">
              <Scale size={14} />
              <span>Legal Agreement</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Terms of Service</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              By accessing or using Kavach, you agree to be bound by these terms. Please read them carefully before using our PDF tools.
            </p>
          </motion.div>

          {/* Content */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-800 text-orange-400 border border-white/5"><UserCheck size={24} /></div>
                <h2 className="text-2xl font-bold text-white">1. Usage License</h2>
              </div>
              <div className="pl-4 md:pl-14 space-y-4 text-slate-400 leading-relaxed">
                <p>
                  Kavach grants you a revocable, non-exclusive, non-transferable, limited license to use the website and services strictly in accordance with the terms of this agreement.
                </p>
                <p>
                  <strong>Free Tier:</strong> Users are limited to specific file size limits and daily task counts as described on the pricing page. <br />
                  <strong>Pro Tier:</strong> Paid users are granted extended limits, API access (if applicable), and priority processing.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-800 text-red-400 border border-white/5"><Ban size={24} /></div>
                <h2 className="text-2xl font-bold text-white">2. Prohibited Activities</h2>
              </div>
              <div className="pl-4 md:pl-14 space-y-4 text-slate-400 leading-relaxed">
                <p>You agree strictly NOT to use the Service to:</p>
                <ul className="list-disc pl-5 space-y-2 marker:text-red-500">
                  <li>Upload files containing malware, viruses, or malicious code.</li>
                  <li>Process documents that contain illegal content, including CSAM or copyrighted material you do not own.</li>
                  <li>Attempt to reverse engineer the API or WebAssembly modules.</li>
                  <li>Automate usage of the free tier via scripts or bots (scraping).</li>
                </ul>
                <p className="text-sm italic border-l-2 border-red-500 pl-4 mt-4">
                  Violation of these terms will result in immediate account termination and IP banning.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-800 text-amber-400 border border-white/5"><AlertTriangle size={24} /></div>
                <h2 className="text-2xl font-bold text-white">3. Limitation of Liability</h2>
              </div>
              <div className="pl-4 md:pl-14 space-y-4 text-slate-400 leading-relaxed">
                <p className="uppercase text-xs font-bold tracking-widest text-slate-500 mb-2">Read Carefully</p>
                <p>
                  The service is provided "AS IS" and "AS AVAILABLE". Kavach makes no warranties, expressed or implied, regarding reliability or availability.
                </p>
                <p>
                  <strong>We are not liable for:</strong>
                </p>
                <ul className="list-disc pl-5 space-y-2">
                   <li>Loss of data resulting from file processing errors.</li>
                   <li>Corrupted PDF files (users are strongly advised to keep backups of original files).</li>
                   <li>Any consequential damages arising from the use of our tools.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-800 text-orange-400 border border-white/5"><Gavel size={24} /></div>
                <h2 className="text-2xl font-bold text-white">4. Governing Law</h2>
              </div>
              <div className="pl-4 md:pl-14 space-y-4 text-slate-400 leading-relaxed">
                <p>
                  These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                </p>
                <p>
                  Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-white/10 text-center">
                <p className="text-slate-500">Questions about our Terms?</p>
                <Link to="/contact" className="text-orange-400 font-bold hover:text-white transition-colors">Contact Support</Link>
            </div>

          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}