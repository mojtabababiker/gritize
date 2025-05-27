"use client";
import clsx from "clsx";
import Image from "next/image";
import Bounded from "../common/Bounded";
import { useEffect, useState } from "react";
import Button from "../common/Button";
import AuthDialog from "../auth/AuthDialog";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import Loading from "../common/Loading";
import Link from "next/link";

type MenuPage = {
  name: string;
  href: string;
};

const MENU_ITEMS: MenuPage[] = [
  { name: "Home", href: "/" },
  { name: "Contribute", href: "#about-us" },
];

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

          {/* nav menu */}
          <nav className="flex w-full md:flex-1 order-3 md:order-none items-center justify-center md:justify-end pt-4 sm:pt-0">
            <ul className="nav-menu flex items-end gap-4">
              {MENU_ITEMS.map((item) => (
                <li key={item.name}>
                  <Link
                    className={clsx(
                      "text-bg/80 font-heading text-xl sm:text-lg transition-all duration-200 hover:text-bg/100"
                    )}
                    href={item.href}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

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
