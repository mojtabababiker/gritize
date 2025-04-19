"use client";

import clsx from "clsx";
import { HTMLInputTypeAttribute, InputHTMLAttributes, useState } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  type: HTMLInputTypeAttribute | "text-aria";
  name: string;
  defaultValue?: string | number;
  placeholder?: string;
  label?: string;
  className?: string;
};

function Input({
  type,
  name,
  defaultValue,
  className,
  label,
  placeholder,
  id,
}: Props) {
  const [value, setValue] = useState<string | number | undefined>(defaultValue);
  const CLASS_NAME =
    "text-bg/70 bg-fg placeholder-bg/40 ring-1 ring-accent focus:outline-accent rounded-xl py-4 transition-all duration-150 ease-in-out";
  return (
    <div className="flex flex-col gap-1 p-1">
      {label && (
        <label htmlFor={id} className="text-surface text-base capitalized">
          {label}
        </label>
      )}
      {type === "text-aria" ? (
        <textarea
          name={name}
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          rows={8}
          className={clsx("px-6", CLASS_NAME, className)}
        />
      ) : (
        <input
          name={name}
          type={type}
          id={id}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className={clsx("px-4", CLASS_NAME, className)}
        />
      )}
    </div>
  );
}

export default Input;
