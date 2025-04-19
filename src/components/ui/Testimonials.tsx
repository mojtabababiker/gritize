import React from "react";
import Bounded from "../common/Bounded";
import Heading from "../common/Heading";
import TestimonialCard from "../cards/TestimonialCard";
import Button from "../common/Button";

const TESTIMONIALS = [
  {
    userImageUrl: "/images/users/user1.png",
    userTitle: "Software Engineer",
    userName: "John Doe",
    stars: 4,
    testimonial:
      "Gritize has streamlined our development workflow significantly. The integration capabilities are excellent, and support is responsive.",
  },
  {
    userImageUrl: "/images/users/user2.png",
    userTitle: "Project Manager",
    userName: "Sarah Wilson",
    stars: 5,
    testimonial:
      "As a project manager, Gritize has made tracking team progress incredibly simple. The visualization tools are outstanding!",
  },
  {
    userImageUrl: "/images/users/user3.png",
    userTitle: "UX Designer",
    userName: "Mike Chen",
    stars: 3,
    testimonial:
      "The interface is clean and user-friendly. There's room for improvement in the design tools, but overall it's a solid platform.",
  },
  {
    userImageUrl: "/images/users/user4.png",
    userTitle: "Product Owner",
    userName: "Emily Rodriguez",
    stars: 2,
    testimonial:
      "While the basic features work well, we've experienced some limitations with larger team collaborations. Looking forward to future updates.",
  },
  {
    userImageUrl: "/images/users/user5.png",
    userTitle: "Tech Lead",
    userName: "Alex Thompson",
    stars: 5,
    testimonial:
      "Gritize has streamlined our development workflow significantly. The integration capabilities are excellent, and support is responsive.",
  },
];

function Testimonials() {
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
      <div className="flex flex-wrap items-center justify-center gap-4">
        {TESTIMONIALS.map((testimonial, index) => (
          <TestimonialCard
            key={`testimonial-${index}`}
            userImageUrl={testimonial.userImageUrl}
            userName={testimonial.userName}
            userTitle={testimonial.userTitle}
            stars={testimonial.stars}
            testimonial={testimonial.testimonial}
            className="flex-1 self-stretch min-w-[340px]"
          />
        ))}
      </div>

      {/* CTA */}
      <div className="flex w-full items-center justify-center py-2 mt-6">
        <Button variant="accent" size="md">
          Try it yourself
        </Button>
      </div>
    </Bounded>
  );
}

export default Testimonials;
