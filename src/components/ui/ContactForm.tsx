import React, { useActionState } from "react";
import Paragraph from "../common/Paragraph";
import Input from "../common/Input";
import Button from "../common/Button";
import { submit } from "@/utils/form-actions";
import clsx from "clsx";

type Props = {
  className?: string;
};

function ContactForm({ className }: Props) {
  const [state, action, isPending] = useActionState(submit, null);
  console.log(state);
  return (
    <form
      action={action}
      className={clsx(
        "w-full flex flex-col gap-6 items-center justify-center",
        className
      )}
    >
      {/* text */}
      <div className="w-full flex">
        <Paragraph size="sm" className="w-full max-w-[42ch]">
          Got feedback? Ideas? Just want to say hi? We’d love to hear from you
        </Paragraph>
      </div>
      {/* info */}
      <div className="w-full flex flex-wrap gap-x-3 gap-y-6">
        <div className="flex-1 flex flex-col gap-1 sm:max-w-[200px]">
          <Input
            type="text"
            label="name"
            name="name"
            id="input-name"
            placeholder="Your Name..."
          />
        </div>

        <div className="flex-1 flex flex-col gap-1 sm:max-w-[200px]">
          <Input
            type="email"
            label="email"
            name="email"
            id="input-email"
            placeholder="name@example.com"
          />
        </div>
      </div>
      {/* message */}
      <div className="shrink-0 w-full flex flex-col gap-1 min-w-[240px]">
        <Input
          type="text-aria"
          name="message"
          id="input-message"
          placeholder="Type Here..."
        />
      </div>

      {/* submit */}
      <div className="flex items-center justify-center p-1">
        <Button
          disabled={isPending}
          isLoading={isPending}
          variant="accent"
          size="md"
          type="submit"
        >
          Send It
        </Button>
      </div>
    </form>
  );
}

export default ContactForm;
