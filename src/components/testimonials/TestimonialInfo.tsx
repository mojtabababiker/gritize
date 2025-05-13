import React from "react";
import Heading from "../common/Heading";
import Paragraph from "../common/Paragraph";
import Button from "../common/Button";

type Props = {
  userName: string;
  setCurrentPage: React.Dispatch<
    React.SetStateAction<"info" | "review" | "submit">
  >;
  onClose: () => void;
};

function TestimonialInfo({ userName, setCurrentPage, onClose }: Props) {
  return (
    <>
      <Heading
        as="h3"
        size="md"
        className="self-center max-w-[16ch] text-center text-fg capitalize"
      >
        Valuable insights to helps us grow
      </Heading>

      <Paragraph
        size="sm"
        className="self-center max-w-[42ch] text-center text-surface"
      >
        {`Hello ${userName}, we would love to hear about your experience with Gritiz by answering two simple questions`}
      </Paragraph>

      <Button
        variant="ghost-2"
        className="text-surface max-w-fit self-center bg-bg hover:bg-bg/95"
        onClick={() => setCurrentPage("review")}
      >
        Start Now
      </Button>
      <button
        className="bg-transparent text-bg underline italic text-xl cursor-pointer"
        onClick={onClose}
      >
        Skip for now
      </button>
    </>
  );
}

export default TestimonialInfo;
