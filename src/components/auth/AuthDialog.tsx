"use client";
import { useEffect, useRef, useState } from "react";
import Paragraph from "../common/Paragraph";
import { XIcon } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

type Props = {
  message?: string;
  onClose?: () => void;
  onComplete?: () => void;
};

function AuthDialog({ message, onClose, onComplete }: Props) {
  const [formType, setFormType] = useState<"login" | "signup">("login");
  const containerRef = useRef<HTMLDivElement>(null);
  // const [] = useActionState(loginUserAction);
  // const [] = useActionState(signupUserAction);

  useEffect(() => {
    if (!containerRef.current) return;
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    });

    containerRef.current.addEventListener("click", (e) => {
      if (e.target === containerRef.current) {
        onClose?.();
      }
    });

    return () => {
      window.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          onClose?.();
        }
      });
    };
  }, [containerRef, onClose]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 px-2 sm:px-0 flex items-center justify-center bg-bg/20 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-[640px] px-6 py-8 rounded-2xl flex flex-col items-center justify-center gap-4 animate-slide-up">
        {/* message */}
        <Paragraph size="sm" className="text-surface text-center max-w-[36ch]">
          {message ||
            "Please log in to your account to continue. If you don't have an account, you can sign up."}
        </Paragraph>
        {/* form type */}
        {formType === "login" ? (
          <div className="w-full flex-1">
            <LoginForm onComplete={onComplete} changeFormType={setFormType} />
          </div>
        ) : (
          <div className="flex-1">
            <SignupForm onComplete={onComplete} changeFormType={setFormType} />
          </div>
        )}
        {/* close button */}
        <button className="absolute top-4 right-4" onClick={onClose}>
          <span className="sr-only">Close Dialog</span>
          <XIcon className="w-6 h-6 text-accent hover:text-accent/65" />
        </button>
        {/* overlay */}
        <div className="auth-popup  absolute -z-10 inset-0 scale-110 blur-xl rounded-2xl drop-shadow-2xl overflow-visible" />
      </div>
    </div>
  );
}

export default AuthDialog;
