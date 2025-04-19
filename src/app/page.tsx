import Brief from "@/components/ui/Brief";
import FAQs from "@/components/ui/FAQs";
import Hero from "@/components/ui/Hero";
import Services from "@/components/ui/Services";
import SlidingTextImage from "@/components/ui/SlidingTextImage";
import Testimonials from "@/components/ui/Testimonials";

export default function Home() {
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
