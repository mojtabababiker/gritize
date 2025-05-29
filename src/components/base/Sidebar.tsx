"use client";
import { MouseEventHandler, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import clsx from "clsx";
import toast from "react-hot-toast";
import { XIcon } from "lucide-react";

import { useAuth } from "@/context/AuthProvider";

import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import CustomToast from "@/components/common/CustomToast";
import SidebarItem from "@/components/cards/SidebarItem";
import SidebarCPContainer from "@/components/dashboard/SidebarCPContainer";

function Sidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const { user, setUser, setIsLoggedIn, isLoggedIn } = useAuth();

  const closeSidebar = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".sidebar")) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const closeSidebarButtonHandler: MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  const logout = async () => {
    if (!user) {
      return;
    }
    await user.logout();
    setIsLoggedIn(false);
    setUser(user);

    toast.custom((t) => (
      <CustomToast t={t} type="success" message="Logged out successfully" />
    ));

    router.replace("/");
  };

  useEffect(() => {
    window.addEventListener("click", closeSidebar);

    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    });

    return () => {
      window.removeEventListener("click", closeSidebar);
      window.removeEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          setOpen(false);
        }
      });
    };
  });

  if (!isLoggedIn) {
    return null;
  }

  return (
    <aside
      className={clsx(
        "sidebar fixed z-40 top-22 2xl:top-0 left-0 2xl:min-h-screen 2xl:min-w-[86px] max-w-[420px] flex flex-col justify-between gap-8 px-4 bg-bg/60 backdrop-blur-md overflow-x-hidden drop-shadow-sm shadow-bg/50 shadow-xl",
        open
          ? "w-full h-[calc(100dvh-90px)] py-12 mr-6 overflow-y-scroll"
          : "w-12 h-12 rounded-sm 2xl:rounded-none overflow-hidden"
      )}
    >
      {/* close sidebar */}
      <div
        className={clsx(
          "absolute sm:hidden top-0 left-0 pt-2 w-full items-center justify-center ",
          !open ? "hidden" : "flex"
        )}
      >
        <button
          className="size-10 rounded-full ring-1 ring-surface/15 flex items-center justify-center"
          onClick={closeSidebarButtonHandler}
        >
          <XIcon className="size-6 sm:size-8 text-accent" />
        </button>
      </div>
      {/* solved problems */}
      <div className="flex flex-col gap-6 items-center justify-center mt-2 sm:mt-0">
        {/* title */}
        <div className="w-full flex justify-between items-center">
          <Heading
            as="h3"
            size="md"
            className={clsx(
              "text-fg flex-1transition-all duration-500 ease-in-out",
              !open && "opacity-0 scale-x-0 order-1"
            )}
          >
            Solved Algorithms
          </Heading>
          <Image
            src={"/icons/algo-icon.png"}
            alt=""
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* content */}
        <div
          className={clsx(
            "w-full flex flex-col gap-3 items-center transition-all duration-500 ease-in-out",
            !open && "opacity-0 scale-x-0"
          )}
        >
          {user && user.algorithmProblems.length > 0 ? (
            user.algorithmProblems.map((algo) => (
              <SidebarItem
                key={algo.id}
                problem={algo}
                href={`/playground?problem=${algo.id}`}
              />
            ))
          ) : (
            <Paragraph className="text-fg/70 w-full text-center">
              No algorithms solved yet
            </Paragraph>
          )}
        </div>
      </div>

      {/* solved techniques */}
      <div className="flex flex-col gap-6 items-center justify-center">
        {/* title */}
        <div className="w-full flex justify-between items-center">
          <Heading
            as="h3"
            size="md"
            className={clsx(
              "text-fg flex-1 transition-all duration-500 ease-in-out flex flex-col",
              !open && "opacity-0 scale-x-0 order-1"
            )}
          >
            <span className="text-surface/65 text-base font-body font-normal italic">
              {user?.codingTechniques.length}/3 remaining
            </span>
            <span className="w-full">Coding Techniques</span>
          </Heading>
          <Image
            src={"/icons/brain-icon.png"}
            alt=""
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* content */}
        <div
          className={clsx(
            "w-full flex flex-col gap-3 items-center transition-all duration-500 ease-in-out",
            !open && "opacity-0 scale-x-0"
          )}
        >
          <SidebarCPContainer />
        </div>
      </div>

      {/* quick links */}
      <ul className="w-full flex flex-col gap-4">
        <li className="">
          <Link
            href="/playground"
            className={clsx(
              "text-fg hover:text-accent flex gap-2 items-center justify-center sm:justify-start ",
              !open && "hidden"
            )}
          >
            <Image
              src={"/icons/code-icon.png"}
              alt=""
              width={24}
              height={24}
              className="size-4 sm:size-6 object-contain"
            />
            Playground
          </Link>
        </li>
        <li className="">
          <button
            onClick={logout}
            className={clsx(
              "text-fg hover:text-accent cursor-pointer w-full flex gap-2 items-center justify-center sm:justify-start text-left",
              !open && "hidden"
            )}
          >
            <Image
              src={"/icons/exit-icon.png"}
              alt=""
              width={24}
              height={24}
              className="size-3.5 sm:size-6 object-contain"
            />
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
