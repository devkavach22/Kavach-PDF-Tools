import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Github, Heart } from "lucide-react";
import { motion } from "framer-motion";
import Kavachlogo from "@/assets/kavach.png";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Github, href: "#", label: "GitHub" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  const productLinks = [
    { label: "Features", path: "/features" },
    { label: "Pricing", path: "/pricing" },
    { label: "API", path: "/api-working" },
    { label: "Integrations", path: "/integration" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Service", path: "/terms-services" },
    { label: "Cookie Policy", path: "/cookie-policy" },
    { label: "Security", path: "/security" },
  ];

  return (
    // Light Theme: bg-white, border-slate-200
    <footer className="relative bg-white border-t border-slate-200 pt-20 pb-10 overflow-hidden">
      {/* Background Gradient Effects matching Landing */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent blur-sm" />
      {/* Removed noise texture as it often looks messy on white backgrounds */}
      
      {/* Subtle Glow Orb - Adjusted for light mode */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container relative z-10 px-6 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <img
                src={Kavachlogo}
                className="h-14 w-auto object-contain"
                alt="Kavach Logo"
              />
            </div>
            {/* Text Color: slate-600 */}
            <p className="text-slate-600 max-w-sm leading-relaxed">
              Enterprise-grade document security and manipulation tools.
              Designed for speed, built for privacy.
            </p>
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social, idx) => (
                <motion.a
                  key={idx}
                  href={social.href}
                  whileHover={{ y: -4, color: "#f97316" }}
                  // Social Icons: bg-slate-100, border-slate-200, text-slate-500
                  className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-200 hover:border-orange-500/30 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links - Product */}
          <div className="space-y-6">
            {/* Heading: text-slate-900 */}
            <h4 className="text-lg font-semibold text-slate-900">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    // Links: text-slate-600 -> hover:text-orange-600
                    className="text-slate-600 hover:text-orange-600 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500/0 group-hover:bg-orange-500 transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-slate-900">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-slate-600 hover:text-orange-600 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/0 group-hover:bg-red-500 transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {currentYear} Kavach PDF. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            Made with{" "}
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />{" "}
            in India
          </p>
        </div>
      </div>
    </footer>
  );
};