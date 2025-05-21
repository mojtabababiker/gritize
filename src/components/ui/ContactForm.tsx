import { useActionState, useEffect, useState } from "react";
import clsx from "clsx";

import { submit } from "@/utils/form-actions";

import Paragraph from "@/components/common/Paragraph";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import toast from "react-hot-toast";
import CustomToast from "../common/CustomToast";

type Props = {
  className?: string;
};

function ContactForm({ className }: Props) {
  const [state, action, isPending] = useActionState(submit, null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    message?: string;
    email?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const messageToaster = (message: string, type: "error" | "success") => {
    toast.custom((t) => <CustomToast t={t} type={type} message={message} />);
  };

  useEffect(() => {
    if (!state) return;

    if (!state.ok) {
      if (state.error?.type === "validation" && state.error.errors) {
        const fieldIssues = state.error.errors;
        const fieldErrors: { [key: string]: string } = {};
        fieldIssues.forEach((issue) => {
          fieldErrors[issue.path[0] as string] = issue.message;
        });
        setServerError(null);
        setValidationErrors(fieldErrors);
      } else if (state.error?.type === "server") {
        // @ts-expect-error never undefined if type is server
        setServerError(state.error.message);
      }
      messageToaster("Oops! Something went wrong", "error");
    } else {
      setValidationErrors({});
      setServerError(null);
      messageToaster("We got your message!", "success");
    }
  }, [state]);
  return (
    <form
      action={action}
      className={clsx(
        "w-full flex flex-col gap-6 items-center justify-center",
        className
      )}
    >
      {/* text */}
      <div className="w-full flex flex-col">
        <Paragraph size="sm" className="w-full max-w-[42ch]">
          Got feedback? Ideas? Just want to say hi? We’d love to hear from you
        </Paragraph>
        {serverError && (
          <Paragraph size="sm" className="text-accent">
            {serverError}
          </Paragraph>
        )}
      </div>
      {/* info */}
      <div className="w-full flex flex-wrap gap-x-3 gap-y-6">
        <div className="flex-1 flex flex-col gap-1 sm:max-w-[200px]">
          <Input
            type="text"
            label="name"
            name="name"
            id="input-name"
            placeholder="Your Name@/components."
          />
          {validationErrors.name && (
            <Paragraph size="sm" className="text-accent">
              {validationErrors.name}
            </Paragraph>
          )}
        </div>

        <div className="flex-1 flex flex-col gap-1 sm:max-w-[200px]">
          <Input
            type="email"
            label="email"
            name="email"
            id="input-email"
            placeholder="name@example.com"
          />
          {validationErrors.email && (
            <Paragraph size="sm" className="text-accent">
              {validationErrors.email}
            </Paragraph>
          )}
        </div>
      </div>
      {/* message */}
      <div className="shrink-0 w-full flex flex-col gap-1 min-w-[240px]">
        <Input
          type="text-aria"
          name="message"
          id="input-message"
          placeholder="Type Here@/components."
        />
        {validationErrors.message && (
          <Paragraph size="sm" className="text-accent">
            {validationErrors.message}
          </Paragraph>
        )}
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
          {state?.ok ? "We got it!" : "Send It"}
        </Button>
      </div>
    </form>
  );
}

export default ContactForm;
