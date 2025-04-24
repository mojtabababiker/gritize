"use server";
import { createAdminClient } from "@/config/appwrite";
import { Settings } from "@/constant/setting";
import { UserSchema } from "@/models/schemas";
import { cookies } from "next/headers";

export const getUserById = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const { databases } = await createAdminClient();

  try {
    // get the user document from the database
    const user = await databases.getDocument(
      Settings.databaseId,
      Settings.usersCollectionId,
      userId
    );
    if (!user) {
      return null;
    }

    // remove the unwanted properties from the user object
    const {
      $id: id,
      $collectionId,
      $databaseId,
      $createdAt,
      $updatedAt,
      $permissions,
      ...rest
    } = user;
    // return the result as UserSchema object
    return {
      id,
      ...rest,
    } as UserSchema;
  } catch (error) {
    console.error("Error getting user by ID", error);
    return null;
  }
};
