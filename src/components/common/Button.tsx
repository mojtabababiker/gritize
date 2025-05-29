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
        "relative flex items-center cursor-pointer duration-300 ease-in-out",
        isSimple
          ? "rounded-lg transition-all"
          : "button-cutout transition-[filter,background-position,color]",
        size === "sm" &&
          "font-body font-medium text-xs sm:text-base px-1.5 py-2 sm:px-2 sm:py-3",
        size === "md" &&
          "font-heading font-semibold text-sm sm:text-base px-2 py-2 lg:px-4 lg:py-3",
        size === "lg" &&
          "font-heading capitalize font-semibold text-base sm:text-lg lg:text-xl px-2 sm:px-3 lg:px-4 py-3",
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
