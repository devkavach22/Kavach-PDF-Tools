import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, RotateCcw, RotateCw, RefreshCcw, ArrowLeft, File as FileIcon, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

export default function RotatePDF() {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState("right");
  const { toast } = useToast();
  const isAuthenticated = true;
  const isAdmin = false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({ title: "File uploaded", description: `${e.target.files[0].name} ready` });
    }
  };

  const handleRotate = () => {
    if (!file) { toast({ title: "Error", variant: "destructive" }); return; }
    toast({ title: "Rotating PDF", description: `Rotating ${file.name}...` });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0f172a] font-sans text-slate-50 selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden">
       {/* Ambient BG */}
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

            <div className="text-center space-y-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30 animate-float">
                <RefreshCcw className="h-8 w-8 text-orange-400" />
              </div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500">Rotate PDF</h1>
              <p className="text-lg text-slate-400">Change the orientation of your PDF pages</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
              <div className="lg:col-span-2">
                <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10 h-full">
                  <CardHeader>
                    <CardTitle className="text-white">{!file ? "Upload PDF File" : "Selected File"}</CardTitle>
                    {!file && <CardDescription className="text-slate-400">Select the PDF file you want to rotate</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    {!file ? (
                      <div className="border-2 border-dashed rounded-xl p-12 text-center border-slate-700 hover:border-orange-500/50 transition-colors bg-slate-900/50">
                        <Upload className="mx-auto h-12 w-12 text-slate-500 mb-2" />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <span className="text-orange-400 font-semibold hover:text-orange-300">Choose file</span> <span className="text-slate-400">or drag and drop</span>
                          <input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} />
                        </label>
                        <p className="text-sm text-slate-500 mt-2">PDF files only</p>
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl border bg-slate-800/60 border-orange-500/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <FileIcon className="h-5 w-5 text-orange-400" />
                           <p className="font-medium text-white">{file.name}</p>
                        </div>
                        <p className="text-sm text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-4">
                <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">Rotation</CardTitle>
                      <Button variant="link" className="p-0 text-sm text-orange-400" onClick={() => setFile(null)} disabled={!file}>Reset</Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup value={rotation} onValueChange={setRotation} className="flex flex-col gap-3" disabled={!file}>
                      <Label htmlFor="right" className="flex items-center space-x-3 p-3 border border-slate-700 rounded-xl hover:border-orange-500/50 bg-slate-900/50 cursor-pointer data-[state=checked]:border-orange-500 transition-all">
                        <RadioGroupItem value="right" id="right" className="text-orange-500 border-slate-500" />
                        <RotateCw className="h-5 w-5 text-slate-300" />
                        <p className="font-medium text-white">RIGHT</p>
                      </Label>
                      <Label htmlFor="left" className="flex items-center space-x-3 p-3 border border-slate-700 rounded-xl hover:border-orange-500/50 bg-slate-900/50 cursor-pointer data-[state=checked]:border-orange-500 transition-all">
                        <RadioGroupItem value="left" id="left" className="text-orange-500 border-slate-500" />
                        <RotateCcw className="h-5 w-5 text-slate-300" />
                        <p className="font-medium text-white">LEFT</p>
                      </Label>
                    </RadioGroup>
                  </CardContent>
                </Card>
                <Button onClick={handleRotate} disabled={!file} className="w-full bg-orange-600 hover:bg-orange-700 text-base py-6 rounded-xl font-semibold">
                  <RefreshCcw className="mr-2 h-5 w-5" /> Rotate PDF
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