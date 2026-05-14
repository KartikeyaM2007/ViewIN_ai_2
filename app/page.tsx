'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useMotionTemplate } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, 
  Menu, X, 
  Mic, FileText, BrainCircuit, Activity, CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import Hls from 'hls.js'

const FadeIn = ({ children, delay = 0, className }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
)

const SpotlightCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className={cn(
        "group relative border border-white/10 bg-white/5 overflow-hidden rounded-xl",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(124, 58, 237, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // Hero Section Refs & Animation
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  // HLS Video Setup
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const src = "https://stream.mux.com/s8pMcOvMQXc4GD6AX4e1o01xFogFxipmuKltNfSYza0200.m3u8";

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden selection:bg-violet-500/30 font-sans">
      
      {/* Background elements for the rest of the page */}
      <div className="fixed inset-0 z-0 h-full w-full bg-black bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-violet-600 opacity-20 blur-[100px]"></div>
        <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-blue-600 opacity-10 blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-lg font-bold tracking-tight">InView.ai</span>
          </Link>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-4">
              <Link href="/dashboard">
                <Button className="bg-white text-black hover:bg-slate-200 rounded-full px-5 h-9 text-sm font-medium transition-transform hover:scale-105 active:scale-95">
                  Start Interview
                </Button>
              </Link>
            </div>
            
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
           <div className="md:hidden absolute top-16 left-0 right-0 bg-black border-b border-white/10 p-4 flex flex-col gap-4">
              <Link href="/dashboard">
                <Button className="w-full bg-white text-black hover:bg-slate-200 rounded-full">Start Interview</Button>
              </Link>
           </div>
        )}
      </header>

      {/* NEW HERO SECTION */}
      <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-black">
        {/* Background Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 z-0 h-full w-full object-cover opacity-80"
          style={{ transform: "scale(1.2)", transformOrigin: "center" }}
        />

        {/* Gradients */}
        <div className="absolute bottom-0 left-0 right-0 z-10 h-48" style={{ background: "linear-gradient(to top, #000, transparent)" }} />
        <div className="absolute top-0 left-0 right-0 z-10 h-32" style={{ background: "linear-gradient(to bottom, #000 0%, transparent 100%)" }} />
        <div className="absolute top-0 left-0 bottom-0 z-10 w-48" style={{ background: "linear-gradient(to right, #000, transparent)" }} />
        <div className="absolute top-0 right-0 bottom-0 z-10 w-48" style={{ background: "linear-gradient(to left, #000, transparent)" }} />

        {/* Content */}
        <motion.div style={{ opacity, scale }} className="relative z-20 flex h-full items-center justify-center pt-16">
          <div className="flex flex-col items-center gap-8 px-6 text-center">
            <FadeIn delay={0}>
              <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl lg:leading-[1.1] tracking-tight">
                <span>Master the Interview.{" "}</span>
                <br />
                <span className="font-display italic text-violet-400">Before It Happens.</span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="max-w-xl text-base font-normal leading-relaxed text-gray-300 md:text-lg">
                Upload your resume. Our AI conducts a real-time voice mock interview tailored to your skills, then tells you exactly how to fix your answers.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link href="/dashboard">
                  <Button className="h-12 px-8 rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 hover:opacity-90 text-white text-base shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)] transition-all hover:scale-105 flex items-center gap-2">
                    Start Interview <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative z-20 bg-black">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-20">
              <h3 className="text-xl text-gray-400 max-w-2xl">From PDF parsing to voice synthesis, we handle the complexity so you can focus on your answers.</h3>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            <SpotlightCard className="md:col-span-2 row-span-2 bg-black/40">
              <div className="h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 p-8 z-20 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
                   <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-semibold text-white">Adaptive Interview Engine</h3>
                   </div>
                   <p className="text-gray-400 max-w-sm">
                      Gemini dynamically generates questions based on your resume and previous answers, while VAPI handles the voice layer instantly.
                   </p>
                </div>

                <div className="absolute inset-0 top-0 overflow-hidden flex items-center justify-center">
                   <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:20px_20px]" />
                   
                   <div className="relative w-full h-full max-w-[800px] max-h-[450px]">
                      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-visible">
                          <motion.path d="M 170 280 L 200 280" fill="none" stroke="#334155" strokeWidth="2" />
                          <motion.circle r="3" fill="#8b5cf6">
                            <animateMotion dur="2s" repeatCount="indefinite" path="M 170 280 L 200 280" />
                          </motion.circle>

                          <motion.path d="M 320 280 L 350 280" fill="none" stroke="#334155" strokeWidth="2" />
                          <motion.circle r="3" fill="#8b5cf6">
                            <animateMotion dur="2s" begin="0.5s" repeatCount="indefinite" path="M 320 280 L 350 280" />
                          </motion.circle>

                          <motion.path d="M 470 280 C 490 280, 480 200, 500 200" fill="none" stroke="#334155" strokeWidth="2" />
                          <motion.circle r="3" fill="#3b82f6">
                            <animateMotion dur="1.5s" begin="1s" repeatCount="indefinite" path="M 470 280 C 490 280, 480 200, 500 200" />
                          </motion.circle>

                          <motion.path d="M 620 200 C 640 200, 630 280, 650 280" fill="none" stroke="#334155" strokeWidth="2" />
                          <motion.circle r="3" fill="#3b82f6">
                            <animateMotion dur="1.5s" begin="1.5s" repeatCount="indefinite" path="M 620 200 C 640 200, 630 280, 650 280" />
                          </motion.circle>
                      </svg>

                      <MockNode x={50} y={240} color="orange" icon={<FileText size={14} />} title="Resume PDF" sub="Parsing..." />
                      <MockNode x={195} y={270} color="purple" icon={<BrainCircuit size={14} />} title="Gemini 2.5" sub="Deep Analysis" />
                      <MockNode x={350} y={240} color="blue" icon={<Activity size={14} />} title="Context Engine" sub="Questions" />
                      <MockNode x={500} y={160} color="green" icon={<Mic size={14} className="ml-0.5" />} title="VAPI Voice" sub="Streaming Audio" />
                      <MockNode x={650} y={240} color="gray" icon={<CheckCircle2 size={14} />} title="Feedback" sub="JSON Report" />
                   </div>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard>
               <div className="p-8 h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-2">Resume Deep Scan</h3>
                <p className="text-gray-400 text-sm">
                  We dont just match keywords. We understand your project architecture, tech stack, and experience level to ask relevant questions.
                </p>
              </div>
            </SpotlightCard>

            <SpotlightCard>
              <div className="p-8 h-full flex flex-col justify-center">
                <h3 className="text-xl font-semibold mb-2">ATS & Logic Score</h3>
                <p className="text-gray-400 text-sm">
                  Get a quantified score on your answers. Did you use the STAR method? Was your system design scalable? We tell you.
                </p>
              </div>
            </SpotlightCard>

             <SpotlightCard className="md:col-span-3">
              <div className="p-8 flex flex-col md:flex-row items-center gap-8 h-full">
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-2">Detailed Feedback Reports</h3>
                  <p className="text-gray-400">
                    Receive actionable feedback. We highlight exactly where you stumbled and provide the ideal answer.
                  </p>
                </div>

                <div className="flex-1 w-full h-auto min-h-[220px] bg-black rounded-xl border border-white/10 relative overflow-hidden flex flex-col shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="ml-2 text-[10px] text-gray-400 font-mono">analysis_result.json</span>
                        </div>
                        <div className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Live
                        </div>
                    </div>

                    <div className="p-5 flex flex-col gap-4 font-mono text-sm relative">
                       <motion.div 
                          className="absolute top-0 left-0 right-0 h-[2px] bg-violet-500/50 shadow-[0_0_20px_rgba(139,92,246,0.5)] z-10"
                          animate={{ top: ["0%", "100%", "0%"] }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                       />

                       <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-xs uppercase tracking-widest">Confidence Score</span>
                          <span className="text-violet-400 font-bold">92/100</span>
                       </div>
                       
                       <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            whileInView={{ width: "92%" }} 
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-violet-500 to-blue-500" 
                          />
                       </div>

                       <div className="flex flex-col gap-2 mt-2">
                          <div className="flex items-start gap-3 bg-green-500/5 p-2 rounded border border-green-500/10">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                              <div className="flex flex-col">
                                <span className="text-green-200 text-xs font-semibold">Strong Conceptual Understanding</span>
                                <span className="text-gray-500 text-[10px]">React Hooks & State Management</span>
                              </div>
                          </div>
                          
                          <div className="flex items-start gap-3 bg-orange-500/5 p-2 rounded border border-orange-500/10">
                              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                              <div className="flex flex-col">
                                <span className="text-orange-200 text-xs font-semibold">Improvement Needed</span>
                                <span className="text-gray-500 text-[10px]">Deep dive into useEffect dependency arrays</span>
                              </div>
                          </div>
                       </div>
                    </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-black z-20 relative">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-12 overflow-hidden text-center group bg-black border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-b from-violet-900/10 to-transparent opacity-50" />
            <motion.div 
              className="absolute inset-0 bg-violet-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to ace the interview?</h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join engineers who use InView to polish their pitch and perfect their technical explanations.
              </p>
              <Link href="/dashboard">
                <Button className="h-14 px-8 rounded-full bg-white text-black hover:bg-slate-200 text-lg font-semibold transition-transform hover:-translate-y-1">
                  Start Practice Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 relative flex flex-col items-center overflow-hidden">
        <div className="relative w-full pt-20 pb-6 px-6">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <h1 className="text-[18vw] font-bold text-white/[0.05] tracking-tighter leading-none whitespace-nowrap">
                InView.AI
            </h1>
            </div>
            <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col min-h-[100px] items-center justify-end">
                <p className="text-gray-500 text-sm">© 2026 InView.ai</p>
            </div>
        </div>
      </footer>
    </div>
  )
}

