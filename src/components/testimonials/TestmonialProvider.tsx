"use client";

import { useAuth } from "@/context/AuthProvider";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CustomToast from "../common/CustomToast";
import Heading from "../common/Heading";
import Button from "../common/Button";
import TestimonialInfo from "./TestimonialInfo";
import Input from "../common/Input";
import TestimonialReview from "./TestimonialReview";
import Paragraph from "../common/Paragraph";
import { UserImage } from "../dashboard/UserImage";
import EditableUserAvatar from "../dashboard/UserAvatar";

type Props = {
  show: boolean;
  onClose: () => void;
};

export default function TestimonialProvider({ show, onClose }: Props) {
  const { user, setUser, isLoggedIn } = useAuth();
  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<number>(1);
  const [thoughts, setThoughts] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<"info" | "review" | "submit">(
    "info"
  );

  const submitReview = async () => {
    if (!user?.id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = {
        userId: user?.id,
        title,
        review,
        rating,
        thoughts,
      };

      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error submitting review:", errorData);
        setError(
          "Oops!, An error occurred while submitting your review. Please try again."
        );
        setIsLoading(false);
        return;
      }

      // setting the user reviewed status
      user.hasReviewed = true;
      user.lastAskedReview = new Date().toISOString();
      await user.save();
      setUser(user);

      toast.custom((t) => (
        <CustomToast
          t={t}
          message="Thank you for your review! We appreciate your feedback."
          type="success"
        />
      ));
      onClose();
    } catch {
      setError(
        "Oops!, An error occurred while submitting your review. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    });
    return () => {
      window.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          onClose();
        }
      });
    };
  }, [onClose]);

  useEffect(() => {
    if (!user?.id) return;

    const updateUserReviewStatus = async () => {
      user.lastAskedReview = new Date().toISOString();
      await user.save();
      // setUser(user);
    };
    updateUserReviewStatus();
  }, [user]);

  useEffect(() => {
    if (error) {
      setCurrentPage("info");
      toast.custom((t) => <CustomToast t={t} type="error" message={error} />);
    }
  }, [error]);

  if (!isLoggedIn || !show) return null;
  return (
    <div className="absolute animate-slide-up inset-0 z-50 bg-bg/15 backdrop-blur-lg flex flex-col items-center justify-center p-2">
      <div className="testimonial-popup flex flex-col gap-4 px-4 py-6 rounded-2xl w-full max-w-[420px]">
        {currentPage === "info" && (
          <TestimonialInfo
            userName={user?.name || ""}
            onClose={onClose}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === "review" && (
          <TestimonialReview
            review={review}
            setReview={setReview}
            rating={rating}
            setRating={setRating}
            setCurrentPage={setCurrentPage}
          />
        )}

        {currentPage === "submit" && (
          <div className="flex flex-col gap-4">
            <Heading
              as="h3"
              size="md"
              className="text-center text-fg capitalize"
            >
              Submit your review
            </Heading>
            {!user?.avatar && (
              // prompt the user to upload an avatar
              <div className="w-full flex flex-col gap-2">
                {/* user Image */}
                <EditableUserAvatar />
                {/* text */}
                <Paragraph
                  size="sm"
                  className="self-center max-w-[42ch] text-center text-surface"
                >
                  {`We noticed you don't have profile image. Would you like to upload one? `}
                  <span className="text-fg font-semibold">
                    help us make your review more personal.
                  </span>
                </Paragraph>
              </div>
            )}
            <Input
              className="w-full"
              name="title"
              label="Job Title"
              type="text"
              placeholder="Your job title..."
              onTextChange={setTitle}
            />

            <Input
              className="resize-none"
              name="thoughts"
              type="text-aria"
              rows={3}
              placeholder="Any additional thoughts?"
              onTextChange={setThoughts}
            />

            <Button
              onClick={submitReview}
              className="self-center w-fit bg-bg text-fg hover:bg-bg/90 disabled:bg-bg/30 disabled:text-bg/50"
              variant="ghost-2"
              // isSimple
              disabled={title.length < 3}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
