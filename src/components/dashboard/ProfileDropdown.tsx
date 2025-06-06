"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Code2Icon, LogOutIcon, StarIcon, UserPenIcon } from "lucide-react";
import toast from "react-hot-toast";
import clsx from "clsx";

import { Settings } from "@/constant/setting";
import { useAuth } from "@/context/AuthProvider";

import TestimonialProvider from "@/components/testimonials/TestmonialProvider";
import GithubIcon from "@/components/icons/GithubIcon";
import QuizRunner from "@/components/quiz/QuizRunner";

import Loading from "@/components/common/Loading";
import Heading from "@/components/common/Heading";
import CustomToast from "@/components/common/CustomToast";

import EditableUserAvatar from "./UserAvatar";
import ProfileEditor from "./ProfileEditor";

type Props = {
  open?: boolean;
};

function ProfileDropdown({ open }: Props) {
  const router = useRouter();
  const { user, setUser, setIsLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(open || false);
  const [isLoading, setIsLoading] = useState(false);

  // actions state
  const [editProfile, setEditProfile] = useState(false);
  const [askForTestimonial, setAskForTestimonial] = useState(false);
  const [startQuiz, setStartQuiz] = useState(false);

  const handleEditProfile = () => {
    setIsOpen(false);
    setEditProfile(true);
  };

  const handleQuizFinish = () => {
    setStartQuiz(false);
    toast.custom((t) => (
      <CustomToast
        t={t}
        message="Quiz completed! Your profile has been updated."
      />
    ));
    router.refresh();
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
        <div className="w-full flex flex-col ">
          {/* Edit Profile */}
          <button
            className="w-full p-2 rounded-lg hover:bg-surface/10 flex justify-between items-center  cursor-pointer transition-all duration-200 ease-in-out"
            onClick={handleEditProfile}
          >
            <div className="w-full h-full text-left">Edit Profile</div>
            <UserPenIcon className="size-4 text-surface" />
          </button>

          {/* run quiz */}
          <button
            className="w-full p-2 rounded-lg hover:bg-surface/10 flex justify-between items-center cursor-pointer transition-all duration-200 ease-in-out"
            onClick={() => {
              setIsOpen(false);
              setStartQuiz(true);
            }}
          >
            <div className="w-full h-full text-left">Run Quiz</div>
            <Code2Icon className="size-4 text-surface" />
          </button>

          {/* Logout */}
          <button
            className="w-full p-2 rounded-lg hover:bg-surface/10 flex justify-between items-center cursor-pointer transition-all duration-200 ease-in-out"
            onClick={handleLogout}
          >
            <div className="w-full h-full text-left text-red-500">Logout</div>
            <LogOutIcon className="size-4 text-red-500" />
          </button>
        </div>

        {/* review and contribute actions */}
        <div className="w-full pt-2 flex gap-4 items-center justify-center border-t border-surface/10">
          <button
            className="text-fg/45 text-sm hover:text-fg transition-all duration-200 ease-in-out cursor-pointer flex gap-1 items-center"
            onClick={() => setAskForTestimonial(true)}
          >
            <StarIcon className="size-3" />
            rate us
          </button>
          <Link
            title="GitHub Repository"
            href={Settings.githubRepo}
            target="_blank"
            className="text-fg/45 text-sm hover:text-fg transition-all duration-200 ease-in-out flex gap-1 items-center"
            rel="noopener noreferrer"
          >
            <GithubIcon className="size-3" />
            contribute
          </Link>
        </div>
      </div>
      {/* Profile edit Modal */}
      {editProfile && (
        <ProfileEditor closeModal={() => setEditProfile(false)} />
      )}

      {/* loading */}
      {isLoading && <Loading />}

      {/* review provider */}
      {askForTestimonial && (
        <div className="fixed inset-0 h-screen w-screen z-50 bg-bg/40 cursor-auto">
          <TestimonialProvider
            show={askForTestimonial}
            onClose={() => setAskForTestimonial(false)}
          />
        </div>
      )}
      {/* quiz modal */}
      {startQuiz && (
        <QuizRunner
          onFinish={handleQuizFinish}
          closeQuiz={() => setStartQuiz(false)}
          startingFrom="languageSelector"
        />
      )}
    </>
  );
}

export default ProfileDropdown;
