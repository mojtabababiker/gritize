"use client";

import Button from "@/components/common/Button";
import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import { useEffect, useState } from "react";

function Page() {
  const [isSmallScreen, setIsSmallScreen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return isSmallScreen ? (
    <NoticeCard />
  ) : (
    <div className="w-screen bg-bg/65 flex relative">
      {/* AI Assistant */}

      {/* Code Section */}
    </div>
  );
}

const NoticeCard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-dvh w-screen px-3">
      <div className="flex flex-col items-center gap-4 max-w-[420px] p-4 bg-fg/15 backdrop-blur-2xl shadow-2xl shadow-fg/25 rounded-xl">
        <Heading as="h1" className="text-2xl text-fg">
          Notice
        </Heading>
        <Paragraph className="text-fg text-center">
          This page is not available on small screens. Please switch to a larger
          screen to view the content.
        </Paragraph>
        <Button
          variant="accent"
          className="self-center"
          onClick={() => (window.location.href = "/dashboard")}
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );
};

export default Page;
