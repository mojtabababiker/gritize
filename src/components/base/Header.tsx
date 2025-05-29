"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthProvider";

import Button from "@/components/common/Button";
import Bounded from "@/components/common/Bounded";
import Loading from "@/components/common/Loading";
import AuthDialog from "@/components/auth/AuthDialog";

function Header() {
  const [requireLogin, setRequireLogin] = useState(false);
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    const scrollTo = (containerId: string) => {
      const element = document.getElementById(containerId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    };

    const linkClickHandler = (e: Event) => {
      const link = e.currentTarget as HTMLAnchorElement;
      e.preventDefault();
      const targetId = link.getAttribute("href")?.substring(1);
      if (targetId) {
        scrollTo(targetId);
      }
    };

    const innerLinks = document.querySelectorAll("a[href^='#']");
    innerLinks.forEach((link) => {
      link.addEventListener("click", linkClickHandler);
    });
  }, []);

  return !user ? (
    <Loading />
  ) : (
    <>
      <Bounded
        as="header"
        className="absolute z-40 h-fit top-0 max-h-fit bgs-surface overflow-hidden "
      >
        <div className="flex flex-wrap pt-6 pb-4 gap-4 overflow-clip">
          {/* icon */}
          <div className="relative sm:min-w-[190px] flex items-center flex-1">
            <Image
              src="/images/main-logo.png"
              width={200}
              height={200}
              alt="Logo"
              className="w-full min-w-[120px] max-w-[190px] h-auto"
            />
            <div className="absolute -top-4 left-0">
              <span className="text-base text-accent font-semibold">Beta</span>
            </div>
          </div>

          {/* button */}
          <div className="flex flex-1 items-center justify-end px-2">
            <Button
              variant="accent"
              size="lg"
              className="ml-0 sm:px-8"
              onClick={() => {
                if (!isLoggedIn) {
                  setRequireLogin(true);
                } else {
                  router.push("/dashboard");
                }
              }}
            >
              {isLoggedIn ? "Dashboard" : "Login"}
            </Button>
          </div>
        </div>
      </Bounded>
      {/* login dialog */}
      {requireLogin && <AuthDialog onClose={() => setRequireLogin(false)} />}
    </>
  );
}

export default Header;
