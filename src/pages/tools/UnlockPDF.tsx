import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Unlock, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";

const unlockProcessData = [
  { option: "Upload PDF File", description: "Upload locked PDF", default: "Required" },
  { option: "Enter Password", description: "Required to unlock", default: "Required" },
  { option: "Unlock PDF Button", description: "Start process", default: "Required" },
  { option: "Download Unlocked PDF", description: "After success", default: "Always available" },
];

export default function UnlockPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const isAuthenticated = true;
  const isAdmin = false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({ title: "File uploaded", description: `${e.target.files[0].name} ready` });
    }
  };

  const handleUnlock = () => {
    if (!file || !password) { toast({ title: "Error", variant: "destructive" }); return; }
    toast({ title: "Unlocking PDF", description: "Decrypting..." });
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0f172a] font-sans text-slate-50 selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden">
       <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black" />
        <motion.div animate={{ opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 20, repeat: Infinity }} className="absolute -top-[20%] left-[10%] w-[60vw] h-[60vw] bg-orange-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={() => console.log("Logout")} />
        <main className="flex-1 flex-col py-16">
          <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
            <Link to="/tools" className="inline-flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white gap-2 text-sm font-medium hover:bg-white/10 transition-colors">
              <ArrowLeft className="h-4 w-4 text-slate-400" /><span className="text-slate-300">Back</span>
            </Link>

            <div className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/20 border border-orange-500/30 animate-float">
                <Unlock className="h-8 w-8 text-orange-400" />
              </div>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-500">Unlock PDF</h1>
              <p className="text-lg text-slate-400">Remove password protection from your PDF file</p>
            </div>

            <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Upload PDF File</CardTitle>
                <CardDescription className="text-slate-400">Select a PDF and provide its password</CardDescription>
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

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">Enter Password</Label>
                  <Input id="password" type="password" placeholder="Enter the file's current password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-slate-950 border-slate-700 text-white placeholder:text-slate-600 focus:border-orange-500" />
                </div>

                <Button onClick={handleUnlock} disabled={!file || !password} className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6 rounded-xl font-semibold">
                  <Unlock className="mr-2 h-5 w-5" /> Unlock PDF
                </Button>
              </CardContent>
            </Card>

            {file && (
              <Card className="bg-slate-900/40 backdrop-blur-md shadow-xl border border-white/10">
                <CardHeader><CardTitle className="text-white">Unlock Process</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader><TableRow className="border-slate-800 hover:bg-slate-800/50"><TableHead className="text-slate-400">Step</TableHead><TableHead className="text-slate-400">Description</TableHead><TableHead className="text-slate-400">Status</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {unlockProcessData.map((item) => (
                        <TableRow key={item.option} className="border-slate-800 hover:bg-slate-800/50">
                          <TableCell className="font-medium text-slate-200">{item.option}</TableCell>
                          <TableCell className="text-slate-400">{item.description}</TableCell>
                          <TableCell><Badge variant={item.default === "Required" ? "destructive" : "secondary"}>{item.default}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}