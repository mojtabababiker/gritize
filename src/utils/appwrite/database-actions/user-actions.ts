"use server";
import { ID, AppwriteException } from "node-appwrite";

import { createAdminClient } from "@/config/appwrite";
import { UserDTO } from "@/models/dto/user-dto";
import { Settings } from "@/constant/setting";

import { checkAuth } from "../auth-action";
import { stripAppwriteFields } from "./stripAppwriteFields";

/**
 * Retrieves a user by their ID from the database along with their associated general algorithms and coding patterns.
 *
 * @param userId - The unique identifier of the user to retrieve
 * @returns Promise that resolves to a UserDTO object containing user data and associated collections, or null if user not found or error occurs
 * @throws Error if userId is not provided
 *
 * @remarks
 * This function performs the following operations:
 * 1. Retrieves the basic user document
 * 2. Fetches associated general algorithms
 * 3. Fetches associated coding patterns
 * 4. Combines all data into a single UserDTO object
 *
 * The returned UserDTO includes:
 * - Basic user information
 * - Array of general algorithms (UserProblemSchema[])
 * - Array of coding patterns (CodingPatternSchema[])
 *
 * All database entities are cleaned of internal properties ($id, $collectionId, etc.) before being returned.
 */
export const getUserById = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const { databases } = await createAdminClient();

  try {
    // get the user document from the database
    const userDoc = await databases.getDocument(
      Settings.databaseId,
      Settings.usersCollectionId,
      userId
    );
    if (!userDoc) {
      return null;
    }
    const user = stripAppwriteFields<UserDTO>(userDoc);

    return user;
  } catch (error) {
    // console.error("Error getting user by ID", error);
    return null;
  }
};

/**
 * Creates a new user document in the database
 *
 * @param userObj - User data transfer object containing user information
 * @returns Promise resolving to an object with either:
 *  - success: {data: UserDTO, error: null}
 *  - failure: {data: null, error: AppwriteException | {response: string}}
 *
 * @throws {AppwriteException} When Appwrite service throws an error
 *
 * @example
 * ```typescript
 * const result = await createUser({
 *   id: "user123",
 *   name: "John Doe",
 *   email: "john@example.com",
 *   codingPatterns: [...],
 *   generalAlgorithms: [...],
 *   // other user properties
 * });
 * ```
 */
export const createUser = async (userObj: UserDTO) => {
  const { databases } = await createAdminClient();
  const { id: userId, codingPatterns, generalAlgorithms, ...user } = userObj;
  try {
    const userDoc = await databases.createDocument(
      Settings.databaseId,
      Settings.usersCollectionId,
      userId || ID.unique(),
      {
        ...user,
        totalSolvedProblems: 0,
        avatar: user.avatar || null,
        generalAlgorithms,
        codingPatterns,
      }
    );

    const data = stripAppwriteFields<UserDTO>(userDoc);
    return { data, error: null };
  } catch (error) {
    console.error("Error creating user", error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};

export const updateUser = async (userId: string, userObj: Partial<UserDTO>) => {
  const { ...cleanUserObject } = userObj;
  delete cleanUserObject.id;
  delete cleanUserObject.email;
  delete cleanUserObject.name;
  const { user } = await checkAuth();
  if (!user || user.id !== userId) {
    return {
      error: { response: "Authorized operation" },
      data: null,
    };
  }
  try {
    const { databases } = await createAdminClient();
    const userDoc = await databases.updateDocument(
      Settings.databaseId,
      Settings.usersCollectionId,
      userId,
      {
        ...cleanUserObject,
      }
    );
    // const {
    //   $id: id,
    //   $collectionId,
    //   $databaseId,
    //   $createdAt,
    //   $updatedAt,
    //   $permissions,
    //   ...rest
    // } = userDoc;
    const data = stripAppwriteFields<UserDTO>(userDoc);
    return { data, error: null };
  } catch (error) {
    console.error("Error updating user", error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};
