"use client";
import Heading from "@/components/common/Heading";
import Button from "@/components/common/Button";
import Paragraph from "@/components/common/Paragraph";
import { useState } from "react";
import Link from "next/link";
import { Settings } from "@/constant/setting";

export const ProjectDescription = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="flex flex-col gap-3 w-full sm:flex-1 sm:min-w-[620px]">
      <Heading as="h2" size="title" className="text-fg font-bold max-w-[17ch]">
        Gritize isn’t a company. It’s a cause
      </Heading>
      <div className="flex flex-col gap-2 max-w-[82ch]">
        <Paragraph>
          {` We’re open-source, community-driven, and absolutely free—because we
          know how hard it is to find real, practical resources when you're just
          starting out. This is a battleground where you build skill and prove
          your grit.`}
        </Paragraph>
        <Paragraph variant="quote">
          Together, we can make software development a path for every
          disciplined and determined individual.
        </Paragraph>
      </div>
      {/* CTAs */}
      <div className="flex flex-wrap gap-4 py-4 items center">
        <Button variant="accent" size="lg" onClick={() => setShowModal(true)}>
          Support Gritize
        </Button>
        <Link href={Settings.githubRepo} target="_blank">
          <Button variant="primary" size="lg">
            Join the Community
          </Button>
        </Link>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/50 backdrop-blur-lg">
          <div className="bg-surface p-6 rounded-2xl shadow-lg max-w-[460px]">
            <Heading as="h2" size="title" className="text-bg/95 font-bold">
              Support Gritize
            </Heading>
            <Paragraph className="text-bg/85">
              {
                "Supporting Gritize financially isn't available yet. But you can help us by sharing the project with your friends and family."
              }
            </Paragraph>
            <Paragraph size="sm" className="text-bg/75 mt-4">
              You can also support us by contributing to the project. Check out
              our{" "}
              <Link href={Settings.githubRepo} className="text-bg underline">
                GitHub
              </Link>{" "}
              repository for more information.
            </Paragraph>
            <div className="flex gap-4 mt-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => setShowModal(false)}
                isSimple
              >
                Close
              </Button>
              <Link href="/#contact-us">
                <Button
                  variant="accent"
                  className="text-bg/90"
                  size="md"
                  onClick={() => {
                    setShowModal(false);
                  }}
                  isSimple
                >
                  Send us a Message
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
