import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Zap, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";

interface OptimizationOptions {
  removeMetadata: boolean;
  imageCompression: boolean;
  removeUnusedObjects: boolean;
  flattenForms: boolean;
  removeBookmarks: boolean;
  optimizeTransparency: boolean;
  secureOptimization: boolean;
  archivalPdfA: boolean;
}

const optimizationTasks: { id: keyof OptimizationOptions; label: string }[] = [
  { id: "removeMetadata", label: "Remove Metadata" },
  { id: "imageCompression", label: "Image Compression" },
  { id: "removeUnusedObjects", label: "Remove Unused Objects" },
  { id: "flattenForms", label: "Flatten Forms" },
  { id: "removeBookmarks", label: "Remove Bookmarks" },
  { id: "optimizeTransparency", label: "Optimize Transparency" },
  { id: "secureOptimization", label: "Secure Optimization" },
  { id: "archivalPdfA", label: "Archival (PDF/A)" },
];

export default function OptimizePDF() {
  const [file, setFile] = useState<File | null>(null);
  const [options, setOptions] = useState<OptimizationOptions>({
    removeMetadata: false,
    imageCompression: true,
    removeUnusedObjects: false,
    flattenForms: false,
    removeBookmarks: false,
    optimizeTransparency: false,
    secureOptimization: false,
    archivalPdfA: false,
  });
  
  const { toast } = useToast();
  const isAuthenticated = true;
  const isAdmin = false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({ title: "File uploaded", description: `${e.target.files[0].name} ready to optimize` });
    }
  };

  const handleOptionChange = (key: keyof OptimizationOptions) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOptimize = () => {
    if (!file) {
      toast({ title: "Error", description: "Please select a PDF file first", variant: "destructive" });
      return;
    }
    toast({ title: "Optimizing PDF", description: "Your file is being optimized..." });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0f172a] font-sans text-slate-50 selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden">
       {/* --- AMBIENT BACKGROUND --- */}
       <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black" />
        <motion.div animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-[20%] left-[10%] w-[60vw] h-[60vw] bg-orange-600/10 rounded-full blur-[120px]" />
        <motion.div animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.2, 1], rotate: [0, -5, 0] }} transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} className="absolute -bottom-[10%] right-[0%] w-[50vw] h-[50vw] bg-red-600/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={() => console.log("Logout")} />

        <main className="flex-1 flex-col py-16">
          <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
            
             <Link
              to="/tools"
              className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white gap-2 text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-slate-400" />
              <span className="text-slate-300">Back to Tools</span>
            </Link>

            <div className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30 animate-float">
                <Zap className="h-8 w-8 text-orange-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500 animate-gradient-x">Optimize PDF</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Make your PDF smaller and faster for web and email
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              {/* === Left Column (Upload) === */}
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 h-full">
                  <CardHeader>
                    <CardTitle className="text-white">Upload PDF File</CardTitle>
                    <CardDescription className="text-slate-400">
                      Select a PDF file and choose optimization options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="border-2 border-dashed rounded-xl p-12 text-center border-slate-700 hover:border-orange-500/50 transition-colors bg-slate-900/50">
                      <Upload className="mx-auto h-12 w-12 text-slate-500 mb-2" />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="text-orange-400 font-semibold hover:text-orange-300 transition-colors">Choose file</span>
                        {" "}<span className="text-slate-400">or drag and drop</span>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="text-sm text-slate-500 mt-2">PDF files only</p>
                    </div>

                    {file && (
                       <div className="p-4 rounded-xl border bg-slate-800/60 border-orange-500/20">
                        <p className="font-medium text-white">Selected: {file.name}</p>
                        <p className="text-sm text-slate-400">
                          Size: {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* === Right Column (Settings) === */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Optimization Options</CardTitle>
                    <CardDescription className="text-slate-400">
                      Select the tasks to perform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {optimizationTasks.map((task) => (
                        <div key={task.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                          <Checkbox
                            id={task.id}
                            checked={options[task.id]}
                            onCheckedChange={() => handleOptionChange(task.id)}
                            className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                          />
                          <Label 
                            htmlFor={task.id} 
                            className="text-sm font-medium leading-none cursor-pointer text-slate-300"
                          >
                            {task.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  onClick={handleOptimize} 
                  disabled={!file}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-base py-6 rounded-xl font-semibold transition-colors"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Optimize PDF
                </Button>
              </div>

            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}