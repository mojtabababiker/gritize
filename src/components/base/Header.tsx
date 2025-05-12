"use client";
import clsx from "clsx";
import Image from "next/image";
import Bounded from "../common/Bounded";
import { useState } from "react";
import Button from "../common/Button";
import AuthDialog from "../auth/AuthDialog";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";
import Loading from "../common/Loading";

type MenuPage = {
  name: string;
  href: string;
};

const MENU_ITEMS: MenuPage[] = [
  { name: "Home", href: "/" },
  { name: "Contribute", href: "/contribute" },
];

function Header() {
  const [active, setActive] = useState<MenuPage>(MENU_ITEMS[0]);
  const [requireLogin, setRequireLogin] = useState(false);
  const router = useRouter();
  const { isLoggedIn, user, setIsLoggedIn, setUser } = useAuth();

  const handleClick = (page: MenuPage) => {
    setActive(page);
    // route to the page
    // router.push(page.href);
  };

  const logout = () => {
    /* Add logout functionality here */
    if (!user) {
      return;
    }
    user.logout();
    setIsLoggedIn(false);
    setUser(user);
    setActive(MENU_ITEMS[0]);
    router.push("/");
  };
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
          <div className="flex flex-1 items-center justify-center">
            <Image
              src="/images/main-logo.png"
              width={200}
              height={200}
              alt="Logo"
              className="w-full max-w-[190px] h-auto"
            />
          </div>

          {/* nav menu */}
          <nav className="flex flex-1/2 min-w-[320px] order-3 sm:order-none items-center justify-center sm:justify-end pt-4 sm:pt-0">
            <ul className="nav-menu flex items-end gap-4">
              {MENU_ITEMS.map((item) => (
                <li key={item.name}>
                  <button
                    className={clsx(
                      "text-bg/80 font-heading text-xl sm:text-lg transition-all duration-200 hover:text-bg/100",
                      active.name === item.name
                        ? "font-bold active"
                        : "font-semibold scale-90"
                    )}
                    onClick={() => handleClick(item)}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* button */}
          <div className="flex items-center justify-end px-2">
            {isLoggedIn && (
              <div className="flex items-center justify-center gap-4 mr-4">
                <button
                  onClick={logout}
                  className={clsx(
                    "text-bg/65 hover:text-accent cursor-pointer flex-1 text-left transition-colors duration-200 ease-in-out"
                  )}
                >
                  Logout
                </button>
              </div>
            )}
            <Button
              variant="accent"
              size="lg"
              className="ml-0 px-8"
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
