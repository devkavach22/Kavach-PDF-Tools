import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  Users,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Kavachlogo from "@/assets/kavach (3).png";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";

interface HeaderProps {
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

export const Header = ({
  isAuthenticated = true,
  isAdmin = false,
}: HeaderProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Check if we are on the landing page
  const isLandingPage = currentPath === "/";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LOGOUT HANDLER ---
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  const userMenuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { title: "Tools", icon: FileText, href: "/tools" },
    { title: "Files", icon: FolderOpen, href: "/files" },
  ];

  const adminMenuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { title: "Manage Users", icon: Users, href: "/manage-user" },
    { title: "System Settings", icon: Settings, href: "/system-setting" },
  ];

  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  // --- UPDATED LOGIC HERE ---
  // Checks if exact match OR if the current path is a sub-path (e.g. /tools/split)
  const isActive = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-[#0f172a]/80 backdrop-blur-xl border-white/5 py-3 shadow-lg shadow-black/20" 
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container flex items-center justify-between px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center group relative z-50">
          <img
            src={Kavachlogo}
            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            alt="Kavach Logo"
          />
        </Link>

        {/* Desktop Navigation - Hidden on Landing Page */}
        {isAuthenticated && !isLandingPage && (
          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <nav className="flex items-center p-1.5 rounded-full bg-slate-900/50 border border-white/10 backdrop-blur-xl shadow-xl shadow-black/20">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors group"
                >
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-full shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 flex items-center gap-2 transition-colors duration-200",
                      isActive(item.href)
                        ? "text-white"
                        : "text-slate-400 group-hover:text-white"
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-4 relative z-50">
          {/* Show Profile Dropdown ONLY if authenticated AND NOT on Landing Page */}
          {isAuthenticated && !isLandingPage ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 hover:text-orange-400 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all duration-300"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 bg-slate-900 border-white/10 text-slate-200 backdrop-blur-xl p-2 shadow-2xl shadow-black/50"
              >
                <DropdownMenuItem
                  asChild
                  className="focus:bg-white/5 focus:text-orange-400 cursor-pointer rounded-md"
                >
                  <Link to="/profile" className="flex items-center py-2">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="focus:bg-white/5 focus:text-orange-400 cursor-pointer rounded-md"
                >
                  <Link to="/settings" className="flex items-center py-2">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10 my-1" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer rounded-md py-2"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* CTA for Unauthenticated or Landing Page */
            <Button
              asChild
              className="hidden md:flex h-10 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-full font-bold px-6 shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)] transition-all duration-300 hover:scale-105 border-0"
            >
              <Link to="/auth" className="flex items-center gap-2">
                Get Started <Sparkles size={14} className="text-orange-100" />
              </Link>
            </Button>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-300 hover:text-white hover:bg-white/5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0f172a] border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {isAuthenticated && !isLandingPage ? (
                menuItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                      isActive(item.href)
                        ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.title}
                  </Link>
                ))
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-orange-900/20"
                >
                  Get Started
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};