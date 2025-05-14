import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "ghost" | "ghost-2";
  size?: "sm" | "md" | "lg";
  isSimple?: boolean;
  isLoading?: boolean;
  className?: string;
  onClick?: () => void;
};

function Button({
  children,
  variant = "primary",
  size = "md",
  isSimple = false,
  isLoading = false,
  disabled,
  className,
  onClick,
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        "relative flex items-center cursor-pointer transition-all duration-350",
        isSimple ? "rounded-lg" : "button-cutout",
        size === "sm" && "font-body font-medium text-sm px-4 py-2",
        size === "md" && "font-heading font-semibold text-lg px-6 py-3",
        size === "lg" &&
          "font-heading capitalize font-semibold text-xl px-4 py-3",
        variant === "primary" && "text-fg bg-primary shadow-fg",
        variant === "accent" && "text-bg bg-accent shadow-primary",
        variant === "ghost" && " text-bg border border-primary",
        variant,
        className,
        disabled && "pointer-events-none opacity-65"
      )}
      onClick={onClick}
      {...props}
    >
      <>{isLoading ? "Loading..." : children}</>
    </button>
  );
}

export default Button;
