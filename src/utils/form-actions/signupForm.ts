"use server";

import { z, ZodIssue } from "zod";

const signupSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(32, "Email can't be larger than 32 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Passwords must be matched"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  // rememberMe: z.boolean().optional(),
});

export type SignupActionSchema = {
  ok?: boolean;
  data?: { email: string; password: string; username: string };
  error?: { type: "validation"; errors: ZodIssue[] };
};

export const signupAction = async (
  _prev: SignupActionSchema,
  formData: FormData
): Promise<SignupActionSchema> => {
  const email = formData.get("email")?.toString();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();
  // const rememberMe = formData.get('rememberMe')?.toString() === 'on';

  const result = signupSchema.safeParse({
    email,
    password,
    username,
    confirmPassword,
  });
  if (!result.success) {
    return {
      ok: false,
      error: { type: "validation", errors: result.error.errors },
    };
  }
  const {
    email: validEmail,
    password: validPassword,
    username: validUsername,
  } = result.data;

  return {
    ok: true,
    data: {
      email: validEmail,
      password: validPassword,
      username: validUsername,
    },
  };
};
