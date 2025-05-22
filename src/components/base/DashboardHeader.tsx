"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useAuth } from "@/context/AuthProvider";

import Bounded from "@/components/common/Bounded";
import Heading from "@/components/common/Heading";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import { UserImage } from "@/components/dashboard/UserImage";

function DashboardHeader() {
  const { user } = useAuth();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleProfileClick = () => {
    setShowProfileDropdown((prev) => !prev);
  };
  return (
    <Bounded
      as="header"
      className="sticky top-0 py-4 z-40 bg-bg/60  backdrop-blur-md drop-shadow-sm shadow-bg/50 shadow-xl"
    >
      {/* header */}
      <div className="flex items-center justify-between">
        {/* logo */}
        <Link href="/">
          <Image
            src="/images/main-logo.png"
            alt="Gritize Logo"
            width={200}
            height={200}
            className="w-full max-w-[190px] h-auto"
          />
        </Link>

        <div className="flex items-center justify-end gap-2">
          {/* name */}
          <Heading as="span" size="sm" className="text-fg">
            {user?.name || ""}
          </Heading>
          {/* profile dropdown */}

          <div className="relative overflow-visible flex items-center justify-center rounded-full w-14 h-14 p-0 bg-surface">
            <button
              onClick={handleProfileClick}
              className="w-full h-full p-0 cursor-pointer"
            >
              <span className="sr-only">Open profile menu</span>
              <UserImage
                avatar={user?.avatar}
                username={user?.name || "?"}
                size="sm"
                className="text-bg/75 bg-accent/30"
              />
            </button>
            <div className="absolute py-3 top-full right-3">
              <ProfileDropdown open={showProfileDropdown} />
            </div>
          </div>
        </div>
      </div>
    </Bounded>
  );
}

export default DashboardHeader;
