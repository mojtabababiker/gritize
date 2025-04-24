// function that uses appwrite admin client to login a user

"use server";
import { cookies } from "next/headers";
import { createAdminClient, createUserClient } from "@/config/appwrite";
import { AppwriteException } from "node-appwrite";
import { UserSchema } from "@/models/schemas";
import { getUserById } from "./database-action";

/**
 * Checks the authentication status of the user and retrieves their information.
 *
 * @returns Promise containing an object with:
 *  - isLoggedIn: boolean indicating if user is authenticated
 *  - user: UserSchema object containing user data if logged in, null otherwise
 *
 *
 * The function:
 * 1. Checks for valid session cookie
 * 2. Creates user client with session
 * 3. Retrieves user account and document from database
 *
 * If any step fails, returns {isLoggedIn: false, user: null} and logs the error.
 */
export const checkAuth = async (): Promise<{
  isLoggedIn: boolean;
  user: UserSchema | null;
}> => {
  const cookiesStore = await cookies();
  const session = cookiesStore.get("appwrite-session");
  if (!session || !session.value) {
    return { isLoggedIn: false, user: null };
  }
  try {
    const { account } = await createUserClient(session.value);
    const userAccount = await account.get();

    const user = await getUserById(userAccount.$id);
    if (!user) {
      return { isLoggedIn: false, user: null };
    }

    return { isLoggedIn: true, user };
  } catch (error) {
    console.error("Failed to check authentication", error);
    return { isLoggedIn: false, user: null };
  }
};

export const loginUser = async (email: string, password: string) => {
  // create an admin client
  const { account } = await createAdminClient();
  try {
    // login the user with the email and password
    const session = await account.createEmailPasswordSession(email, password);
    // create a new session for the user
    const cookiesStore = await cookies();
    cookiesStore.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(session.expire),
    });

    return { data: session.userId, error: null };
  } catch (error) {
    console.error("Login failed", error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { error: { response: "An unexpected error occurred" }, data: null };
  }
  // return userId
};

// function that logs out a user
export const logoutUser = async () => {
  const cookiesStore = await cookies();
  const session = cookiesStore.get("appwrite-session");
  if (!session || !session.value) {
    throw new Error("No session found!, user is not logged in");
  }
  const { account } = await createUserClient(session.value);
  await account.deleteSession("current");
  cookiesStore.delete("appwrite-session");
};

// function that registers (email/password) a user
export const registerUser = async (email: string, password: string) => {};
