"use client";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import { loginAction } from "@/utils/form-actions/loginForm";
import { useAuth } from "@/context/AuthProvider";
import { User } from "@/models/users";

import Heading from "@/components/common/Heading";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import CustomToast from "@/components/common/CustomToast";

import SigninWithGithub from "./SigninWithGithub";
import SigninWithGoogle from "./SigninWithGoogle";

type Props = {
  onComplete?: () => void;
  changeFormType?: (type: "login" | "signup") => void;
};

/**
 * A form component for user authentication/login functionality.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} [props.onComplete] - Optional callback function to execute after successful login
 * @param {Function} [props.changeFormType] - Optional callback to switch between authentication form types
 *
 * @remarks
 * This component handles:
 * - Email/password login form
 * - Social login options (GitHub, Google)
 * - Form state management and error handling
 * - Success/error toast notifications
 * - Post-login navigation
 *
 * @example
 * ```tsx
 * <LoginForm
 *   onComplete={() => console.log('Login complete')}
 *   changeFormType={(type) => setFormType(type)}
 * />
 * ```
 */
function LoginForm({ onComplete, changeFormType }: Props) {
  // const {state, action, isPending} = useActionState(loginUserAction);

  const [state, action, isPending] = useActionState(loginAction, {});
  const router = useRouter();

  const { setIsLoggedIn, setUser } = useAuth();

  useEffect(() => {
    const completeLogin = async () => {
      const userObj = state.data;
      if (!userObj) {
        console.error("User object is null");
        return;
      }
      const user = await User.fromJson(userObj);
      setUser(user);
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
    };

    if (state.ok && state.data) {
      completeLogin();
    } else if (state.errors && state.errors.type === "server") {
      const errorMessage = state.errors.message || "Error logging in";
      toast.custom((t) => (
        <CustomToast t={t} type="error" message={errorMessage} />
      ));
    }
  }, [state, setIsLoggedIn, setUser, onComplete, router]);

  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center">
      {/* heading */}
      <Heading as="h2" size="lg" className="text-fg w-full text-center">
        Login
      </Heading>
      {/* form */}
      <form
        action={action}
        className="w-full flex flex-col gap-6 items-center justify-center"
      >
        <div className="w-full flex flex-wrap gap-6 items-center justify-center">
          {/* email */}
          <Input
            label="email"
            name="email"
            type="email"
            value={""}
            placeholder="youremail@exmaple.com"
            className="flex-1 min-w-[260px]"
          />

          {/* password */}
          <Input
            label="password"
            name="password"
            type="password"
            value={""}
            placeholder="********"
            className="flex-1 min-w-[260px]"
          />
        </div>
        {/* submit */}
        <div className="w-full p-1 flex flex-col items-center gap-3">
          <Button
            type="submit"
            variant="accent"
            size="md"
            className="max-w-fit"
            isLoading={isPending}
            disabled={isPending}
          >
            Login
          </Button>
          <span className="text-sm text-fg/50 block">
            forgot password?{" "}
            <Link href={"#"} className="text-surface hover:text-surface/70">
              Reset
            </Link>
          </span>
        </div>
      </form>
      {/* or */}
      <div className="w-full flex flex-col items-center justify-center gap-4 mt-4">
        <span className="text-sm text-fg/50 block">or signin with</span>
        <div className="flex items-center justify-center gap-4">
          <SigninWithGithub />
          <SigninWithGoogle />
          {changeFormType && (
            <span
              className="font-semibold text-fg block cursor-pointer hover:scale-105 transition-all duration-150 ease-in-out"
              onClick={() => changeFormType("signup")}
            >
              see more
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
