"use server";
import { ID, AppwriteException, Query, Models } from "node-appwrite";

import { createAdminClient } from "@/config/appwrite";
import { TechnicalProblemSchema } from "@/models/schemas";
import { Settings } from "@/constant/setting";
import { stripAppwriteFields } from "./stripAppwriteFields";

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
      id || ID.unique(),
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
    // const {
    //   $id: id,
    //   $collectionId,
    //   $databaseId,
    //   $createdAt,
    //   $updatedAt,
    //   $permissions,
    //   ...rest
    // } = problemDoc;
    const cleanProblemObj =
      stripAppwriteFields<TechnicalProblemSchema>(problemDoc);
    return cleanProblemObj;
  } catch (error) {
    console.error(`Error getting problem by ID : ${problemId}\n`, error);
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
    // const {
    //   $id: id,
    //   $collectionId,
    //   $databaseId,
    //   $createdAt,
    //   $updatedAt,
    //   $permissions,
    //   ...rest
    // } = problem;
    const cleanProblemObj =
      stripAppwriteFields<TechnicalProblemSchema>(problem);
    return cleanProblemObj;
  } catch (error) {
    console.error("Error getting problem by slug", error);
    return null;
  }
};

/**
 * Retrieves a list of technical problems from the database.
 *
 * @param page - The page number for pagination (default: 1)
 * @param limit - The number of problems to retrieve per page (default: 10)
 * @param featured - Whether to filter for featured problems (default: false)
 * @returns Promise that resolves to an object containing:
 *          - data: Array of TechnicalProblemSchema objects
 *          - total: Total number of problems available
 *          - hasMore: Boolean indicating if more problems are available
 */
export const listProblems = async (
  cursorId: string = "",
  page: number = 1,
  limit: number = 10,
  prev: boolean = false
): Promise<
  | {
      data: TechnicalProblemSchema[];
      total: number;
      hasMore: boolean;
      error: null;
    }
  | {
      error: AppwriteException | { response: string };
      data: null;
      total: null;
      hasMore: null;
    }
> => {
  const { databases } = await createAdminClient();
  let problemsDoc: Models.DocumentList<Models.Document>;

  console.log("Listing problems with cursorId:", cursorId);
  console.log("Listing problems with limit:", limit);

  try {
    if (prev) {
      const query =
        cursorId.length > 0
          ? [Query.cursorBefore(cursorId), Query.limit(limit)]
          : [Query.limit(limit)];

      problemsDoc = await databases.listDocuments(
        Settings.databaseId,
        Settings.problemsCollectionId,
        query
      );
    } else {
      const query =
        cursorId.length > 0
          ? [Query.cursorAfter(cursorId), Query.limit(limit)]
          : [Query.limit(limit)];

      problemsDoc = await databases.listDocuments(
        Settings.databaseId,
        Settings.problemsCollectionId,
        query
      );
    }
    const { documents, total } = problemsDoc;
    const problems: TechnicalProblemSchema[] = documents.map((problem) => ({
      id: problem.$id,
      type: problem.type,
      title: problem.title,
      description: problem.description,
      slug: problem.slug,
      difficulty: problem.difficulty,
    }));
    console.log(`Fetch ${problems.length} problems of ${total} total`);
    const hasMore = page * limit < total;
    return {
      data: problems,
      total,
      hasMore,
      error: null,
    };
  } catch (error) {
    console.error("Error listing problems", error);
    if (error instanceof AppwriteException) {
      return { error, data: null, total: null, hasMore: null };
    }
    return {
      error: { response: "An unexpected error occurred" },
      data: null,
      total: null,
      hasMore: null,
    };
  }
};
