"use client";
import Link from "next/link";
import Image from "next/image";
import Bounded from "@/components/common/Bounded";
import Paragraph from "@/components/common/Paragraph";
import { usePathname } from "next/navigation";

function Page() {
  const pathName = usePathname();
  return (
    <Bounded className="brief-container">
      {/* bg */}
      <Image
        src={"/images/hero.png"}
        alt=""
        width={1440}
        height={860}
        className="fixed inset-0 z-10 w-full min-w-[1024px] h-auto origin-top object-top blur-md opacity-40"
      />
      <div className="relative z-20 flex flex-col items-center justify-center gap-1 min-h-screen">
        <div className="flex text-center text-accent text-9xl font-body font-black">
          404
        </div>
        <Paragraph size="md" className="text-surface text-center">
          <Paragraph
            as="span"
            size="md"
            className="text-fg underline italic font-bold"
          >
            {pathName.slice(1)}
          </Paragraph>{" "}
          is not found...
        </Paragraph>

        <Link href="/" className="text-accent hover:text-accent/80 mt-10">
          <span className="text-xl font-semibold">Go to Home</span>
        </Link>
      </div>
    </Bounded>
  );
}

export default Page;
