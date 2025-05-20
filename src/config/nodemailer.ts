import { createTransport } from "nodemailer";
import { Settings } from "@/constant/setting";

/**
 * Configured Nodemailer transport instance for sending emails through Gmail service.
 * Uses SMTP transport with Gmail configuration and secure connection.
 *
 * @remarks
 * Requires valid Gmail credentials to be set in Settings.nodemailerFrom and Settings.nodemailerPassword
 *
 * @example
 * ```typescript
 * await nodemailer.sendMail({
 *   from: 'sender@gmail.com',
 *   to: 'recipient@example.com',
 *   subject: 'Test Email',
 *   text: 'Hello World!'
 * });
 * ```
 */
export const nodemailer = createTransport({
  service: "gmail",
  auth: {
    user: Settings.nodemailerFrom,
    pass: Settings.nodemailerPassword,
  },
  secure: true,
});
