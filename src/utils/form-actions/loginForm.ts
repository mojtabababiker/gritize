"use server";

import { UserDTO } from "@/models/dto/user-dto";
import { User } from "@/models/users";
import { AppwriteException } from "node-appwrite";
import { z, ZodIssue } from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .max(32, "Email can't be larger than 32 characters long")
    .email("Invalid email address"),
  password: z.string().min(8, "invalid password"),
  // rememberMe: z.boolean().optional(),
});

export type LoginActionSchema = {
  ok?: boolean;
  data?: UserDTO;
  error?:
    | { type: "server"; message: string }
    | { type: "validation"; errors: ZodIssue[] };
};

export const loginAction = async (
  _prev: LoginActionSchema,
  formData: FormData
): Promise<LoginActionSchema> => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  // const rememberMe = formData.get('rememberMe')?.toString() === 'on';

  const result = loginSchema.safeParse({ email, password });
  if (!result.success) {
    // console.log(result.error.errors);
    return {
      ok: false,
      error: { type: "validation", errors: result.error.errors },
    };
  }
  const { email: validEmail, password: validPassword } = result.data;
  try {
    const user = await User.login(validEmail, validPassword);
    return { ok: true, data: user.json };
  } catch (error) {
    // console.error("Login error:", error);
    // const message = JSON.parse(error.response)?.message || "Login failed";
    let message = "Error in login, please try again later";
    if (error instanceof AppwriteException) {
      if (error.code >= 400 && error.code < 500) {
        message = "Invalid credentials, try again";
      }
    }
    return {
      ok: false,
      error: { type: "server", message },
    };
  }
};
