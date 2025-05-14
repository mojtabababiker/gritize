"use client";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { signupAction } from "@/utils/form-actions/signupForm";
import { useAuth } from "@/context/AuthProvider";

import Heading from "@/components/common/Heading";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import CustomToast from "@/components/common/CustomToast";

import SigninWithGoogle from "./SigninWithGoogle";
import SigninWithGithub from "./SigninWithGithub";

type Props = {
  onComplete?: () => void;
  changeFormType?: (type: "login" | "signup") => void;
};

/**
 * A form component for user registration.
 *
 * @component
 * @param {Object} props - Component props
 * @param {() => void} [props.onComplete] - Optional callback function to execute after successful signup
 * @param {(type: "login" | "signup") => void} [props.changeFormType] - Optional callback to switch between login/signup forms
 *
 * @remarks
 * This component handles user registration with:
 * - Email/password signup
 * - Username requirement
 * - Password confirmation
 * - Social login options (GitHub, Google)
 * - Loading states
 * - Success/error toast notifications
 * - Form validation
 *
 * After successful registration:
 * - Sets user authentication state
 * - Executes onComplete callback if provided
 * - Otherwise redirects to dashboard
 *
 * @example
 * ```tsx
 * <SignupForm
 *   onComplete={() => console.log('Signup complete')}
 *   changeFormType={(type) => setFormType(type)}
 * />
 * ```
 */
function SignupForm({ onComplete, changeFormType }: Props) {
  const { user, setUser, setIsLoggedIn } = useAuth();
  const [state, action, isPending] = useActionState(signupAction, {});

  // a second state to handle the signup loading (some improvements can be done)
  const [isLoading, setIsLoading] = useState<boolean>(isPending);
  const router = useRouter();

  const signup = async (email: string, password: string, username: string) => {
    try {
      setIsLoading(true);
      if (!user) return;
      const newUser = await user.register(email, password, username);
      setUser(newUser);
      setIsLoggedIn(true);
      toast.custom((t) => (
        <CustomToast t={t} type="success" message="Login successful" />
      ));
      console.log("Login successful", user);
      if (onComplete) {
        onComplete();
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.log("Error signing up", error);

      const errorMessage = "A user with this email already exists"; // needs to handle more errors

      toast.custom((t) => (
        <CustomToast t={t} type="error" message={errorMessage} />
      ));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    if (state.ok && state.data) {
      const { email, password, username } = state.data;
      signup(email, password, username);
    }
  }, [state, user]);

  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center">
      {/* heading */}
      <Heading as="h2" size="lg" className="text-fg w-full text-center">
        Signin
      </Heading>
      {/* form */}
      <form
        action={action}
        className="w-full flex flex-col gap-6 items-center justify-center"
      >
        <div className="w-full flex flex-wrap gap-6 items-center justify-between">
          {/* username */}
          <Input
            label="username"
            name="username"
            value={""}
            type="text"
            placeholder="yourname"
            className="flex-1 min-w-[calc(100vw-72px)] sm:min-w-[260px]"
          />

          {/* email */}
          <Input
            label="email"
            name="email"
            value={""}
            type="email"
            placeholder="youremail@exmaple.com"
            className="flex-1 min-w-[calc(100vw-72px)] sm:min-w-[260px]"
          />

          {/* password */}
          <Input
            label="password"
            name="password"
            value={""}
            type="password"
            placeholder="********"
            className="flex-1 min-w-[calc(100vw-72px)] sm:min-w-[260px]"
          />

          {/* confirm password */}
          <Input
            label="confirm password"
            name="confirmPassword"
            value={""}
            type="password"
            placeholder="********"
            className="flex-1 min-w-[calc(100vw-72px)] sm:min-w-[260px]"
          />
        </div>
        {/* submit */}
        <div className="w-full p-1 flex flex-col items-center gap-3">
          <Button
            type="submit"
            variant="accent"
            size="md"
            className="max-w-fit"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Signin
          </Button>
          <span className="text-sm text-fg/50 block">
            already have an account?{" "}
            <button
              onClick={() => changeFormType && changeFormType("login")}
              className="text-surface hover:text-surface/70"
            >
              Login
            </button>
          </span>
        </div>
      </form>
      {/* or */}
      <div className="w-full flex flex-col items-center justify-center gap-4 mt-4">
        <span className="text-sm text-fg/50 block">or signin with</span>
        <div className="flex items-center justify-center gap-4">
          <SigninWithGithub />
          <SigninWithGoogle />
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
