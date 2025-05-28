"use server";
import { OAuthProvider } from "node-appwrite";
import { oauthSignIn } from "@/utils/appwrite/auth-action";

/**
 * Initiates the Google OAuth sign-in process.
 *
 * This function handles the authentication flow using Google as the OAuth provider.
 * It internally uses the oauthSignIn function with Google as the specified provider.
 *
 * @throws {Error} If the Google sign-in process fails
 */
export const signinWithGoogle = async () => {
  // console.log("Signing with google");
  return await oauthSignIn(OAuthProvider.Google);
};

/**
 * Initiates the GitHub OAuth sign-in process.
 *
 * This function handles the authentication flow using GitHub as the OAuth provider.
 * It internally uses the `oauthSignIn` function with the GitHub provider.
 *
 * @throws {Error} If the GitHub authentication process fails
 */
export const signinWithGithub = async () => {
  // console.log("Signing with github");
  return await oauthSignIn(OAuthProvider.Github);
};
