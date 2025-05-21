import { nodemailer } from "@/config/nodemailer";
import { Settings } from "@/constant/setting";
import { SendMailOptions } from "nodemailer";

/**
 * Sends a contact form message via email using nodemailer.
 *
 * @param name - The name of the person submitting the contact form
 * @param email - The email address of the person submitting the contact form
 * @param message - The message content from the contact form
 * @throws {Error} When any of the required fields (name, email, message) are missing
 */
export const sendMessage = async (
  name: string,
  email: string,
  message: string
) => {
  if (!name || !email || !message) {
    throw new Error("All fields are required");
  }
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #566e3d; border-radius: 16px; padding: 32px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h1 style="color: #f8f4f9; margin-bottom: 20px; text-align: center;">Contact Form Submission</h1>
          <div style="background-color: #dff8eb; padding: 24px; border-radius: 16px;">
            <p style="margin: 10px 0;"><span style="color: #7f8c8d; font-weight: bold;">Name:</span> ${name}</p>
            <p style="margin: 10px 0;"><span style="color: #7f8c8d; font-weight: bold;">Email:</span> ${email}</p>
            <div style="margin: 20px 0;">
              <p style="color: #7f8c8d; font-weight: bold; margin-bottom: 5px;">Message:</p>
              <p style="background-color: #f8f9f9; padding: 15px; border-radius: 8px; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
  const mailOptions: SendMailOptions = {
    from: Settings.nodemailerFrom,
    to: Settings.nodemailerTo,
    subject: `Contact Us Form Submission from ${name}`,
    replyTo: email,
    html,
  };
  await nodemailer.sendMail(mailOptions);
};
