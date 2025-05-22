"use client";
import { useEffect, useRef, useState } from "react";

import { Languages } from "@/models/types/indext";
import { useAuth } from "@/context/AuthProvider";

import Heading from "@/components/common/Heading";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";

import LanguageSelector from "./LanguageSelector";
import EditableUserAvatar from "./UserAvatar";

type Props = {
  closeModal: () => void;
};

function ProfileEditor({ closeModal }: Props) {
  const { user } = useAuth();

  const [newUsername, setNewUsername] = useState(user?.name);
  const [newLanguage, setNewLanguage] = useState(user?.preferredLanguage);
  const [notValidName, setNotValidName] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const updateUserLanguage = (language: Languages) => {
    setNewLanguage(language);
    console.log("Selected language:", language);
    console.log("User preferred language:", user?.preferredLanguage);
  };

  const saveChanges = async () => {
    if (!user) return;
    if (!newUsername) {
      setNotValidName(true);
      return;
    }
    const isValidName = newUsername.length > 3 && newUsername.length < 20;
    if (!isValidName) {
      setNotValidName(true);
      return;
    }
    setIsLoading(true);
    setNotValidName(false);

    // save the changes to the user
    user.name = newUsername;
    user.preferredLanguage = newLanguage;
    await user.save();
    setIsLoading(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (!containerRef.current) return;
    if (event.target === containerRef.current) {
      // close the modal
      closeModal();
      return;
    }
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("click", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("click", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div
      className="fixed inset-0 h-screen z-50 px-3 flex items-center justify-center bg-bg/40 cursor-auto"
      ref={containerRef}
    >
      {/* modal */}
      <div className="profile-dropdown w-full max-w-[460px] p-4 flex flex-col items-center gap-4 rounded-2xl">
        <Heading as="h3" size="md" className="text-fg">
          Edit Profile
        </Heading>
        {/* editable user image */}
        <EditableUserAvatar />

        {/* separator */}
        <div className="border-t border-surface/10 my-4 w-full" />

        {/* user info */}
        <div className="w-full flex flex-col gap-6">
          {/* name */}
          <div className="w-full flex flex-col">
            <Input
              label="name"
              name="name"
              type="text"
              // placeholder="Your Name"
              defaultValue={newUsername}
              onTextChange={setNewUsername}
              className="w-full"
            />
            {/* validation error */}
            {notValidName && (
              <div className="text-sm text-accent ml-2 min-h-6">
                user name is not valid
              </div>
            )}
          </div>

          {/* preferred programming language dropdown */}
          <div className="w-full flex flex-col gap-1">
            <label htmlFor="language" className="text-base text-fg">
              Preferred Programming Language
            </label>
            <LanguageSelector
              className="relative text-fg/70 bg-bg placeholder-fg/70 ring-1 ring-accent focus:outline-accent rounded-xl py-4 px-5 transition-all duration-150 ease-in-out appearance-none"
              onValueChange={updateUserLanguage}
              defaultValue={user?.preferredLanguage}
            />
          </div>
        </div>

        {/* save button */}
        <div className="w-full flex">
          <Button
            isSimple
            variant="accent"
            size="md"
            className="w-full"
            disabled={
              newLanguage === user?.preferredLanguage &&
              newUsername?.trim() === user?.name
            }
            isLoading={isLoading}
            onClick={saveChanges}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditor;
