"use client";

import Image from "next/image";
import Bounded from "../common/Bounded";
import Paragraph from "../common/Paragraph";
import Heading from "../common/Heading";
import Link from "next/link";
import ContactForm from "../ui/ContactForm";

const FOOTER_MENU = [
  {
    item: "about",
    href: "#about",
  },
  {
    item: "what we provide",
    href: "#service",
  },
  {
    item: "dashboard",
    href: "/profile",
  },
];

const REPO_LINKS = [
  {
    item: "how to contribute",
    href: "#repo-cont-doc-here",
  },
  {
    item: "github repository",
    href: "#github-repo-link",
  },
  {
    item: "opened issues",
    href: "#open-issues-link-here",
  },
  {
    item: "donate",
    href: "#donation-link",
  },
];

function Footer() {
  return (
    <Bounded as="footer" className="bg-bg pt-24 pb-12">
      <div className="flex flex-wrap items-centers justify-center gap-6">
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
    </Bounded>
  );
}

export default Footer;
