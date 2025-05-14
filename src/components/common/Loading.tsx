import Image from "next/image";
import Heading from "@/components/common/Heading";

function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center h-screen w-screen px-3 bg-bg/10 backdrop-blur-2xl">
      <div className="flex justify-center items-center gap-4 aspect-video max-w-[420px] min-h-[320px] p-4 bg-fg/15 backdrop-blur-2xl shadow-2xl shadow-fg/25 rounded-xl">
        <Image
          src={"/icons/main-icon.png"}
          alt="loading"
          width={50}
          height={50}
          className="w-10 h-auto animate-spin"
        />
        <Heading as="h1" className="text-2xl text-fg">
          Loading...
        </Heading>
      </div>
    </div>
  );
}

export default Loading;
