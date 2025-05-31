"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import toast from "react-hot-toast";

import { Settings } from "@/constant/setting";
import { useAuth } from "@/context/AuthProvider";

import Bounded from "@/components/common/Bounded";
import Paragraph from "@/components/common/Paragraph";
import Heading from "@/components/common/Heading";
import CustomToast from "@/components/common/CustomToast";

import ContactForm from "@/components/ui/ContactForm";
import TestimonialProvider from "@/components/testimonials/TestmonialProvider";

const FOOTER_MENU = [
  {
    item: "about",
    href: "#about-us",
  },
  {
    item: "what we provide",
    href: "#services",
  },
  {
    item: "dashboard",
    href: "/dashboard",
  },
];

const REPO_LINKS = [
  {
    item: "github repository",
    href: Settings.githubRepo,
  },
  {
    item: "how to contribute",
    href: `${Settings.githubRepo}/blob/main/CONTRIBUTING.md`,
  },
  {
    item: "opened issues",
    href: `${Settings.githubRepo}/issues`,
  },
];

function Footer() {
  const { isLoggedIn } = useAuth();
  const [askForTestimonial, setAskForTestimonial] = useState(false);

  const handleReview = () => {
    if (!isLoggedIn) {
      setAskForTestimonial(false);
      toast.custom((t) => (
        <CustomToast
          t={t}
          type="warning"
          message=" Please login to give a feedback (-:"
        />
      ));
      return;
    }
    setAskForTestimonial(true);
  };
  return (
    <Bounded as="footer" className="bg-bg pt-24 pb-12">
      <div className="flex flex-wrap items-centers justify-center gap-6 pb-8">
        {/* desc section */}
        <div className="flex-1 flex flex-col gap-3  min-w-full md:min-w-[280px]">
          {/* logo */}
          <Image
            src={"/images/main-logo.png"}
            alt="Gritize Logo"
            width={320}
            height={140}
            className="w-full h-auto max-w-[320px] object-cover"
          />

          <Paragraph size="sm" className="text-surface w-full max-w-[42ch]">
            your open-source ally in the journey to sharpen your problem-solving
            edge, master coding patterns, and contribute to something bigger
            than tutorials and coding playgrounds.
          </Paragraph>
        </div>

        {/* quick links */}
        <div className="flex-1 flex flex-col gap-6 max-w-[420] min-w-[220px] ">
          {/* title */}
          <Heading as="h3" size="md" className="text-fg">
            Quick Links
          </Heading>
          {/* menu */}
          <ul className="flex flex-col gap-4">
            {FOOTER_MENU.map((item, index) => (
              <li key={`footer-link-${index}`}>
                <Link href={item.href}>
                  <Heading
                    as="h4"
                    size="sm"
                    className="text-surface capitalize"
                  >
                    {item.item}
                  </Heading>
                </Link>
              </li>
            ))}
            <li key={`footer-link-ask-review`}>
              <button
                className="text-surface capitalize cursor-pointer"
                onClick={handleReview}
              >
                <Heading as="h4" size="sm" className="text-surface capitalize">
                  Give us a feedback
                </Heading>
              </button>
            </li>
          </ul>
        </div>
        {/* contribute links */}
        <div className="flex-1 flex flex-col gap-6 max-w-[420] min-w-[220px]">
          {/* title */}
          <Heading as="h3" size="md" className="text-fg">
            Contribute
          </Heading>
          {/* menu */}
          <ul className="flex flex-col gap-4">
            {REPO_LINKS.map((item, index) => (
              <li key={`repo-link-${index}`}>
                <Link href={item.href} target="_blank">
                  <Heading
                    as="h4"
                    size="sm"
                    className="text-surface capitalize"
                  >
                    {item.item}
                  </Heading>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* contact form */}
        <div className="flex-1 flex flex-col gap-6 items-center order-last min-w-full sm:min-w-[420px] mt-16 lg:mt-0">
          <Heading as="h3" className="w-full text-fg capitalize text-center ">
            Talk to the gritize team
          </Heading>

          <ContactForm className="max-w-[640px]" />
        </div>
      </div>
      {/* trademark reserved */}
      <div className="absolute w-full bottom-1.5 left-0 px-1.5 pt-2 border-t border-surface/35 ">
        <p className="text-surface text-center text-xs">
          © {new Date().getFullYear()} Gritize. All rights reserved.
        </p>
      </div>

      {/* review provider */}
      {askForTestimonial && (
        <div className="fixed inset-0 h-screen w-screen z-50 bg-bg/40 cursor-auto">
          <TestimonialProvider
            show={askForTestimonial}
            onClose={() => setAskForTestimonial(false)}
          />
        </div>
      )}
    </Bounded>
  );
}

export default Footer;
