import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, ArrowRightLeft, ArrowLeft, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function WordToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const isAuthenticated = true;
  const isAdmin = false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({ title: "File added", description: `${e.target.files[0].name} ready` });
    }
  };

  const handleConvert = () => {
    if (!file) { toast({ title: "Error", variant: "destructive" }); return; }
    toast({ title: "Converting", description: "Processing..." });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-50 font-sans text-slate-900 overflow-x-hidden">
       <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-white" />
        <motion.div animate={{ opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-[20%] left-[10%] w-[60vw] h-[60vw] bg-orange-200/30 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={() => console.log("Logout")} />
        <main className="flex-1 flex-col py-16">
          <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
             <Link to="/tools" className="inline-flex items-center bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-700 gap-2 text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
              <ArrowLeft className="h-4 w-4 text-slate-500" /><span className="text-slate-600">Back</span>
            </Link>

            <div className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 border border-orange-200 animate-float">
                <ArrowRightLeft className="h-8 w-8 text-orange-600" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900">Word to PDF</h1>
              <p className="text-lg text-slate-500">Convert your Word document (.docx, .doc) to a universal PDF file</p>
            </div>

             <Card className="bg-white shadow-xl border border-slate-200 max-w-3xl mx-auto mt-8">
                <CardHeader>
                  <CardTitle className="text-slate-900">Upload Word File</CardTitle>
                  <CardDescription className="text-slate-500">Select a Word file to convert</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border-2 border-dashed rounded-xl p-12 text-center border-slate-300 hover:border-orange-500/50 transition-colors bg-slate-50/50">
                    <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-orange-600 font-semibold hover:text-orange-500">Choose file</span> <span className="text-slate-500">or drag and drop</span>
                      <input id="file-upload" type="file" accept=".doc,.docx" className="hidden" onChange={handleFileSelect} />
                    </label>
                    <p className="text-sm text-slate-500 mt-2">.doc or .docx files only</p>
                  </div>
                  {file && (
                    <div className="flex items-center justify-between p-4 rounded-xl border bg-slate-50 border-orange-200 text-slate-900">
                        <div className="flex items-center gap-3"><FileText className="h-5 w-5 text-orange-600" /><span className="font-medium">{file.name}</span></div>
                        <span className="text-sm text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                    </div>
                  )}
                  <Button onClick={handleConvert} disabled={!file} className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6 rounded-xl font-semibold shadow-lg shadow-orange-500/20">
                    <Download className="mr-2 h-5 w-5" /> Convert to PDF
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