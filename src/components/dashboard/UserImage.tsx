import Image from "next/image";
import clsx from "clsx";

type UserImageProps = {
  avatar?: string;
  username: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};
export const UserImage = ({
  avatar,
  username,
  size = "md",
  className,
}: UserImageProps) => {
  return avatar ? (
    <Image
      src={avatar}
      alt="Profile Image"
      width={160}
      height={160}
      className="w-full h-full rounded-full"
    />
  ) : (
    <div
      className={clsx(
        "w-full h-full rounded-full flex items-center justify-center font-heading font-bold",
        size === "xs" && "text-xs sm:text-xl",
        size === "sm" && "text-lg sm:text-xl lg:text-2xl",
        size === "md" && "text-3xl sm:text-6xl",
        size === "lg" && "text-4xl sm:text-7xl",
        className
      )}
    >
      {username.charAt(0).toUpperCase()}
    </div>
  );
};
