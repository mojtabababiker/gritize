"use server";

import { z, ZodError } from "zod";

const signupSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .max(32, "Email can't be larger than 32 characters long"),
  password: z.string().min(8, "invalid password"),
  confirmPassword: z.string().min(8, "Passwords must match"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  // rememberMe: z.boolean().optional(),
});

export type SignupActionSchema = {
  ok?: boolean;
  data?: { email: string; password: string; username: string };
  errors?:
    | { type: "server"; message: string }
    | { type: "validation"; errors: ZodError };
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
      errors: { type: "validation", errors: result.error },
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
