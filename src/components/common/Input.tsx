"use client";

import clsx from "clsx";
import { Eye, EyeClosed } from "lucide-react";
import {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  useRef,
  useState,
} from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  type: HTMLInputTypeAttribute | "text-aria";
  name: string;
  defaultValue?: string | number;
  placeholder?: string;
  label?: string;
  className?: string;
  rows?: number;
  onTextChange?: (value: string) => void;
};

function Input({
  type,
  name,
  defaultValue,
  className,
  label,
  placeholder,
  id,
  rows,
  onTextChange,
}: Props) {
  const [value, setValue] = useState<string | number | undefined>(defaultValue);
  const [showPwd, setShowPwd] = useState(false);
  const [inputType, setInputType] = useState(type);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleShowPwd = () => {
    if (inputType === "password") {
      setInputType("text");
    } else {
      setInputType("password");
    }
    inputRef.current?.focus();
    setShowPwd((prev) => !prev);
  };
  const CLASS_NAME =
    "relative text-bg/70 bg-fg placeholder-bg/40 ring-1 ring-accent focus:outline-accent rounded-xl py-3 sm:py-4 transition-all duration-150 ease-in-out";
  return (
    <div className="flex flex-col gap-1">
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
          onChange={(e) => {
            setValue(e.target.value);
            onTextChange?.(e.target.value);
          }}
          placeholder={placeholder}
          rows={rows || 8}
          className={clsx("sm:px-6 [padding-left:4px]", CLASS_NAME, className)}
        />
      ) : (
        <div className={clsx("relative", className)}>
          <input
            ref={inputRef}
            name={name}
            type={inputType}
            id={id}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              onTextChange?.(e.target.value);
            }}
            placeholder={placeholder}
            className={clsx(
              "sm:px-4 [padding-left:4px]",
              CLASS_NAME,
              className
            )}
          />
          {type === "password" && (
            <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center px-1 sm:p-4">
              <span className="sr-only">
                {showPwd ? "Hide" : "Show"} Password
              </span>
              {showPwd ? (
                <EyeClosed
                  className="size-4 sm:size-5  text-bg/70 hover:text-bg/90"
                  onClick={toggleShowPwd}
                />
              ) : (
                <Eye
                  className="size-4 sm:size-5  text-bg/70 hover:text-bg/90"
                  onClick={toggleShowPwd}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Input;
