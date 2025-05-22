"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import Bounded from "@/components/common/Bounded";
import CustomToast from "@/components/common/CustomToast";
import { useAuth } from "@/context/AuthProvider";

function Page() {
  const { user, isLoggedIn } = useAuth();
  const [formType, setFormType] = useState<"login" | "signup">("login");
  const router = useRouter();

  const onSignin = () => {
    if (!user) return;
    // handle the case where the user is login
    console.log("User signed in");
    if (isLoggedIn && user.skillLevel) {
      console.log("User created");
      router.replace("/dashboard");
      return;
    }
    // redirect the user to the complete signup page to take the quiz if not already done
    router.replace("/auth/oauth/complete-signup");
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get("msg");
    const provider = urlParams.get("provider");
    if (msg === "oauth-field") {
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="error"
          message={`OAuth provider failed: ${provider}`}
        />
      ));
    } else if (msg) {
      toast.custom((t) => (
        <CustomToast t={t} type="error" message={msg.replaceAll("+", " ")} />
      ));
    }
  }, []);
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
