import { NextResponse } from "next/server";

import { createAdminClient, createUserClient } from "@/config/appwrite";

import { UserDTO } from "@/models/dto/user-dto";

import { createUser, getUserById } from "@/utils/appwrite/database-actions";

/**
 * Handles OAuth authentication GET requests.
 *
 * @param request - The incoming HTTP request containing userId and secret as URL parameters
 * @returns A Response object that either:
 *  - Redirects to complete-signup page for new users
 *  - Redirects to dashboard for existing users
 *  - Redirects to auth page with error message if authentication fails
 *  - Returns 400 status if required parameters are missing
 *
 * @throws Will redirect to auth page with error if session creation or user creation fails
 *
 * The function:
 * 1. Validates required URL parameters (userId, secret)
 * 2. Creates an admin session
 * 3. Checks if user exists in database
 * 4. For new users: creates user account and saves to database
 * 5. For existing users: redirects to dashboard
 * 6. Handles errors by redirecting to auth page
 */
export const GET = async (request: Request) => {
  const searchParams = new URLSearchParams(request.url);
  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  if (!userId || !secret) {
    const missingParams = `${!userId ? "userId, " : ""}${
      !secret ? "secret, " : ""
    }`;
    return new Response(`Missing required parameters: ${missingParams}`, {
      status: 400,
    });
  }

  const { account } = await createAdminClient();
  let redirectUrl = "/auth/oauth/complete-signup";

  try {
    const session = await account.createSession(userId, secret);
    // await saveSession(session);

    const userFromDB = await getUserById(userId);
    if (!userFromDB) {
      const { account } = await createUserClient(session.secret);
      const userAccount = await account.get();
      const user: UserDTO = {
        id: userAccount.$id,
        name: userAccount.name,
        email: userAccount.email,
        skillLevel: null,
        generalAlgorithms: [],
        codingPatterns: [],
        quizzes: [],
        onboarding: false,
      };
      const { error, data } = await createUser(user);

      if (error || !data) {
        console.error("Failed to create user in database", error.response);
        console.error("User ID: ", userId);

        return NextResponse.redirect(
          new URL("/auth?msg=failed-to-create-user", request.url)
        );
      } else {
        redirectUrl = "/auth/oauth/complete-signup";
      }
    } else {
      redirectUrl = "/dashboard";
    }

    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    // Save the session cookie
    response.cookies.set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(session.expire),
    });

    return response;
  } catch (error) {
    console.error("OAuth sign-in failed", error);
    console.error("User ID: ", userId);
    // redirectUrl = `/auth?msg=oauth-field`;
    return NextResponse.redirect(new URL("/auth?msg=oauth-field", request.url));
  }
};
