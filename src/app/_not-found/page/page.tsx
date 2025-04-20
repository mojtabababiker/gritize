import Bounded from "@/components/common/Bounded";
import Paragraph from "@/components/common/Paragraph";
import React from "react";

function Page() {
  return (
    <Bounded className="brief-container">
      <div className="flex flex-col items-center justify-center gap-1 min-h-screen">
        <div className="flex text-center text-accent text-9xl font-body font-black">
          404
        </div>
        <Paragraph size="md" className="text-surface text-center">
          Wrong Path...
        </Paragraph>
      </div>
    </Bounded>
  );
}

export default Page;
