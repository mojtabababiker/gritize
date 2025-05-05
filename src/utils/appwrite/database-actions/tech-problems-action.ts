"use server";
import { ID, AppwriteException, Query } from "node-appwrite";

import { createAdminClient } from "@/config/appwrite";
import { TechnicalProblemSchema } from "@/models/schemas";
import { Settings } from "@/constant/setting";

/**
 * Creates a new technical problem document in the database.
 *
 * @param problemObj - The technical problem object conforming to TechnicalProblemSchema
 * @returns Promise containing either:
 *          - {data: string, error: null} with document ID on success
 *          - {data: null, error: AppwriteException} on Appwrite error
 *          - {data: null, error: {response: string}} on unexpected error
 * @throws AppwriteException - When Appwrite operations fail
 */
export const createProblem = async (problemObj: TechnicalProblemSchema) => {
  const { id, ...cleanProblemObj } = problemObj;
  try {
    const { databases } = await createAdminClient();
    const resultDoc = await databases.createDocument(
      Settings.databaseId,
      Settings.problemsCollectionId,
      problemObj.id || ID.unique(),
      {
        ...cleanProblemObj,
      }
    );
    return { data: resultDoc.$id, error: null };
  } catch (error) {
    console.error(error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};

/**
 * Retrieves a technical problem document by its ID from the database.
 *
 * @param problemId - The unique identifier of the technical problem to retrieve
 * @returns Promise that resolves to a TechnicalProblemSchema object if found, null otherwise
 *
 * @remarks
 * This function:
 * - Validates the input problemId
 * - Fetches the document from Appwrite database
 * - Cleans the response by removing system fields ($id, $collectionId, etc.)
 * - Returns null if problemId is empty or if any error occurs during the process
 */
export const getProblemById = async (
  problemId: string
): Promise<TechnicalProblemSchema | null> => {
  if (!problemId) return null;

  try {
    const { databases } = await createAdminClient();
    const problemDoc = await databases.getDocument(
      Settings.databaseId,
      Settings.problemsCollectionId,
      problemId
    );
    const {
      $id: id,
      $collectionId,
      $databaseId,
      $createdAt,
      $updatedAt,
      $permissions,
      ...rest
    } = problemDoc;
    const cleanProblemObj = { id, ...rest } as TechnicalProblemSchema;
    return cleanProblemObj;
  } catch (error) {
    console.error("Error getting problem by ID", error);
    return null;
  }
};

/**
 * Retrieves a technical problem from the database by its slug.
 *
 * @param slug - The unique slug identifier of the technical problem
 * @returns Promise that resolves to either a TechnicalProblemSchema object or null
 *          - Returns null if:
 *            - slug is empty/falsy
 *            - no matching document is found
 *            - an error occurs during database query
 * @throws Does not throw - catches and logs any database errors internally
 */
export const getProblemBySlug = async (
  slug: string
): Promise<TechnicalProblemSchema | null> => {
  if (!slug) return null;
  const { databases } = await createAdminClient();
  try {
    const problemDoc = await databases.listDocuments(
      Settings.databaseId,
      Settings.problemsCollectionId,
      [Query.equal("slug", slug)]
    );
    const { documents } = problemDoc;
    if (documents.length === 0) {
      return null;
    }
    const problem = documents[0];
    const {
      $id: id,
      $collectionId,
      $databaseId,
      $createdAt,
      $updatedAt,
      $permissions,
      ...rest
    } = problem;
    const cleanProblemObj = { id, ...rest } as TechnicalProblemSchema;
    return cleanProblemObj;
  } catch (error) {
    console.error("Error getting problem by slug", error);
    return null;
  }
};
