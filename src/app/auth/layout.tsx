import Bounded from "@/components/common/Bounded";
import Image from "next/image";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* header */}
      <Bounded
        as="header"
        className="absolute z-40 top-0 max-h-fit pt-5 overflow-hidden "
      >
        <div className="w-full flex gap-6">
          <Link href={"/"}>
            <Image
              src="/images/main-logo.png"
              width={200}
              height={200}
              alt="Logo"
              className="w-auto h-[40px] sm:h-[52px]"
            />
          </Link>
        </div>
      </Bounded>
      <main className="">{children}</main>
    </>
  );
}
