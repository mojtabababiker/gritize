"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { User } from "@/models/users";
import { checkAuth } from "@/utils/appwrite/auth-action";

const anonymousUser = new User({
  id: undefined,
  name: "Anonymous",
  email: "",
  avatar: "",
  onboarding: false,
  isNewUser: false,
  totalSolvedProblems: 0,
});

type AuthContextType = {
  user: User | null;
  setUser: (user: User) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const { isLoggedIn: loggedIn, user } = await checkAuth();
      setIsLoggedIn(loggedIn);
      if (loggedIn && user) {
        const newUser = await User.fromJson(user);
        setUser(newUser);
      } else {
        setUser(anonymousUser);
      }
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
  }, []);

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
