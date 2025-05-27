"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import clsx from "clsx";
import { LogOutIcon, UserPenIcon } from "lucide-react";

import { useAuth } from "@/context/AuthProvider";

import Loading from "@/components/common/Loading";

import EditableUserAvatar from "./UserAvatar";
import ProfileEditor from "./ProfileEditor";
import Heading from "../common/Heading";

type Props = {
  open?: boolean;
};

function ProfileDropdown({ open }: Props) {
  const router = useRouter();
  const { user, setUser, setIsLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(open || false);
  const [editProfile, setEditProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditProfile = () => {
    setIsOpen(false);
    setEditProfile(true);
  };

  const handleLogout = async () => {
    if (!user) return;
    setIsLoading(true);
    // logout the user and delete the session
    await user.logout();
    setUser(user);
    setIsLoggedIn(false);
    setIsLoading(false);
    // show a toast message

    router.replace("/");
    // redirect to the landing page
  };

  useEffect(() => {
    setIsOpen(open || false);
  }, [open]);
  return (
    <>
      <div
        className={clsx(
          "profile-dropdown z-50 w-screen max-w-[280px] sm:max-w-[320px] py-6 px-4 rounded-2xl ring-0.5  shadow-sm shadow-accent/5 ring-fg/15 flex flex-col gap-4",
          isOpen ? "animate-fade-in" : "hidden"
        )}
      >
        {/* editable user image */}
        <EditableUserAvatar />
        {/* name */}
        <Heading
          as="span"
          size="sm"
          className="text-fg w-full text-center sm:hidden block"
        >
          {user?.name || ""}
        </Heading>
        {/* separator */}
        <div className="border-t border-surface/10 my-4" />

        {/* actions menu */}
        <div className="w-full pt-4 flex flex-col gap-2 ">
          <button
            className="w-full p-2 rounded-lg hover:bg-surface/10 flex justify-between items-center  cursor-pointer transition-all duration-200 ease-in-out"
            onClick={handleEditProfile}
          >
            <div className="w-full h-full text-left">Edit Profile</div>
            <UserPenIcon className="size-4 text-surface" />
          </button>
          <button
            className="w-full p-2 rounded-lg hover:bg-surface/10 flex justify-between items-center cursor-pointer transition-all duration-200 ease-in-out"
            onClick={handleLogout}
          >
            <div className="w-full h-full text-left text-red-500">Logout</div>
            <LogOutIcon className="size-4 text-red-500" />
          </button>
        </div>
      </div>
      {/* Profile edit Modal */}
      {editProfile && (
        <ProfileEditor closeModal={() => setEditProfile(false)} />
      )}

      {/* loading */}
      {isLoading && <Loading />}
    </>
  );
}

export default ProfileDropdown;
