"use client"; 

import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, UserCheck, Network, UnlockKeyhole } from "lucide-react";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "./FormField";
import WorkflowVisualizer, { WorkflowStep } from "./WorkflowVisualizer";

const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

// Define dynamic auth pipeline stages
const authSteps: WorkflowStep[] = [
  {
    id: 1,
    title: "Security Handshake",
    desc: "Verifying cryptographic credential alignment...",
    icon: ShieldCheck,
  },
  {
    id: 2,
    title: "Identity Provisioning",
    desc: "Injecting secure Cloud DB vault associations...",
    icon: UserCheck,
  },
  {
    id: 3,
    title: "Session Instantiation",
    desc: "Exchanging HTTPOnly bearer tokens & scopes...",
    icon: Network,
  },
  {
    id: 4,
    title: "Gateway Established",
    desc: "Identity authenticated! Opening live dashboard.",
    icon: UnlockKeyhole,
  },
];

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  
  // Dynamic pipeline tracking (0 = idle, 1-4 = animating auth sequence)
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    setStep(1); // Step 1: Validation Triggered

    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    try {
      // Simulated connection progression during DB call
      timer1 = setTimeout(() => setStep(2), 1200); // Step 2: Provisioning
      timer2 = setTimeout(() => setStep(3), 2400); // Step 3: Session setup

      if (type === "sign-up") {
        const { name, email, password } = data;

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        clearTimeout(timer1!);
        clearTimeout(timer2!);

        if (!result.success) {
          setStep(0);
          setSubmitting(false);
          toast.error(result.message);
          return;
        }

        setStep(4); // Step 4: Ready!
        toast.success("Account created successfully.");
        
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        
        clearTimeout(timer1!);
        clearTimeout(timer2!);

        if (!idToken) {
          setStep(0);
          setSubmitting(false);
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        setStep(4); // Step 4: Ready!
        toast.success("Signed in successfully.");
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (error) {
      clearTimeout(timer1!);
      clearTimeout(timer2!);
      setStep(0);
      setSubmitting(false);
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px] transition-all duration-500"> 
      <div className="flex flex-col gap-6 card py-14 px-10 transition-all duration-500">
        
        {/* Rebranded Logo Box */}
        <div className="flex flex-row gap-2 justify-center items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            height={32}
            width={38}
            style={{ height: "auto" }}
          />
          <h2 className="text-primary-100 font-bold tracking-wide text-3xl">LeLo_InterView</h2>
        </div>

        <h3 className="text-center text-light-400 text-sm uppercase font-semibold tracking-widest mb-2">
          {step > 0 ? "Authenticating Secure Stream" : "Practice job interviews with LeLo_InterView"}
        </h3>

        {step > 0 ? (
          /* Cinematic Auth Visualizer Mode */
          <div className="mt-4 animate-fadeIn">
            <WorkflowVisualizer currentStep={step} steps={authSteps} />
          </div>
        ) : (
          /* Standard User Input Mode */
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6 mt-2 form"
              >
                {!isSignIn && (
                  <FormField
                    control={form.control}
                    name="name"
                    label="Name"
                    placeholder="Your Name"
                    type="text"
                  />
                )}

                <FormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Your email address"
                  type="email"
                />

                <FormField
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                />

                <Button 
                  className="btn w-full flex justify-center items-center gap-2" 
                  type="submit"
                  disabled={submitting}
                >
                  {isSignIn ? "Sign In" : "Create an Account"}
                </Button>
              </form>
            </Form>

            <p className="text-center text-white/60">
              {isSignIn ? "No account yet?" : "Have an account already?"}
              <Link
                href={!isSignIn ? "/sign-in" : "/sign-up"}
                className="font-bold text-primary-200 hover:text-primary-100 transition-colors ml-1.5 underline"
              >
                {!isSignIn ? "Sign In" : "Sign Up"}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
