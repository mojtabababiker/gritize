import type { Metadata } from "next";
import { Genos, Orbitron } from "next/font/google";
import "./globals.css";
import Header from "@/components/base/Header";
import Footer from "@/components/base/Footer";
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
  description: "",
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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
