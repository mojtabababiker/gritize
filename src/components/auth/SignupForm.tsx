"use client";

import { useActionState } from "react";
import Heading from "../common/Heading";
import Button from "../common/Button";
import Link from "next/link";
import SigninWithGoogle from "./SigninWithGoogle";
import SigninWithGithub from "./SigninWithGithub";
import Input from "../common/Input";

type Props = {
  onComplete?: () => void;
  changeFormType?: (type: "login" | "signup") => void;
};

function SignupForm({ onComplete, changeFormType }: Props) {
  // const {state, action, isPending} = useActionState(loginUserAction);
  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center">
      {/* heading */}
      <Heading as="h2" size="lg" className="text-fg w-full text-center">
        Signin
      </Heading>
      {/* form */}
      <form className="w-full flex flex-col gap-6 items-center justify-center">
        <div className="w-full flex flex-wrap gap-6 items-center justify-between">
          {/* username */}
          <Input
            label="username"
            name="username"
            type="text"
            placeholder="yourname"
            className="flex-1 min-w-[calc(100vw-72px)] sm:min-w-[260px]"
          />

          {/* email */}
          <Input
            label="email"
            name="email"
            type="email"
            placeholder="youremail@exmaple.com"
            className="flex-1 min-w-[calc(100vw-72px)] sm:min-w-[260px]"
          />

          {/* password */}
          <Input
            label="password"
            name="password"
            type="password"
            placeholder="********"
            className="flex-1 min-w-[calc(100vw-72px)] sm:min-w-[260px]"
          />

          {/* confirm password */}
          <Input
            label="confirm password"
            name="confirmPassword"
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
