import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, LucidePresentation, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function PDFToPowerPoint() {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const isAuthenticated = true;
  const isAdmin = false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({ title: "File uploaded", description: `${e.target.files[0].name} ready` });
    }
  };

  const handleConvert = () => {
    if (!file) { toast({ title: "Error", variant: "destructive" }); return; }
    toast({ title: "Converting", description: "Processing..." });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0f172a] font-sans text-slate-50 overflow-x-hidden">
       <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black" />
        <motion.div animate={{ opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-[20%] left-[10%] w-[60vw] h-[60vw] bg-orange-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={() => console.log("Logout")} />
        <main className="flex-1 flex-col py-16">
          <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
             <Link to="/tools" className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white gap-2 text-sm font-medium hover:bg-white/10 transition-colors">
              <ArrowLeft className="h-4 w-4 text-slate-400" /><span className="text-slate-300">Back</span>
            </Link>

            <div className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30 animate-float">
                <LucidePresentation className="h-8 w-8 text-orange-400" />
              </div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500">PDF to PowerPoint</h1>
              <p className="text-lg text-slate-400">Convert your PDF to an editable PowerPoint presentation (.pptx)</p>
            </div>

             <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 max-w-3xl mx-auto mt-8">
                <CardHeader>
                  <CardTitle className="text-white">Upload PDF File</CardTitle>
                  <CardDescription className="text-slate-400">Select a PDF file to convert</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed rounded-xl p-12 text-center border-slate-700 hover:border-orange-500/50 transition-colors bg-slate-900/50">
                    <Upload className="mx-auto h-12 w-12 text-slate-500 mb-4" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-orange-400 font-semibold hover:text-orange-300">Choose file</span> <span className="text-slate-400">or drag and drop</span>
                      <input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
                    </label>
                    <p className="text-sm text-slate-500 mt-2">PDF files only</p>
                  </div>
                  {file && <div className="p-4 rounded-xl border bg-slate-800/60 border-orange-500/20"><p className="font-medium text-white">Selected: {file.name}</p></div>}
                  <Button onClick={handleConvert} disabled={!file} className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6 rounded-xl font-semibold">
                    <LucidePresentation className="mr-2 h-5 w-5" /> Convert to PowerPoint
                  </Button>
                </CardContent>
              </Card>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}