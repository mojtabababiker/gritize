import { nodemailer } from "@/config/nodemailer";
import { Settings } from "@/constant/setting";

/**
 * Sends a contact form message via email using nodemailer.
 *
 * @param name - The name of the person submitting the contact form
 * @param email - The email address of the person submitting the contact form
 * @param message - The message content from the contact form
 * @throws {Error} When any of the required fields (name, email, message) are missing
 * @returns {Promise<void>} A promise that resolves when the email is sent successfully
 */
export const sendMessage = async (
  name: string,
  email: string,
  message: string
) => {
  if (!name || !email || !message) {
    throw new Error("All fields are required");
  }
  const mailOptions = {
    from: Settings.nodemailerFrom,
    to: Settings.nodemailerTo,
    subject: `Contact Us Form Submission from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };
  await nodemailer.sendMail(mailOptions);
};
