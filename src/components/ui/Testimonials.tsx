"use server";
import Bounded from "../common/Bounded";
import Heading from "../common/Heading";
import TestimonialCard from "../cards/TestimonialCard";
import Button from "../common/Button";
import { TestimonialsContainer } from "./TestimonialsContainer";
import { listTestimonials } from "@/utils/appwrite/database-actions/testimonials";

async function Testimonials() {
  const testimonials = await listTestimonials();
  return (
    <Bounded className="bg-primary relative pt-24 pb-10">
      {/* title */}
      <div className="flex flex-col gap-2 w-full mb-10">
        <Heading
          as="h3"
          size="sm"
          className="text-surface capitalize w-full max-w-[23ch]"
        >
          What our colleagues say about Gritize
        </Heading>
        <Heading as="h2" size="lg" className="text-fg w-full max-w-[32ch]">
          Testimonials
        </Heading>
      </div>

      {/* testimonials */}
      <TestimonialsContainer testimonials={testimonials} />
    </Bounded>
  );
}

export default Testimonials;
