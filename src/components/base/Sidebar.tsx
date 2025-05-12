"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Heading from "../common/Heading";
import Paragraph from "../common/Paragraph";
import clsx from "clsx";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import CustomToast from "../common/CustomToast";
import SidebarItem from "../cards/SidebarItem";
import SidebarCPItems from "../cards/SidebarCPItems";

function Sidebar() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  // const user = {
  //   firstName: "Mazin",
  //   profileImage: "/images/users/user3.png",
  //   solvedProblems: 18, // typically it would be array of objects
  //   codingTechniques: [
  //     {
  //       name: "Tow Pointers",
  //       slug: "two-pointers",
  //       totalProblems: 6,
  //       solvedProblems: 6,
  //     },
  //     {
  //       name: "Sliding Window",
  //       slug: "sliding-window",
  //       totalProblems: 5,
  //       solvedProblems: 4,
  //     },
  //     {
  //       name: "Backtracking",
  //       slug: "backtracking",
  //       totalProblems: 3,
  //       solvedProblems: 2,
  //     },
  //   ], // typically it would be array of objects
  //   totalAlgorithms: [
  //     {
  //       name: "bobble sort",
  //       slug: "bobble-sort",
  //       score: 9.3,
  //     },
  //     {
  //       name: "quick sort",
  //       slug: "quick-sort",
  //       score: 8.5,
  //     },
  //     {
  //       name: "merge sort",
  //       slug: "merge-sort",
  //       score: 7.5,
  //     },
  //   ],
  // };
  const { user, setUser, setIsLoggedIn } = useAuth();

  const closeSidebar = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".sidebar")) {
      setOpen(true);
    } else {
      setOpen(false);
    }
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
  return (
    <aside
      className={clsx(
        "sidebar fixed z-40 top-22 2xl:top-0 left-0 2xl:min-h-screen 2xl:min-w-[86px] max-w-[420px] flex flex-col justify-between gap-8 px-4 bg-bg/60 backdrop-blur-md overflow-x-hidden drop-shadow-sm shadow-bg/50 shadow-xl",
        open
          ? "w-full h-[calc(100dvh-90px)] py-12 overflow-y-auto"
          : "w-12 h-12 rounded-full 2xl:rounded-none overflow-hidden"
      )}
    >
      {/* solved problems */}
      <div className="flex flex-col gap-6 items-center justify-center">
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
              "text-fg flex-1transition-all duration-500 ease-in-out",
              !open && "opacity-0 scale-x-0 order-1"
            )}
          >
            Coding Techniques
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
          {user && user.codingTechniques.length > 0 ? (
            // user.codingTechniques.map((tech) => (
            //   <div
            //     key={tech.title}
            //     className="flex items-center justify-between w-full px-4 py-2 rounded-2xl bg-primary/25 shadow shadow-fg/10 shadow-b"
            //   >
            //     <div className="flex gap-2 items-center">
            //       <Image
            //         src={"/icons/list-icon.png"}
            //         alt=""
            //         width={20}
            //         height={20}
            //         className="w-3 h-3 object-contain"
            //       />
            //       <Link
            //         href={`/playground?problem=${tech.id}`}
            //         className="text-lg  capitalize text-surface hover:text-accent truncate"
            //       >
            //         {tech.title}
            //       </Link>
            //     </div>
            //     <span className="text-fg/50">
            //       {tech.solvedProblems}/{tech.totalProblems}
            //     </span>
            //   </div>
            // ))
            <SidebarCPItems codingPatterns={user.codingTechniques} />
          ) : (
            <Paragraph className="text-fg/70 w-full text-center">
              No techniques solved yet
            </Paragraph>
          )}
        </div>
      </div>

      {/* quick links */}
      <ul className="w-full flex flex-col gap-4">
        <li className="flex gap-2 items-center justify-center">
          <Image
            src={"/icons/code-icon.png"}
            alt=""
            width={24}
            height={24}
            className="object-contain"
          />
          <Link
            href="/playground"
            className={clsx(
              "text-fg hover:text-accent flex-1",
              !open && "hidden"
            )}
          >
            Playground
          </Link>
        </li>
        <li className="flex gap-2 items-center justify-center">
          <Image
            src={"/icons/exit-icon.png"}
            alt=""
            width={24}
            height={24}
            className="object-contain"
          />
          <button
            onClick={logout}
            className={clsx(
              "text-fg hover:text-accent cursor-pointer flex-1 text-left",
              !open && "hidden"
            )}
          >
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
