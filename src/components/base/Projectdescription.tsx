"use client";
import Heading from "../common/Heading";
import Button from "../common/Button";
import Paragraph from "../common/Paragraph";

export const ProjectDescription = () => {
  return (
    <div className="flex flex-col gap-3 w-full sm:flex-1 sm:min-w-[620px]">
      <Heading as="h2" size="title" className="text-fg font-bold max-w-[17ch]">
        Gritize isn’t a company. It’s a cause
      </Heading>
      <div className="flex flex-col gap-2 max-w-[82ch]">
        <Paragraph>
          We’re open-source, community-driven, and absolutely free—because we
          know how hard it is to find real, practical resources when you're just
          starting out. This is a battleground where you build skill and prove
          your grit.
        </Paragraph>
        <Paragraph variant="quote">
          Together, we can make software development a path for every
          disciplined and determined individual.
        </Paragraph>
      </div>
      {/* CTAs */}
      <div className="flex flex-wrap gap-4 py-4 items center">
        <Button variant="accent" size="lg">
          Support Gritize
        </Button>
        <Button variant="primary" size="lg">
          Join the Community
        </Button>
      </div>
    </div>
  );
};
