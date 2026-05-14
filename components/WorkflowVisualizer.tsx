"use client";

import { motion } from "framer-motion";
import { Check, FileText, Cpu, Radio, Sparkles } from "lucide-react";

export interface WorkflowStep {
  id: number;
  title: string;
  desc: string;
  icon: React.ComponentType<any>;
}

interface WorkflowVisualizerProps {
  currentStep: number; // 0 = idle, 1 to N
  steps?: WorkflowStep[]; // Custom injected steps
}

const defaultResumeSteps: WorkflowStep[] = [
  {
    id: 1,
    title: "Uploading Resume",
    desc: "Parsing document structure and raw metadata...",
    icon: FileText,
  },
  {
    id: 2,
    title: "Onboarding Agent",
    desc: "AI context ingestion & competency extraction...",
    icon: Cpu,
  },
  {
    id: 3,
    title: "Agent Inbound",
    desc: "Synthesizing custom behavioral prompts & audio routes...",
    icon: Radio,
  },
  {
    id: 4,
    title: "Interview Ready",
    desc: "Gateway provisioned! Your session is fully prepared.",
    icon: Sparkles,
  },
];

export default function WorkflowVisualizer({ currentStep, steps = defaultResumeSteps }: WorkflowVisualizerProps) {
  const activeStepsLength = steps.length;

  return (
    <div className="relative w-full max-w-sm mx-auto py-6 flex flex-col items-center">
      
      {/* SVG Connector Path */}
      <div className="absolute left-[36px] top-[40px] bottom-[40px] w-[2px] -z-10">
        {/* Background static line */}
        <div className="absolute inset-0 bg-white/10 rounded-full" />
        
        {/* Progressive Colored Track */}
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary-200 to-success-100 rounded-full shadow-[0_0_10px_rgba(202,197,254,0.5)]"
          initial={{ height: "0%" }}
          animate={{ 
            height: `${Math.max(0, Math.min(100, ((currentStep - 1) / (activeStepsLength - 1)) * 100))}%` 
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

      <div className="flex flex-col gap-6 w-full relative z-10">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;
          const Icon = step.icon;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className={`flex items-start gap-5 w-full p-4 rounded-xl transition-all duration-500 border ${
                isActive
                  ? "bg-primary-200/5 border-primary-200/30 shadow-[0_0_20px_rgba(202,197,254,0.1)]"
                  : isCompleted
                  ? "bg-success-100/5 border-success-100/20"
                  : "bg-white/5 border-white/5"
              }`}
            >
              {/* Node Graphic */}
              <div className="relative flex-shrink-0 mt-0.5">
                {/* Node Pulsating Ring */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary-200/30 scale-150 blur-sm"
                    animate={{ scale: [1.2, 1.7, 1.2], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                {/* Inner Node Sphere */}
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${
                    isCompleted
                      ? "bg-success-100 border-success-100 text-dark-100 shadow-[0_0_15px_rgba(73,222,80,0.4)]"
                      : isActive
                      ? "bg-dark-200 border-primary-200 text-primary-200 shadow-[0_0_15px_rgba(202,197,254,0.6)]"
                      : "bg-dark-300 border-white/10 text-white/30"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[3px]" />
                  ) : (
                    <Icon className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`} />
                  )}
                </motion.div>
              </div>

              {/* Node Details */}
              <div className="flex flex-col flex-1 gap-0.5 pt-0.5">
                <h4
                  className={`font-semibold text-[15px] tracking-wide transition-colors duration-500 ${
                    isActive
                      ? "text-primary-200"
                      : isCompleted
                      ? "text-success-100"
                      : "text-white/40"
                  }`}
                >
                  {step.title}
                </h4>
                <p
                  className={`text-[11px] leading-relaxed transition-colors duration-500 ${
                    isActive
                      ? "text-white"
                      : isCompleted
                      ? "text-white/70"
                      : "text-white/20"
                  }`}
                >
                  {step.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
