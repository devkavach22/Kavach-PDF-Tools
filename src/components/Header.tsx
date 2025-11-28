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
  Sparkles,
  Zap,         // Features
  CreditCard,  // Pricing
  Code,        // API
  Blocks,      // Integration
  Home         // Added for Overview/Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Kavachlogo from "@/assets/kavach.png";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Instance from "@/lib/axiosInstance"; 

interface HeaderProps {
  isAuthenticated?: boolean;
  isAdmin?: boolean;
}

export const Header = ({
  isAuthenticated = false,
  isAdmin = false,
}: HeaderProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
      await Instance.post( 
        "/auth/logout", 
        {},
      );
      navigate("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed. Please try again.");
    }
  };

  // --- MENU CONFIGURATIONS ---
  const publicMenuItems = [
    { title: "Overview", icon: Home, href: "/" },
    { title: "Features", icon: Zap, href: "/features" },
    { title: "Pricing", icon: CreditCard, href: "/pricing" },
    { title: "API", icon: Code, href: "/api-working" },
    { title: "Integration", icon: Blocks, href: "/integration" },
  ];

  const userMenuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { title: "Tools", icon: FileText, href: "/tools" },
    { title: "Reports", icon: FolderOpen, href: "/files" },
  ];

  const adminMenuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { title: "Manage Users", icon: Users, href: "/manage-user" },
    { title: "System Settings", icon: Settings, href: "/system-setting" },
  ];

  let menuItems;
  if (!isAuthenticated) {
    menuItems = publicMenuItems;
  } else {
    menuItems = isAdmin ? adminMenuItems : userMenuItems;
  }

  const isActive = (path: string) => {
    if (path === "/" && currentPath !== "/") return false;
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-slate-200 py-3 shadow-sm" 
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

        {/* Desktop Navigation */}
        <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Light Theme: bg-white/50 border-slate-200 */}
          <nav className="flex items-center p-1.5 rounded-full bg-white/50 border border-slate-200 backdrop-blur-xl shadow-sm">
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
                      // Inactive: slate-600 -> Hover: slate-900
                      : "text-slate-600 group-hover:text-slate-900"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 relative z-50">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-orange-500/20 bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 hover:text-orange-700 hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all duration-300"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              {/* Light Theme Dropdown */}
              <DropdownMenuContent
                align="end"
                className="w-56 bg-white border-slate-200 text-slate-700 backdrop-blur-xl p-2 shadow-xl"
              >
                <DropdownMenuItem
                  asChild
                  className="focus:bg-slate-100 focus:text-orange-600 cursor-pointer rounded-md"
                >
                  <Link to="/profile" className="flex items-center py-2">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="focus:bg-slate-100 focus:text-orange-600 cursor-pointer rounded-md"
                >
                  <Link to="/settings" className="flex items-center py-2">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100 my-1" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer rounded-md py-2"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              asChild
              className="hidden md:flex h-10 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white rounded-full font-bold px-6 shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)] transition-all duration-300 hover:scale-105 border-0"
            >
              <Link to="/auth" className="flex items-center gap-2">
                Get Started <Sparkles size={14} className="text-orange-100" />
              </Link>
            </Button>
          )}

          {/* Mobile Menu Toggle - Dark color for light bg */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-700 hover:text-slate-900 hover:bg-slate-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation - Light Theme */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                    isActive(item.href)
                      ? "bg-orange-50 text-orange-600 border border-orange-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.title}
                </Link>
              ))}

              {!isAuthenticated && (
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-3 rounded-lg shadow-lg shadow-orange-500/20"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};