import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Scissors, Upload, ArrowLeft, ArrowRight, ScanIcon, Copy, Maximize, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

type CustomRange = { id: string; from: string; to: string; };

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [rangeMode, setRangeMode] = useState<'custom' | 'fixed'>('custom');
  const [mergeRanges, setMergeRanges] = useState(false);
  const [fixedRange, setFixedRange] = useState("1");
  const [customRanges, setCustomRanges] = useState<CustomRange[]>([{ id: crypto.randomUUID(), from: "1", to: "10" }]);
  const isAuthenticated = true;
  const isAdmin = false;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      toast({ title: "File uploaded", description: `${e.target.files[0].name} ready to split` });
    }
  };

  const handleAddRange = () => {
    const lastRangeEnd = customRanges[customRanges.length - 1]?.to || "0";
    const newFrom = (parseInt(lastRangeEnd) + 1).toString();
    setCustomRanges([...customRanges, { id: crypto.randomUUID(), from: newFrom, to: newFrom }]);
  };

  const handleRemoveRange = (id: string) => setCustomRanges((prev) => prev.filter((range) => range.id !== id));
  const handleRangeChange = (id: string, field: 'from' | 'to', value: string) => {
    setCustomRanges((prev) => prev.map((range) => range.id === id ? { ...range, [field]: value } : range));
  };

  const handleSplit = () => {
    if (!file) { toast({ title: "Error", variant: "destructive" }); return; }
    toast({ title: "Splitting PDF", description: "Processing..." });
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
                <Scissors className="h-8 w-8 text-orange-600" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900">Split PDF File</h1>
              <p className="text-lg text-slate-500">Extract specific pages or split into individual pages</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
              <div className="lg:col-span-7">
                <Card className="bg-white shadow-xl border border-slate-200 h-full">
                  <CardHeader><CardTitle className="text-slate-900">Upload PDF File</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="border-2 border-dashed rounded-xl p-12 text-center border-slate-300 hover:border-orange-500/50 transition-colors bg-slate-50/50">
                      <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                      <label htmlFor="file-upload" className="cursor-pointer"><span className="text-orange-600 font-semibold">Choose file</span> <span className="text-slate-500">or drag and drop</span><input id="file-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileSelect} /></label>
                    </div>
                    {file && <div className="p-4 rounded-xl border bg-slate-50 border-orange-200"><p className="font-medium text-slate-900">Selected: {file.name}</p></div>}
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-5">
                <Card className="bg-white shadow-xl border border-slate-200">
                  <CardHeader><CardTitle className="text-slate-900">Split Options</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 border-b border-slate-200">
                      <Button variant="ghost" className="rounded-b-none border-b-2 border-orange-600 text-orange-600 hover:bg-orange-50 hover:text-orange-700"><ScanIcon className="mr-2 h-4 w-4" /> Range</Button>
                      <Button variant="ghost" className="rounded-b-none text-slate-400" disabled><Copy className="mr-2 h-4 w-4" /> Pages</Button>
                      <Button variant="ghost" className="rounded-b-none text-slate-400" disabled><Maximize className="mr-2 h-4 w-4" /> Size</Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-700">Range mode:</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant={rangeMode === 'custom' ? 'default' : 'outline'} onClick={() => setRangeMode('custom')} className={rangeMode === 'custom' ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-transparent border-slate-300 text-slate-700 hover:bg-slate-50"}>Custom ranges</Button>
                        <Button variant={rangeMode === 'fixed' ? 'default' : 'outline'} onClick={() => setRangeMode('fixed')} className={rangeMode === 'fixed' ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-transparent border-slate-300 text-slate-700 hover:bg-slate-50"}>Fixed ranges</Button>
                      </div>
                    </div>

                    <Separator className="bg-slate-200" />

                    {rangeMode === 'custom' && (
                      <div className="space-y-4">
                        {customRanges.map((range, index) => (
                          <div key={range.id} className="space-y-3 rounded-xl border border-slate-200 p-4 bg-slate-50">
                            <div className="flex justify-between items-center">
                              <Label className="font-semibold text-orange-600">Range {index + 1}</Label>
                              {customRanges.length > 1 && <Button variant="ghost" size="icon" onClick={() => handleRemoveRange(range.id)} className="text-slate-400 hover:text-red-500"><X className="h-4 w-4" /></Button>}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1"><Label className="text-slate-600">from page</Label><Input type="number" value={range.from} onChange={(e) => handleRangeChange(range.id, 'from', e.target.value)} className="bg-white border-slate-300 text-slate-900" /></div>
                              <div className="space-y-1"><Label className="text-slate-600">to</Label><Input type="number" value={range.to} onChange={(e) => handleRangeChange(range.id, 'to', e.target.value)} className="bg-white border-slate-300 text-slate-900" /></div>
                            </div>
                          </div>
                        ))}
                        <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-50" onClick={handleAddRange}><Plus className="mr-2 h-4 w-4" /> Add Range</Button>
                      </div>
                    )}
                    
                    {rangeMode === 'fixed' && (
                      <div className="space-y-2">
                        <Label className="text-slate-700">Split every X pages:</Label>
                        <Input type="number" min="1" value={fixedRange} onChange={(e) => setFixedRange(e.target.value)} className="bg-white border-slate-300 text-slate-900" />
                        <p className="text-sm text-slate-500">e.g., if you enter "1", every page will be a separate file.</p>
                      </div>
                    )}

                    <Separator className="bg-slate-200" />
                    <div className="flex items-center space-x-3 pt-2">
                      <Checkbox id="merge" checked={mergeRanges} onCheckedChange={(checked) => setMergeRanges(checked === true)} className="border-slate-400 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600" />
                      <Label htmlFor="merge" className="cursor-pointer text-slate-700">Merge All PDF in One File</Label>
                    </div>
                  </CardContent>
                  <CardFooter><Button onClick={handleSplit} disabled={!file} className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-6 rounded-xl font-semibold shadow-lg shadow-orange-500/20">Split PDF <ArrowRight className="ml-2 h-5 w-5" /></Button></CardFooter>
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