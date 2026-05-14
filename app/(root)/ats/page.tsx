"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  CloudUpload, 
  FileUp, 
  FileSearch, 
  Award, 
  Lightbulb, 
  ShieldAlert,
  FileCheck,
  XCircle,
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import WorkflowVisualizer, { WorkflowStep } from "@/components/WorkflowVisualizer";

// Custom ATS parsing pipeline nodes
const atsSteps: WorkflowStep[] = [
  {
    id: 1,
    title: "Buffer Extraction",
    desc: "Deconstructing raw PDF document blobs...",
    icon: FileSearch,
  },
  {
    id: 2,
    title: "Semantic Parsing",
    desc: "Cross-analyzing competencies with core Job description...",
    icon: Award,
  },
  {
    id: 3,
    title: "Synthesis Advisory",
    desc: "Running LLM heuristics to isolate improvement vectors...",
    icon: Lightbulb,
  },
  {
    id: 4,
    title: "Compilation Complete",
    desc: "ATS metrics finalized! Generating dynamic scoreboard.",
    icon: FileCheck,
  },
];

export default function ATSPage() {
  const [jobDesc, setJobDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  
  // Tracking states for animation
  const [step, setStep] = useState(0); // 0 = idle, 1-4 = running pipeline
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);
    setStep(1); // Step 1: Extract Buffer

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDescription", jobDesc);

    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    try {
      // Simulate parsing transitions for rich feedback
      timer1 = setTimeout(() => setStep(2), 1500); // Step 2: Cross-analysis
      timer2 = setTimeout(() => setStep(3), 3800); // Step 3: Advisory

      const res = await fetch("/api/atsapi", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      clearTimeout(timer1!);
      clearTimeout(timer2!);

      if (res.ok) {
        setStep(4); // Step 4: Finalize!
        // Hold briefly to appreciate complete pipeline before snapping dashboard open
        setTimeout(() => {
          setResult(data);
          setStep(0);
          setLoading(false);
        }, 1500);
      } else {
        setStep(0);
        setLoading(false);
        setResult({ error: data.error || "Failed to process." });
      }
    } catch (error) {
      clearTimeout(timer1!);
      clearTimeout(timer2!);
      setStep(0);
      setLoading(false);
      console.error("Error:", error);
      setResult({ error: "Something went wrong during calculation." });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <main className="relative flex flex-col gap-10 max-w-5xl mx-auto py-12 px-4 md:px-8 transition-all duration-500">
      
      {/* Animated Glow Background */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary-200/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col items-center text-center gap-3"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-primary-100 to-primary-200 bg-clip-text text-transparent tracking-tight">
          AI-Driven ATS Score Analyzer
        </h1>
        <p className="text-light-400 max-w-2xl text-sm md:text-base">
          Supercharge your application chances. Instantly dissect resume keyword densities, gap metrics, and compliance algorithms against live target job descriptions.
        </p>
      </motion.div>

      {step > 0 ? (
        /* --- Cinematic n8n Flow Tracker Stage --- */
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-border w-full max-w-lg mx-auto py-10"
        >
          <div className="flex flex-col items-center card py-8">
            <h3 className="text-primary-200 tracking-widest text-sm uppercase font-semibold mb-2">ATS Orchestration Stream</h3>
            <WorkflowVisualizer currentStep={step} steps={atsSteps} />
          </div>
        </motion.div>
      ) : !result ? (
        /* --- Advanced Form State --- */
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
        >
          {/* Column 1: Document Upload Zone */}
          <div className="card-border h-full">
            <div className="card flex flex-col gap-6 p-6 h-full min-h-[320px] justify-center">
              <h3 className="text-lg font-semibold tracking-wide">Step 1: Inject Resume File</h3>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  handleFileChange(e.dataTransfer.files?.[0] || null);
                }}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 h-[240px] group ${
                  isDragOver 
                    ? "border-primary-200 bg-primary-200/10 scale-[1.02]" 
                    : file 
                    ? "border-success-100/50 bg-success-100/5" 
                    : "border-white/10 hover:border-white/30 hover:bg-white/5"
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".pdf,.docx"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                  className="hidden"
                />
                
                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div 
                      key="active"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="p-4 rounded-full bg-success-100/10 text-success-100 shadow-[0_0_20px_rgba(73,222,80,0.2)]">
                        <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                      </div>
                      <div className="flex flex-col items-center max-w-xs">
                        <span className="font-semibold text-success-100 tracking-wide truncate max-w-[220px]">
                          {file.name}
                        </span>
                        <span className="text-xs text-white/40 uppercase tracking-wider mt-1">
                          {(file.size / 1024).toFixed(1)} KB • Click to swap
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className="p-4 rounded-full bg-white/5 text-light-400 group-hover:text-primary-200 transition-colors">
                        <CloudUpload className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-medium text-white tracking-wide">
                          Drag & Drop your Resume
                        </span>
                        <span className="text-xs text-light-400 mt-1.5">
                          Supports PDF & DOCX up to 10MB
                        </span>
                      </div>
                      <Button type="button" variant="secondary" className="btn-secondary mt-2 pointer-events-none">
                        Browse Local
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Column 2: Job Description Textarea */}
          <div className="card-border h-full flex-1">
            <form onSubmit={handleSubmit} className="card flex flex-col gap-6 p-6 h-full justify-between">
              <div className="flex flex-col gap-4 w-full">
                <h3 className="text-lg font-semibold tracking-wide">Step 2: Live Job Description</h3>
                <div className="relative rounded-xl overflow-hidden border border-white/10 bg-dark-200 focus-within:border-primary-200/50 transition-all duration-300">
                  <textarea
                    placeholder="Paste the exact duties, skills, and requirements from your target job post here..."
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    className="w-full h-[240px] p-4 resize-none outline-none bg-transparent text-sm leading-relaxed placeholder:text-white/30"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="btn-primary w-full py-6 text-base font-bold flex items-center justify-center gap-2"
                disabled={!file || !jobDesc || loading}
              >
                <FileUp className="w-5 h-5" />
                Process Score Analysis
              </Button>
            </form>
          </div>
        </motion.div>
      ) : (
        /* --- Cinematic ATS Results Scoreboard Stage --- */
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-8"
        >
          {result.error ? (
            <motion.div variants={itemVariants} className="card-border p-0.5 max-w-md mx-auto">
              <div className="card flex flex-col items-center gap-4 p-8 text-center border border-destructive-100/20">
                <XCircle className="w-12 h-12 text-destructive-100" />
                <h3 className="text-lg font-semibold">Analysis Faulted</h3>
                <p className="text-sm text-light-100">{result.error}</p>
                <Button onClick={() => setResult(null)} variant="secondary" className="mt-2">Try Again</Button>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Primary Score Billboard */}
              <motion.div variants={itemVariants} className="card-border w-full">
                <div className="card flex flex-col md:flex-row items-center justify-between p-8 gap-8 bg-gradient-to-br from-primary-200/5 to-transparent">
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary-200/10 text-primary-200 text-xs font-bold uppercase px-3 py-1 rounded-full tracking-wider border border-primary-200/20">
                        Synthesized Report
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Analysis Insights Ready</h2>
                    <p className="text-sm text-light-400 max-w-md leading-relaxed">
                      Our NLP analysis completed parsing. Scroll through parsed tags, weaknesses, and strategic pivots to boost your match probability!
                    </p>
                    <Button onClick={() => setResult(null)} variant="secondary" className="w-fit btn-secondary mt-4 px-6 flex items-center gap-2">
                      Analyze New Draft
                    </Button>
                  </div>

                  {/* Glowing Circular Gauge */}
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 scale-125 bg-primary-200/10 rounded-full blur-2xl animate-pulse" />
                    <div className={`relative flex items-center justify-center w-40 h-40 rounded-full border-[8px] transition-all duration-700 ${
                      result.score >= 80 
                        ? "border-success-100 text-success-100" 
                        : result.score >= 50 
                        ? "border-primary-200 text-primary-200" 
                        : "border-destructive-100 text-destructive-100"
                    }`}>
                      <div className="flex flex-col items-center">
                        <span className="text-5xl font-extrabold tracking-tighter">{result.score}%</span>
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-white/50 mt-0.5">ATS Match</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* High-Fidelity Metric Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Strengths (Green) */}
                <motion.div variants={itemVariants} className="card-border">
                  <div className="card flex flex-col p-6 gap-4 h-full">
                    <div className="flex items-center gap-3 text-success-100 font-semibold text-lg tracking-wide border-b border-white/5 pb-3">
                      <CheckCircle2 className="w-5 h-5" />
                      <h3>Verified Strengths</h3>
                    </div>
                    <ul className="flex flex-col gap-3 mt-1">
                      {result.strengths.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-light-100 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-success-100/20 transition-colors">
                          <ChevronRight className="w-4 h-4 text-success-100 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Weaknesses (Red/Amber) */}
                <motion.div variants={itemVariants} className="card-border">
                  <div className="card flex flex-col p-6 gap-4 h-full">
                    <div className="flex items-center gap-3 text-destructive-100 font-semibold text-lg tracking-wide border-b border-white/5 pb-3">
                      <ShieldAlert className="w-5 h-5" />
                      <h3>Critical Weaknesses</h3>
                    </div>
                    <ul className="flex flex-col gap-3 mt-1">
                      {result.weaknesses.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-light-100 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-destructive-100/20 transition-colors">
                          <ChevronRight className="w-4 h-4 text-destructive-100 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Picked Skills (Pills) */}
                <motion.div variants={itemVariants} className="card-border md:col-span-2">
                  <div className="card flex flex-col p-6 gap-4">
                    <div className="flex items-center gap-3 text-primary-200 font-semibold text-lg tracking-wide border-b border-white/5 pb-3">
                      <Award className="w-5 h-5" />
                      <h3>Isolated Competencies & Skills</h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5 mt-2">
                      {result.picked_skills.map((item: string, idx: number) => (
                        <span key={idx} className="px-4 py-2 bg-primary-200/5 border border-primary-200/20 text-primary-100 text-xs font-semibold rounded-full tracking-wide hover:bg-primary-200/10 hover:border-primary-200/40 transition-all">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Missing Keywords */}
                <motion.div variants={itemVariants} className="card-border">
                  <div className="card flex flex-col p-6 gap-4 h-full">
                    <div className="flex items-center gap-3 text-orange-400 font-semibold text-lg tracking-wide border-b border-white/5 pb-3">
                      <XCircle className="w-5 h-5" />
                      <h3>Missing Target Keywords</h3>
                    </div>
                    <ul className="flex flex-col gap-3 mt-1">
                      {result.missing_keywords.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-light-100 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-orange-400/20 transition-colors">
                          <span className="text-orange-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                {/* Strategic Improvement Tips */}
                <motion.div variants={itemVariants} className="card-border">
                  <div className="card flex flex-col p-6 gap-4 h-full">
                    <div className="flex items-center gap-3 text-cyan-400 font-semibold text-lg tracking-wide border-b border-white/5 pb-3">
                      <Lightbulb className="w-5 h-5" />
                      <h3>Actionable Growth Tips</h3>
                    </div>
                    <ul className="flex flex-col gap-3 mt-1">
                      {result.improvement_tips.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-light-100 bg-cyan-500/5 p-3 rounded-xl border border-cyan-500/20 transition-colors">
                          <ChevronRight className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

              </div>
            </>
          )}
        </motion.div>
      )}
    </main>
  );
}
