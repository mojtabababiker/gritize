import React from "react";

import clsx from "clsx";
import toast from "react-hot-toast";

import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import Input from "@/components/common/Input";
import CustomToast from "@/components/common/CustomToast";
import ArrowsLeft from "@/components/icons/ArrowsLeft";
import { StarCircle } from "@/components/icons/Star";

type Props = {
  review: string;
  setReview: React.Dispatch<React.SetStateAction<string>>;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  setCurrentPage: React.Dispatch<
    React.SetStateAction<"info" | "review" | "submit">
  >;
};

function TestimonialReview({
  review,
  setReview,
  rating,
  setRating,
  setCurrentPage,
}: Props) {
  const handleClick = () => {
    console.log(review, rating);
    if (review.length < 5) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Your review should be at least 5 characters long."
          type="error"
        />
      ));
      return;
    }

    if (rating === 0) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Please rate your experience. 1 star is the lowest and 5 stars is the highest."
          type="error"
        />
      ));
      return;
    }
    setCurrentPage("submit");
  };

  return (
    <>
      <Heading as="h3" size="md" className="text-center text-fg capitalize">
        Overall experience and feels
      </Heading>

      <Paragraph size="sm" className="text-center text-surface">
        Rate Gritize interface and functionality, from the content description,
        quiz, playground, and overall experience.
      </Paragraph>

      {/* stars */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <StarCircle
            key={i}
            className={clsx(
              "w-7 h-7 cursor-pointer",
              i < rating ? "text-accent" : "text-fg hover:text-accent"
            )}
            onMouseOver={() => setRating(i + 1)}
            onClick={() => setRating(i + 1)}
          />
        ))}
      </div>
      <Input
        name="review"
        type="text-aria"
        className="resize-none"
        rows={3}
        placeholder="What do you think about Gritize?"
        onTextChange={setReview}
        value={review}
      />

      <div className="flex justify-end w-full px-3 group">
        <button
          onClick={handleClick}
          className="size-6 cursor-pointer text-bg/70 pr-1 hover:pr-0 hover:text-bg/90 transition-all duration-150 ease-in-out"
        >
          <ArrowsLeft aria-label="Next" className="size-5" />
        </button>
      </div>
    </>
  );
}

export default TestimonialReview;
