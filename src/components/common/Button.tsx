import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
};

function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className,
  onClick,
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        "button-cutout relative flex items-center cursor-pointer transition-all duration-150",
        size === "sm" && "font-body font-medium text-sm px-4 py-2",
        size === "md" && "font-heading font-semibold text-lg px-6 py-3",
        size === "lg" &&
          "font-heading capitalize font-semibold text-xl px-4 py-3",
        variant === "primary" && "text-fg bg-primary shadow-fg",
        variant === "accent" && "text-bg bg-accent shadow-primary",
        variant === "ghost" && "bg-surface text-bg border border-primary",
        variant,
        className,
        disabled && "pointer-events-none opacity-85"
      )}
      onClick={onClick}
      {...props}
    >
      <div>{isLoading ? "Loading..." : children}</div>
    </button>
  );
}

export default Button;
