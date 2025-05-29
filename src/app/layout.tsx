import type { Metadata } from "next";
import { Genos, Orbitron } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

import { AuthProvider } from "@/context/AuthProvider";

const body = Genos({
  variable: "--font-body",
  subsets: ["latin"],
});

const heading = Orbitron({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gritize | Your AI-Powered Technical Assistant",
  description:
    "your open-source ally in the journey to sharpen your problem-solving edge, master coding patterns, and contribute to something bigger than tutorials and coding playgrounds.",
  openGraph: {
    title: "Gritize | Your AI-Powered Technical Assistant",
    description:
      "your open-source ally in the journey to sharpen your problem-solving edge, master coding patterns, and contribute to something bigger than tutorials and coding playgrounds.",
    siteName: "Gritize",
    url: "https://gritize.vercel.app",
  },
  twitter: {
    title: "Gritize | Your AI-Powered Technical Assistant",
    description:
      "your open-source ally in the journey to sharpen your problem-solving edge, master coding patterns, and contribute to something bigger than tutorials and coding playgrounds.",
    card: "summary_large_image",
    creator: "mojtabababiker",
    site: "@mojtabababiker",
  },
  creator: "Mojtaba Babiker",
  authors: [
    {
      name: "Mojtaba Babiker",
      url: "https://github.com/mojtabababiker",
    },
  ],
  keywords: [
    "Gritize",
    "Interview Preparation",
    "Coding Patterns",
    "Technical Assistant",
    "AI Assistant",
    "Open Source",
    "Problem Solving",
    "Software Development",
    "Coding Challenges",
    "Technical Interviews",
    "Programming",
    "Tech Community",
    "Online Code Editor",
    "AI-Powered Tools",
    "Online VS Code Editor",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${body.variable} ${heading.variable} antialiased relative`}
      >
        <AuthProvider>
          <Toaster position="top-right" />
          {children}
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
