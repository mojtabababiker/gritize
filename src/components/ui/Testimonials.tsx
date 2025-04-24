import Bounded from "../common/Bounded";
import Heading from "../common/Heading";
import TestimonialCard from "../cards/TestimonialCard";
import Button from "../common/Button";
import { TestimonialsContainer } from "./TestimonialsContainer";

const TESTIMONIALS = [
  {
    avatar: "/images/users/user1.png",
    title: "Software Engineer",
    name: "John Doe",
    stars: 4,
    review:
      "Gritize has streamlined our development workflow significantly. The integration capabilities are excellent, and support is responsive.",
  },
  {
    avatar: "/images/users/user2.png",
    title: "Project Manager",
    name: "Sarah Wilson",
    stars: 5,
    review:
      "As a project manager, Gritize has made tracking team progress incredibly simple. The visualization tools are outstanding!",
  },
  {
    avatar: "/images/users/user3.png",
    title: "UX Designer",
    name: "Mike Chen",
    stars: 3,
    review:
      "The interface is clean and user-friendly. There's room for improvement in the design tools, but overall it's a solid platform.",
  },
  {
    avatar: "/images/users/user4.png",
    title: "Product Owner",
    name: "Emily Rodriguez",
    stars: 2,
    review:
      "While the basic features work well, we've experienced some limitations with larger team collaborations. Looking forward to future updates.",
  },
  {
    avatar: "/images/users/user5.png",
    title: "Tech Lead",
    name: "Alex Thompson",
    stars: 5,
    review:
      "Gritize has streamlined our development workflow significantly. The integration capabilities are excellent, and support is responsive.",
  },
];

async function Testimonials() {
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
      <TestimonialsContainer testimonials={TESTIMONIALS} />
    </Bounded>
  );
}

export default Testimonials;
