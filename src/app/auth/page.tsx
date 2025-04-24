"use client";

import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import Bounded from "@/components/common/Bounded";
import { useState } from "react";

function Page() {
  const [formType, setFormType] = useState<"login" | "signup">("login");

  const onSignin = () => {
    // Handle sign-in logic here
    console.log("User signed in");
  };
  return (
    <Bounded className="relative brief-container">
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="relative w-full max-w-[640px] px-6 py-8 rounded-2xl flex flex-col items-center justify-center gap-4">
          <div className="relative z-10">
            {formType === "login" ? (
              <LoginForm onComplete={onSignin} changeFormType={setFormType} />
            ) : (
              <SignupForm onComplete={onSignin} changeFormType={setFormType} />
            )}
          </div>
          {/* overlay */}
          <div className="auth-popup-revers absolute z-0 inset-0 blur-2xl backdrop-blur-2xl rounded-2xl drop-shadow-2xl overflow-visible" />
        </div>
      </div>
    </Bounded>
  );
}

export default Page;
