"use client";

import { User } from "@/models/users";
import { checkAuth } from "@/utils/appwrite/auth-action";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

const anonymousUser = User.fromJson({
  id: "anonymous",
  name: "Anonymous",
  email: "",
  skillLevel: "mid-level",
  avatar: "",
  onboarding: false,
  totalSolvedProblems: 0,
});

type AuthContextType = {
  user: User;
  setUser: (user: User) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(anonymousUser);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const { isLoggedIn: loggedIn, user } = await checkAuth();
      setIsLoggedIn(loggedIn);
      if (loggedIn && user) {
        setUser(User.fromJson(user));
      } else {
        setUser(anonymousUser);
      }
      console.log("User status checked:", loggedIn, user);
    };

    checkLoginStatus();
  });

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext<AuthContextType | undefined>(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
