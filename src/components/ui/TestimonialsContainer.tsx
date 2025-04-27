"use client";
import { useState } from "react";
import TestimonialCard from "../cards/TestimonialCard";
import Button from "../common/Button";
import AuthDialog from "../auth/AuthDialog";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

type Props = {
  testimonials: {
    name: string;
    title: string;
    avatar: string;
    stars: number;
    review: string;
  }[];
};

export function TestimonialsContainer({ testimonials }: Props) {
  const router = useRouter();
  const [requireLogin, setRequireLogin] = useState(false);
  const { isLoggedIn } = useAuth();

  const handleClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      setRequireLogin(true);
    }
  };
  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={`testimonial-${index}`}
            userImageUrl={testimonial.avatar}
            userName={testimonial.name}
            userTitle={testimonial.title}
            stars={testimonial.stars}
            testimonial={testimonial.review}
            className="flex-1 self-stretch min-w-[340px]"
          />
        ))}
      </div>

      {/* CTA */}
      <div className="flex w-full items-center justify-center py-2 mt-6">
        <Button variant="accent" size="md" onClick={handleClick}>
          Try it yourself
        </Button>
      </div>

      {/* login dialog */}
      {requireLogin && <AuthDialog onClose={() => setRequireLogin(false)} />}
    </>
  );
}
