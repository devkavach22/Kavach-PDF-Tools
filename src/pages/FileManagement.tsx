import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard,
  Menu,
  Bell,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  TrendingUp,
  Users,
  Download,
  Filter,
  Calendar,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// You can swap these imports back to your specific view components
// For now, I am rendering a dynamic ReportView inside to show the layout changes clearly
// import { DashboardView } from "@/components/DashboardViews"; 

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Updated Sidebar Items for a Reporting Context
const sidebarNavItems = [
  { id: "overview", name: "Executive Overview", icon: LayoutDashboard },
  { id: "financial", name: "Financial Reports", icon: BarChart3 },
  { id: "sales", name: "Sales & Growth", icon: TrendingUp },
  { id: "hr", name: "Human Resources", icon: Users },
  { id: "analytics", name: "Deep Analytics", icon: PieChart },
  { id: "logs", name: "System Logs", icon: FileSpreadsheet },
];

export default function ReportManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState("overview");

  // Mock Content Component to demonstrate the "Report" view structure
  const ReportContent = ({ type }: { type: string }) => {
    return (
      <div className="space-y-6">
        {/* Report Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">
              {type.replace("-", " ")} Report
            </h2>
            <p className="text-slate-500 text-sm">
              Real-time data insights and performance metrics.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 text-slate-600 bg-white border-slate-200">
               <Calendar className="mr-2 h-4 w-4" /> Last 30 Days
            </Button>
            <Button variant="outline" className="h-9 text-slate-600 bg-white border-slate-200">
               <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
          </div>
        </div>

        {/* Report KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  Metric {i}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${i % 2 === 0 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {i % 2 === 0 ? '+12.5%' : '-2.4%'}
                </span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {i === 1 ? "$124,500" : i === 2 ? "1,240" : i === 3 ? "85%" : "42m 30s"}
              </div>
            </div>
          ))}
        </div>

        {/* Main Chart/Table Area Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 min-h-[400px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Performance Trends</h3>
              <div className="w-full h-[300px] bg-slate-50 rounded-lg flex items-center justify-center border border-dashed border-slate-300">
                <span className="text-slate-400">Chart Visualization Goes Here</span>
              </div>
           </div>
           <div className="min-h-[400px] rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Breakdown</h3>
              <div className="space-y-4">
                 {[1, 2, 3, 4, 5].map((k) => (
                   <div key={k} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                          {k}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-sm font-medium text-slate-700">Category {k}</span>
                           <span className="text-xs text-slate-400">Updated 2h ago</span>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">34%</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-slate-50/50 font-sans text-slate-900 selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden">
      
      {/* --- AMBIENT BACKGROUND (Subtle) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
        {/* Greatly reduced ambient orbs for a cleaner "Report" look */}
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[5%] right-[0%] w-[60vw] h-[60vw] bg-orange-100/30 rounded-full blur-[100px]" 
        />
      </div>

      {/* --- MAIN CONTENT WRAPPER --- */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header isAuthenticated={true} isAdmin={false} />
        
        {/* Spacer for fixed header */}
        <div className="h-20 md:h-24" />

        {/* REPORT WORKSPACE - REMOVED Padding and Card Effects */}
        <div className="flex-1 flex w-full">
            
            {/* Sidebar - Flush with left, no floating card */}
            <aside
                className={cn(
                "flex-col bg-white border-r border-slate-200 transition-all duration-300 fixed md:relative z-30 h-[calc(100vh-5rem)]",
                isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full opacity-0 overflow-hidden"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="flex items-center gap-3 p-6 border-b border-slate-100">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-white shadow-md shadow-orange-200">
                            <BarChart3 className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold text-slate-800 tracking-tight">
                            Reports
                        </span>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                            Main Menu
                        </p>
                        {sidebarNavItems.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            className={cn(
                            "w-full justify-start text-sm font-medium transition-all duration-200 mb-1 h-11",
                            activeView === item.id 
                                ? "bg-orange-50 text-orange-700 border-r-2 border-orange-500 rounded-none rounded-r-md" 
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                            onClick={() => setActiveView(item.id)}
                        >
                            <item.icon className={cn(
                            "mr-3 h-5 w-5 transition-colors",
                            activeView === item.id ? "text-orange-600" : "text-slate-400 group-hover:text-slate-600"
                            )} />
                            {item.name}
                            {activeView === item.id && (
                                <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                            )}
                        </Button>
                        ))}
                    </nav>
                    
                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                         <div className="flex items-center gap-3">
                             {/* <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                                 TD
                             </div> */}
                             {/* <div className="flex flex-col">
                                 <span className="text-sm font-semibold text-slate-700">Technowire DS</span>
                                 <span className="text-xs text-slate-500">Admin Account</span>
                             </div> */}
                         </div>
                    </div>
                </div>
            </aside>

            {/* Inner Content Area - Fills remaining space */}
            <main className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                
                {/* Top Bar - Simplified */}
                <div className="sticky top-0 z-20 flex items-center justify-between gap-4 py-4 px-6 md:px-8 border-b border-slate-200 bg-white/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="-ml-2 text-slate-500 hover:text-slate-900"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <h1 className="text-xl font-semibold text-slate-800 hidden md:block">
                           {sidebarNavItems.find(i => i.id === activeView)?.name || "Dashboard"}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative hidden md:block w-64">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search specific report..."
                                className="pl-10 bg-slate-50 border-transparent text-slate-900 focus-visible:bg-white focus-visible:ring-orange-500/50 h-9 rounded-lg"
                            />
                        </div>

                        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-orange-600">
                            <Bell className="h-5 w-5" />
                        </Button>
                        
                        <div className="h-6 w-px bg-slate-200 mx-1"></div>

                        <Button className="bg-slate-900 hover:bg-slate-800 text-white h-9 px-4 rounded-lg shadow-sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                {/* Main View Area - No extra padding on container, handled by children */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
                    <ReportContent type={activeView} />
                </div>

            </main>
        </div>

        <Footer />
      </div>
    </div>
  );
}

// Helper component for the Search Icon
function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    );
}