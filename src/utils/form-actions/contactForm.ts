"use server";
import z from "zod";
import { sendMessage } from "@/utils/sendmail/contact-us";

const contactUsSchema = z.object({
  name: z.string().min(2, "Your name is important for us ^_^"),
  email: z.string().includes("@", { message: "Please, provide valid email!" }),
  message: z
    .string()
    .min(8, "Hi, I think you forgot to write a message. It's OK"),
});

export type ContactUsActionSchema = {
  ok?: boolean;
  data?: unknown;
  error?: {
    type: "validation" | "server";
    errors?: z.ZodIssue[];
    message?: string;
  };
};

export const submit = async (
  _prev: ContactUsActionSchema | null,
  data: FormData
): Promise<ContactUsActionSchema> => {
  const formData = {
    name: data.get("name"),
    email: data.get("email"),
    message: data.get("message"),
  };

  const validData = contactUsSchema.safeParse(formData);

  if (!validData.success) {
    // console.error("Validation error in contact form:", validData.error.errors);
    return {
      ok: false,
      error: { type: "validation", errors: validData.error.errors },
    };
  }
  const { name, email, message } = validData.data;
  try {
    await sendMessage(name, email, message);
    return {
      ok: true,
      data: "successful submission",
    };
  } catch (error) {
    // console.error("Error in contact form submission:", error);
    return {
      ok: false,
      error: {
        type: "server",
        // @ts-expect-error annotating error too expansive
        message: error.message || "Error in contact form submission",
      },
    };
  }
};
