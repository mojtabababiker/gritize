import Brief from "@/components/ui/Brief";
import FAQs from "@/components/ui/FAQs";
import Hero from "@/components/ui/Hero";
import Services from "@/components/ui/Services";
import SlidingTextImage from "@/components/ui/SlidingTextImage";
import Testimonials from "@/components/ui/Testimonials";
import { Settings } from "@/constant/setting";
import dumpData from "@/utils/appwrite/dump-data";

export default async function Home() {
  if (Settings.dumpData) {
    console.log("Dumping data...");

    await dumpData();
    Settings.dumpData = false;
    console.log("Data dumped successfully.");
  }
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* hero */}
      <Hero />

      {/* brief */}
      <Brief />

      {/* service */}
      <Services />

      {/* portfolio */}
      <SlidingTextImage />

      {/* testimonial */}
      <Testimonials />

      {/* faqs */}
      <FAQs />
    </main>
  );
}
