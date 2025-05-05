// function that uses appwrite admin client to login a user

"use server";
import { cookies } from "next/headers";

import { AppwriteException, Models } from "node-appwrite";

import { createAdminClient, createUserClient } from "@/config/appwrite";
import { UserDTO } from "@/models/dto/user-dto";

import { getUserById } from "./database-actions";

/**
 * Checks the authentication status of the user and retrieves their information.
 *
 * @returns Promise containing an object with:
 *  - isLoggedIn: boolean indicating if user is authenticated
 *  - user: UserDTO object containing user data if logged in, null otherwise
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
  user: UserDTO | null;
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

    return {
      isLoggedIn: true,
      user: {
        ...user,
        name: userAccount.name,
        id: userAccount.$id,
        email: userAccount.email,
      },
    };
  } catch (error) {
    console.error("Failed to check authentication", error);
    return { isLoggedIn: false, user: null };
  }
};

/**
 * Authenticates a user with email and password using Appwrite authentication.
 * Creates a session for the authenticated user and saves it.
 *
 * @param email - The user's email address
 * @param password - The user's password
 * @returns A promise that resolves to an object containing either:
 *          - data: The authenticated user's ID if successful
 *          - error: An AppwriteException or generic error message if authentication fails
 *
 */
export const loginUser = async (email: string, password: string) => {
  // create an admin client
  const { account } = await createAdminClient();
  try {
    // login the user with the email and password
    const session = await account.createEmailPasswordSession(email, password);
    // create a new session for the user
    await saveSession(session);
    const { account: clientAccount } = await createUserClient(session.secret);
    const data = await clientAccount.get();
    return {
      data: { id: data.$id, email: data.email, name: data.name },
      error: null,
    };
  } catch (error) {
    console.error("Login failed", error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { error: { response: "An unexpected error occurred" }, data: null };
  }
  // return userId
};

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

/**
 * Registers a new user with the provided email, password, and username.
 * Creates a session for the newly registered user.
 *
 * @param email - The email address for the new user
 * @param password - The password for the new user
 * @param username - The username for the new user
 *
 * @returns A promise that resolves to an object containing either:
 * - `data`: The ID of the created user if registration is successful
 * - `error`: The error object if registration fails
 *   - If it's an AppwriteException, returns the error object
 *   - For other errors, returns an object with a generic error message
 *
 */
export const registerUser = async (
  email: string,
  password: string,
  username: string
) => {
  const { account } = await createAdminClient();
  try {
    const user = await account.create("unique()", email, password, username);
    // create a new session for the user
    const session = await account.createEmailPasswordSession(email, password);
    await saveSession(session);

    return { data: user.$id, error: null };
  } catch (error) {
    console.error("Registration failed", error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { error: { response: "An unexpected error occurred" }, data: null };
  }
};

/**
 * helper function that saves the session to the cookies with some default options
 * @param session - The session object containing user session information
 */
const saveSession = async (session: Models.Session) => {
  const cookiesStore = await cookies();
  cookiesStore.set("appwrite-session", session.secret, {
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(session.expire),
  });
};
