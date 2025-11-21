import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "tsparticles-slim";
import { Shield, Lock, Eye, FileText, Server, Globe } from "lucide-react";

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

export default function PrivacyPolicy() {
  const [init, setInit] = useState(false);
  useEffect(() => { initParticlesEngine(async (engine) => await loadSlim(engine)).then(() => setInit(true)); }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-100 font-sans overflow-x-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#fb923c0a_1px,transparent_1px),linear-gradient(to_bottom,#fb923c0a_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <GradientBlob className="top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-600/15" />
        <GradientBlob className="bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-600/15" />
      </div>

      {init && <div className="absolute inset-0 z-0 opacity-50 pointer-events-none"><Particles id="tsparticles" options={particlesOptions} className="h-full w-full" /></div>}

      <div className="relative z-50"><Header /></div>

      <main className="relative z-10 pt-32 pb-24 px-6">
        <div className="container max-w-4xl mx-auto">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16 border-b border-white/10 pb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold mb-6">
              <Shield size={14} />
              <span>Your Data is Secure</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Privacy Policy</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              At Kavach, trust is our currency. This document outlines exactly how we handle your documents, your data, and your rights. <br />
              <span className="text-orange-400">Last Updated: November 21, 2025</span>
            </p>
          </motion.div>

          {/* Content Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            {/* Section 1 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-800 text-orange-400 border border-white/5"><FileText size={24} /></div>
                <h2 className="text-2xl font-bold text-white">1. The Core Principle: File Processing</h2>
              </div>
              <div className="pl-4 md:pl-14 space-y-4 text-slate-400 leading-relaxed">
                <p>
                  Our primary function is processing PDF documents. We adhere to a strict processing protocol:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-slate-200">Client-Side Processing:</strong> Whenever possible (e.g., merging, splitting, organizing), files are processed entirely within your browser using WebAssembly. In these cases, your documents <span className="text-red-400">never leave your device</span>.
                  </li>
                  <li>
                    <strong className="text-slate-200">Server-Side Processing:</strong> For complex tasks (e.g., high-end OCR, heavy compression), files are transmitted to our secure servers via TLS 1.3 encryption.
                  </li>
                  <li>
                    <strong className="text-slate-200">Automatic Deletion:</strong> Any file uploaded to our servers is automatically and permanently deleted <strong>1 hour</strong> after processing is complete. We do not create backups of user uploaded documents.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-800 text-red-400 border border-white/5"><Lock size={24} /></div>
                <h2 className="text-2xl font-bold text-white">2. Data Collection & Usage</h2>
              </div>
              <div className="pl-4 md:pl-14 space-y-4 text-slate-400 leading-relaxed">
                <p>We collect minimal data to ensure the service functions correctly:</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                        <h4 className="text-white font-bold mb-2">What We Collect</h4>
                        <ul className="text-sm space-y-2">
                            <li>• Account info (Email, Name) for Pro users</li>
                            <li>• Usage metadata (timestamps, file types)</li>
                            <li>• Payment processing data (handled by Stripe)</li>
                        </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5">
                        <h4 className="text-white font-bold mb-2">What We DO NOT Collect</h4>
                        <ul className="text-sm space-y-2">
                            <li>• The content of your PDF files</li>
                            <li>• Passwords used to encrypt your PDFs</li>
                            <li>• Biometric data from e-signatures</li>
                        </ul>
                    </div>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-800 text-amber-400 border border-white/5"><Globe size={24} /></div>
                <h2 className="text-2xl font-bold text-white">3. Third-Party Sharing</h2>
              </div>
              <div className="pl-4 md:pl-14 space-y-4 text-slate-400 leading-relaxed">
                <p>
                  We do not sell, trade, or rent your personal identification information to others. We may use third-party service providers to help us operate our business:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Google Analytics:</strong> For understanding website traffic (anonymized).</li>
                    <li><strong>Stripe:</strong> For secure payment processing.</li>
                    <li><strong>AWS:</strong> For secure cloud infrastructure hosting.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-800 text-orange-400 border border-white/5"><Server size={24} /></div>
                <h2 className="text-2xl font-bold text-white">4. Data Retention</h2>
              </div>
              <div className="pl-4 md:pl-14 space-y-4 text-slate-400 leading-relaxed">
                <p>
                  <strong>Uploaded Files:</strong> Deleted after 1 hour. <br/>
                  <strong>Account Data:</strong> Retained as long as your account is active. You may request full account deletion at any time via your dashboard settings. <br/>
                  <strong>Logs:</strong> Server access logs are retained for 30 days for security auditing and then overwritten.
                </p>
              </div>
            </section>

            {/* Contact */}
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
                <h3 className="text-xl font-bold text-white mb-2">Privacy Officer Contact</h3>
                <p className="text-slate-400 mb-4">
                    If you have questions regarding this policy or your personal data, please contact us.
                </p>
                <Link to="/contact" className="text-orange-400 font-bold hover:text-orange-300 transition-colors underline">
                    security@kavach.io
                </Link>
            </div>

          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}