const MockNode = ({ x, y, color, icon, title, sub }: { x: number, y: number, color: string, icon: any, title: string, sub: string }) => {
   const glowColors: Record<string, string> = {
     blue: 'shadow-[0_0_20px_rgba(59,130,246,0.3)] border-blue-500/30',
     purple: 'shadow-[0_0_20px_rgba(168,85,247,0.3)] border-purple-500/30',
     orange: 'shadow-[0_0_20px_rgba(249,115,22,0.3)] border-orange-500/30',
     green: 'shadow-[0_0_20px_rgba(34,197,94,0.3)] border-green-500/30',
     gray: 'shadow-[0_0_20px_rgba(113,113,122,0.3)] border-zinc-500/30',
   }

   return (
      <motion.div 
         className={`absolute w-auto min-w-[140px] backdrop-blur-md bg-[#1a1a1a]/80 rounded-full border p-2 pr-4 flex items-center gap-3 z-20 ${glowColors[color]}`}
         style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }} 
         whileHover={{ scale: 1.05, y: -2 }}
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
      >
         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white bg-gradient-to-br from-white/10 to-transparent border border-white/5`}>
            {icon}
         </div>
         <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-100 leading-none mb-1">{title}</span>
            <span className="text-[9px] text-gray-400 font-mono leading-none uppercase tracking-wide">{sub}</span>
         </div>
      </motion.div>
   )
}

export default LandingPage