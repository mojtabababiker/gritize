import React, { useState } from "react";
import Image from "next/image";

import { EditIcon } from "lucide-react";

import { useAuth } from "@/context/AuthProvider";

function EditableUserAvatar() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [editAvatar, setEditAvatar] = useState(false);
  return (
    <div className="relative size-24 rounded-full self-center ring-2 ring-surface/10">
      {user?.avatar ? (
        <Image
          src={user.avatar}
          alt="Profile Image"
          width={120}
          height={120}
          className="rounded-full"
        />
      ) : (
        <div className="size-24 rounded-full flex items-center justify-center font-heading font-bold text-6xl  bg-bg/75 text-fg/80">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="group absolute -bottom-1 right-2 ">
        <EditIcon
          className="absolute right-0 bottom-0 cursor-pointer text-accent/60 hover:text-accent/90 transition-colors stroke-2"
          onClick={() => setEditAvatar(true)}
        />
        {/* popup */}
        <div className="absolute w-[130px] z-50 -top-14 -right-6 bg-bg/90 text-fg text-sm pointer-events-none rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">
          edit profile image
        </div>
      </div>
    </div>
  );
}

export default EditableUserAvatar;
