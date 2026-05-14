'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';
import WorkflowVisualizer from './WorkflowVisualizer';

export default function UploadResumeDialog({ userId }: { userId?: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  
  // State tracking for simulated workflow steps
  // 0 = idle, 1 = Upload, 2 = Onboard, 3 = Inbound, 4 = Ready
  const [step, setStep] = useState(0); 

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a resume file first.');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('userid', userId || 'guest'); // Dynamically inject real userId

    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    try {
      setUploading(true);
      setStep(1); // Step 1: Upload Trigger

      // Simulate progressing connection paths based on standard processing duration
      timer1 = setTimeout(() => setStep(2), 1500); // Step 2: Onboarding Agent
      timer2 = setTimeout(() => setStep(3), 3500); // Step 3: Inbound Route Prepared

      const res = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      // Clear tracking timers once response clears
      clearTimeout(timer1!);
      clearTimeout(timer2!);

      if (res.ok) {
        setStep(4); // Step 4: Fully Provisioned!
        toast.success('Interview questions generated successfully!');
        
        // Pause slightly for 2s to allow user to witness the fully complete green node path
        setTimeout(() => {
          setOpen(false);
          window.location.reload();
        }, 2000);
      } else {
        setStep(0); // Revert node tree on fail
        toast.error(data.error || 'Failed to analyze resume.');
      }
    } catch (error) {
      setStep(0); // Revert node tree on exception
      toast.error('Something went wrong while uploading.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setFile(null);
      setStep(0); // Reset visualizer
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button
          asChild
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 max-sm:w-full"
        >
          <span>
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
              Your Resume
            </span>
          </span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md transition-all duration-500">
        <DialogHeader>
          <DialogTitle>
            {step > 0 ? 'Orchestration Pipeline' : 'Upload Your Resume'}
          </DialogTitle>
          <DialogDescription>
            {step > 0 
              ? 'Provisioning specialized interview persona and synthesizing custom prompt layers...' 
              : "We'll extract key details from your resume and generate relevant interview questions."
            }
          </DialogDescription>
        </DialogHeader>

        {step > 0 ? (
          /* Workflow Nodes Stage */
          <div className="mt-2 transition-all duration-500 ease-in-out opacity-100">
            <WorkflowVisualizer currentStep={step} />
          </div>
        ) : (
          /* Selection Stage */
          <>
            <div className="flex items-center gap-2 mt-4">
              <input
                type="file"
                accept=".pdf,.docx"
                ref={inputRef}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block border rounded p-2 w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-gray-800 file:text-white file:cursor-pointer"
                required
              />
              {file && <CheckCircle className="text-green-500 w-5 h-5 flex-shrink-0" />}
            </div>

            <div className="flex justify-between gap-2 mt-4">
              <Button 
                className="w-full btn-primary"
                disabled={uploading} 
                onClick={handleUpload}
              >
                Upload & Generate
              </Button>
              <Button 
                variant="secondary"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
