import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileSpreadsheet, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function PDFToExcel() {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  // Auth placeholders
  const isAuthenticated = true;
  const isAdmin = false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({
        title: "File uploaded",
        description: `${e.target.files[0].name} ready to convert`,
      });
    }
  };

  const handleConvert = () => {
    if (!file) {
      toast({ title: "Error", description: "Please select a PDF file first", variant: "destructive" });
      return;
    }
    toast({ title: "Converting to Excel", description: "Your PDF is being converted..." });
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

            <div className="text-center space-y-3 mb-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30 animate-float">
                <FileSpreadsheet className="h-8 w-8 text-orange-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500 animate-gradient-x">PDF to Excel</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Extract tables from your PDF to an editable Excel spreadsheet (.xlsx)
              </p>
            </div>

            {/* === HOW IT WORKS SECTION === */}
            <div className="space-y-8 py-6">
              <h2 className="text-2xl font-bold text-center text-slate-200">How it works</h2>
              <div className="relative">
                <div className="absolute left-0 right-0 top-6 h-0.5 border-t-2 border-dashed border-white/10 -z-10 hidden md:block" />
                <div className="flex flex-col md:flex-row gap-6 justify-between">
                  {[
                    { step: 1, title: "Upload PDF", desc: "Select file to extract tables" },
                    { step: 2, title: "Convert", desc: "Process tables to Excel" },
                    { step: 3, title: "Download", desc: "Get your .xlsx file" }
                  ].map((item) => (
                    <div key={item.step} className="flex flex-col items-center text-center flex-1">
                       <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 border-2 border-orange-500/30 text-orange-400 font-bold text-lg flex-shrink-0 z-10 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                        {item.step}
                      </div>
                      <h4 className="font-semibold mb-1 mt-3 text-white">{item.title}</h4>
                      <p className="text-sm text-slate-400 px-2">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Upload Section */}
                <div className="lg:col-span-2">
                  <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 h-full">
                    <CardHeader>
                      <CardTitle className="text-white">Upload PDF File</CardTitle>
                      <CardDescription className="text-slate-400">
                        Select a PDF file to extract tables to Excel
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="border-2 border-dashed rounded-xl p-12 text-center border-slate-700 hover:border-orange-500/50 transition-colors bg-slate-900/50">
                        <Upload className="mx-auto h-12 w-12 text-slate-500 mb-4" />
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

                      <Button
                        onClick={handleConvert}
                        disabled={!file}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-base py-6 rounded-xl font-semibold transition-colors"
                      >
                        <FileSpreadsheet className="mr-2 h-5 w-5" />
                        Convert to Excel
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Info Sidebar */}
                <div className="lg:col-span-1">
                  <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 h-full">
                    <CardHeader>
                      <CardTitle className="text-white">Why convert?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-slate-300">
                      <p className="text-sm">
                        • <span className="font-semibold text-orange-400">Edit data:</span> Modify numbers and text in your tables easily.
                      </p>
                      <p className="text-sm">
                        • <span className="font-semibold text-orange-400">Analyze:</span> Use Excel formulas to analyze your extracted data.
                      </p>
                      <p className="text-sm">
                         • <span className="font-semibold text-orange-400">Reuse:</span> Copy and paste tables into other reports.
                      </p>
                    </CardContent>
                  </Card>
                </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}