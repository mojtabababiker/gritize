"use client";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-black font-heading">Gritize</h1>
      <p className="text-lg text-accent">Your AI-Powered Technical Assistant</p>
      <Image
        className=""
        src="/images/hero.png"
        alt="Illustration"
        width={500}
        height={500}
      />
    </main>
  );
}
