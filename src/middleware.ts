import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { Models } from "node-appwrite";

import { createUserClient } from "@/config/appwrite";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get("appwrite-session");
  if (!session || !session.value) {
    console.log("\n\nNo session found in: ", request.url);
    return NextResponse.redirect(
      new URL("/auth?msg=need+to+login+first", request.url)
    );
  }
  let userAccount: Models.User<Models.Preferences>;
  try {
    const { account } = await createUserClient(session?.value);
    userAccount = await account.get();
  } catch {
    return NextResponse.redirect(
      new URL("/auth?msg=need+to+login+first", request.url)
    );
  }

  if (!userAccount) {
    return NextResponse.redirect(
      new URL("/auth?msg=need+to+login+first", request.url)
    );
  }
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard",
    "/playground",
    "/api/get-problems",
    "/api/generate_program",
    "/api/get-code-review",
    "/api/get-problem-hint",
    "/api/submit-code",
  ],
};
