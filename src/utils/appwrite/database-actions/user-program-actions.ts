"use server";
import { ID, AppwriteException, Query } from "node-appwrite";

import { createAdminClient } from "@/config/appwrite";
import { UserProblemSchema, CodingPatternSchema } from "@/models/schemas";
import { CodingPatternDTO, ProblemSolutionDTO } from "@/models/dto/user-dto";
import { Settings } from "@/constant/setting";
import { checkAuth } from "@/utils/appwrite/auth-action";
import { getProblemById } from "./tech-problems-action";
import { Languages } from "@/models/types/indext";
import { stripAppwriteFields } from "./stripAppwriteFields";

/**
 * Creates a new user problem record in the database, if the problem does not already exist.
 * If the problem already exists, it returns the existing record instead of creating a new one and prints a warning.
 * @param userId - The unique identifier of the user, can be null if creating coding pattern problem
 * @param problemId - The unique identifier of the problem
 * @returns Promise resolving to an object containing either:
 *  - data: UserProblemSchema object with the created problem details
 *  - error: Error object if creation fails
 *
 * @throws AppwriteException - If there's an error interacting with Appwrite
 *
 * @example
 * const result = await createUserProblem('user123', 'problem456');
 * if (result.error) {
 *   console.error(result.error);
 * } else {
 *   console.log(result.data);
 * }
 */
export const createUserProblem = async (
  userId: string | null,
  problemId: string
) => {
  const userProblemId = ID.unique();
  try {
    const problem = await getProblemById(problemId);
    if (!problem) {
      console.error(`Problem with ID ${problemId} not found`);
      return {
        error: { response: `Problem ${problemId} not found` },
        data: null,
      };
    }

    const { databases } = await createAdminClient();

    // try to retrieve a user problem with the same id
    if (userId) {
      const existingUserProblem = await databases.listDocuments(
        Settings.databaseId,
        Settings.userProblemsCollectionId,
        [Query.equal("problemId", problemId), Query.equal("userId", userId)]
      );

      if (existingUserProblem.documents?.length) {
        console.warn("User problem already exists");
        console.warn(
          `Attempt to create problem already exists for user ${userId} and problem ${problemId}`
        );
        const existingProblem = existingUserProblem.documents[0];
        const result = stripAppwriteFields<UserProblemSchema>(existingProblem);
        return { data: { ...result, problem }, error: null };
      }
    }
    const resultDoc = await databases.createDocument(
      Settings.databaseId,
      Settings.userProblemsCollectionId,
      userProblemId,
      {
        userId,
        problemId,
        solved: false,
        score: 0,
      }
    );

    // Then in place of the $SELECTION_PLACEHOLDER$, use:
    const result = stripAppwriteFields<UserProblemSchema>(resultDoc);
    // const result = { id, problem, ...rest } as UserProblemSchema;
    return { data: { ...result, problem }, error: null };
  } catch (error) {
    console.error(
      `\nError creating user Problem: ${userProblemId}\nWith Problem: ${problemId}\nFor user ${userId}\n`
    );
    // console.log("Error creating user problem", error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};

/**
 * Retrieves a user's problem by its ID from the database.
 *
 * @param userProblemId - The unique identifier of the user problem to retrieve
 * @returns Promise that resolves to a UserProblemSchema object if found, null otherwise
 *
 * @remarks
 * - Requires valid userProblemId
 * - Fetches related problem details using getProblemById
 * - Strips internal database fields from the response
 *
 * @example
 * ```typescript
 * const userProblem = await getUserProblemById("123");
 * if (userProblem) {
 *   console.log(userProblem.id, userProblem.problem);
 * }
 * ```
 */
export const getUserProblemById = async (userProblemId: string) => {
  if (!userProblemId) {
    // console.error("User problem ID is required");
    return null;
  }

  try {
    const { databases } = await createAdminClient();

    const userProblemDoc = await databases.getDocument(
      Settings.databaseId,
      Settings.userProblemsCollectionId,
      userProblemId
    );

    if (!userProblemDoc) {
      // console.error("User problem not found");
      return null;
    }
    const result = stripAppwriteFields<UserProblemSchema>(userProblemDoc);
    const problem = await getProblemById(userProblemDoc.problemId);
    return { ...result, problem };
  } catch (error) {
    console.error(
      `Error getting user problem by ID: ${userProblemId}\n`,
      error
    );
    return null;
  }
};

/**
 * Retrieves a list of user problems based on their IDs.
 *
 * @param userProblemIds - An array of string IDs representing user problems to fetch
 * @returns A Promise that resolves to an array of UserProblemSchema objects
 *
 * @remarks
 * - If the input array is empty or null, returns an empty array
 * - Filters out any null results from the fetched problems
 * - If an error occurs during fetching, logs the error and returns an empty array
 */
export const listUserProblemsById = async (
  userProblemIds: string[]
): Promise<UserProblemSchema[]> => {
  if (!userProblemIds || userProblemIds.length === 0) {
    return [];
  }
  try {
    const userProblems = await Promise.all(
      userProblemIds.map(async (id) => {
        const userProblem = await getUserProblemById(id);
        return userProblem;
      })
    );
    return userProblems.filter(
      (problem) => problem !== null
    ) as UserProblemSchema[];
  } catch (error) {
    console.error("Error listing user problems by ID", error);
    return [];
  }
};

/**
 * Deletes one or multiple user problems from the database.
 *
 * @param userProblemIds - Single user problem ID as string or array of user problem IDs to delete
 * @returns Promise resolving to an object containing either error or data
 *                    - If error occurs, returns {error: AppwriteException | {response: string}, data: null}
 *                    - If successful, returns undefined
 */
export const deleteUserProblems = async (userProblemIds: string[] | string) => {
  if (!userProblemIds || userProblemIds.length === 0) {
    return {
      error: { response: "User problem IDs are required" },
      data: null,
    };
  }
  try {
    const { databases } = await createAdminClient();
    if (typeof userProblemIds === "string") {
      userProblemIds = [userProblemIds];
    }
    await Promise.all(
      userProblemIds.map(async (problemId) => {
        await databases.deleteDocument(
          Settings.databaseId,
          Settings.userProblemsCollectionId,
          problemId
        );
      })
    );
  } catch (error) {
    console.error("Error deleting user problems", error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};

/**
 * Updates a user's problem document in the database
 *
 * @param userId - The ID of the user
 * @param problemId - The ID of the problem document to update
 * @param data - The data to update, excluding 'problem' and 'id' fields
 *
 * @returns A promise that resolves to an object containing either:
 *  - `{ data: UserProblemSchema, error: null }` on success
 *  - `{ data: null, error: AppwriteException }` on Appwrite error
 *  - `{ data: null, error: { response: string } }` on unexpected error
 *
 * @throws AppwriteException if there's an error communicating with Appwrite
 */
export const updateUserProblem = async (
  userId: string,
  problemId: string,
  data: Omit<UserProblemSchema, "problem" | "id">
) => {
  try {
    const { databases } = await createAdminClient();
    const resultDoc = await databases.updateDocument(
      Settings.databaseId,
      Settings.userProblemsCollectionId,
      problemId,
      {
        ...data,
      }
    );
    const result = stripAppwriteFields<UserProblemSchema>(resultDoc);
    return { data: result, error: null };
  } catch (error) {
    console.error(
      `Error updating user problem with ID: ${problemId} for user ${userId}`,
      error
    );
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};

/**
 * Creates a new coding technique with associated problems for a user.
 * 
 * @param userId - The ID of the user creating the coding technique
 * @param codingPatternObj - The coding pattern data transfer object containing technique details and problems
 * 
 * @returns Promise resolving to an object containing either:
 * - data: The created coding pattern with associated problems
 * - error: Error information if creation fails

 * 
 * @remarks
 * - Verifies user authentication and authorization
 * - Creates individual problems for the coding technique
 * - Rolls back problem creation if technique creation fails
 * - Links created problems with the coding technique
 * 
 * @example
 * ```typescript
 * const result = await createCodingTechnique(userId, {
 *   title: "Pattern Title",
 *   problems: [...problemsList]
 * });
 * if (result.error) {
 *   console.error(result.error);
 * }
 * ```
 */
export const createCodingTechnique = async (
  userId: string,
  codingPatternObj: CodingPatternDTO
) => {
  const { user } = await checkAuth();
  if (!user || !user.id) {
    return {
      error: { response: "User is not logged in" },
      data: null,
    };
  }

  if (userId !== user.id) {
    return {
      error: { response: "Unauthorized operation" },
      data: null,
    };
  }
  const problems: UserProblemSchema[] = []; // Store the IDs of created coding pattern's problems
  try {
    const { databases } = await createAdminClient();
    const { problems: codingProblems, ...codingPattern } = codingPatternObj;

    for (const problem of codingProblems) {
      const { data: userProblem, error } = await createUserProblem(
        null,
        problem
      );
      if (error || !userProblem?.id) {
        console.error(
          `Failed to create user problem for coding pattern: ${problem}`
        );
        console.error(error);
        continue;
      }
      // console.log("User problem created for coding pattern", userProblem.id);
      problems.push(userProblem);
    }
    const resultDoc = await databases.createDocument(
      Settings.databaseId,
      Settings.codingTechniquesCollectionId,
      ID.unique(),
      {
        ...codingPattern,
        userId,
        problems: problems.map((problem) => problem.id),
      }
    );

    const updatedDoc = await getCodingPatternById(resultDoc.$id);
    if (!updatedDoc) {
      throw new Error("Failed to fetch updated coding pattern");
    }
    // console.log("Coding pattern created", updatedDoc.id);
    return { data: { ...updatedDoc, problems }, error: null };
  } catch (error) {
    console.error(`Error creating user Technique, user ID: ${userId}`, error);
    // revert the user problems created

    // console.log("Reverting user problems creation...");
    await deleteUserProblems(problems.map((problem) => problem.id));

    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};

/**
 * Retrieves a coding pattern by its ID from the database.
 *
 * @param codingPatternId - The unique identifier of the coding pattern to retrieve
 * @returns Promise that resolves to a CodingPatternSchema object if found, null otherwise
 *
 * @throws Will not throw errors directly, but logs errors and returns null on failure
 *
 * @remarks
 * - Returns null if codingPatternId is empty/undefined
 * - Returns null if pattern is not found in database
 * - Returns null if any error occurs during database operation
 * - Strips internal Appwrite properties from returned object
 */
export const getCodingPatternById = async (codingPatternId: string) => {
  if (!codingPatternId) {
    // console.error("Coding pattern ID is required");
    return null;
  }

  try {
    const { databases } = await createAdminClient();

    const codPDoc = await databases.getDocument(
      Settings.databaseId,
      Settings.codingTechniquesCollectionId,
      codingPatternId
    );

    if (!codPDoc) {
      // console.error("Coding pattern not found");
      return null;
    }
    const result = stripAppwriteFields<CodingPatternSchema>(codPDoc);
    const problems = await listUserProblemsById(codPDoc.problems);
    return { ...result, problems };
  } catch {
    // console.error("Error getting coding pattern by ID", error);
    console.error(
      `Coding Pattern ID: ${codingPatternId} not found or error occurred`
    );
    return null;
  }
};

/**
 * Retrieves multiple coding patterns by their IDs.
 *
 * @param codingPatternIds - An array of coding pattern IDs to fetch
 * @returns A promise that resolves to an array of CodingPatternSchema objects
 *
 * @remarks
 * - Returns an empty array if the input array is null, empty, or if an error occurs
 * - Filters out any null results from the pattern lookups
 *
 * @throws Catches and logs any errors during pattern retrieval, returning empty array
 */
export const listCodingPatternsById = async (
  codingPatternIds: string[]
): Promise<CodingPatternSchema[]> => {
  if (!codingPatternIds || codingPatternIds.length === 0) {
    return [];
  }
  try {
    const codingPatterns = await Promise.all(
      codingPatternIds.map(async (id) => {
        const codingPattern = await getCodingPatternById(id);
        return codingPattern;
      })
    );
    return codingPatterns.filter(
      (pattern) => pattern !== null
    ) as CodingPatternSchema[];
  } catch (error) {
    console.error("Error listing coding patterns by ID", error);
    return [];
  }
};

/**
 * Updates a coding pattern document in the database with the provided data.
 *
 * @param patternId - The unique identifier of the coding pattern to update
 * @param data - Partial data to update the coding pattern, excluding id, problem and totalProblems fields
 * @returns A promise that resolves to an object containing either:
 *          - {error: null, data: CodingPatternDTO} on success
 *          - {error: AppwriteException, data: null} on Appwrite error
 *          - {error: {response: string}, data: null} on unexpected error
 *          - {error: string} if patternId is missing
 * @throws Never throws, handles all errors internally
 */
export const updateCodingPattern = async (
  patternId: string,
  data: Partial<Omit<CodingPatternSchema, "id" | "problem" | "totalProblems">>
) => {
  if (!patternId) {
    // console.error("Coding Pattern ID is Missing");
    return { error: "Coding Pattern ID is Missing" };
  }
  try {
    const { databases } = await createAdminClient();
    const updatedDoc = await databases.updateDocument(
      Settings.databaseId,
      Settings.codingTechniquesCollectionId,
      patternId,
      {
        ...data,
      }
    );
    // const {
    //   $collectionId,
    //   $createdAt,
    //   $updatedAt,
    //   $databaseId,
    //   $id,
    //   $permissions,
    //   ...rest
    // } = updatedDoc;
    const result = stripAppwriteFields<CodingPatternDTO>(updatedDoc);
    return { error: null, data: { ...result } };
  } catch (error) {
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return {
      data: null,
      error: { response: "An unexpected error occurred" },
    };
  }
};

/**
 * Creates a new problem solution in the database
 *
 * @param data - The problem solution data to be created (excluding the id field)
 * @returns Promise containing either:
 *          - `{ data: ProblemSolutionDTO, error: null }` on success
 *          - `{ data: null, error: AppwriteException | { response: string } }` on failure
 *
 * @throws Will handle and return AppwriteException if Appwrite operation fails
 *
 * @remarks
 * - Requires user authentication
 * - Validates that the logged-in user matches the userId in the solution data
 * - Strips internal Appwrite fields from the response before returning
 */
export const createProblemSolution = async (
  data: Omit<ProblemSolutionDTO, "id">
) => {
  const { user } = await checkAuth();
  if (!user || !user.id) {
    return {
      error: { response: "User is not logged in" },
      data: null,
    };
  }

  if (user.id !== data.userId) {
    return {
      error: { response: "Unauthorized operation" },
      data: null,
    };
  }
  try {
    const { databases } = await createAdminClient();
    const resultDoc = await databases.createDocument(
      Settings.databaseId,
      Settings.problemSolutionsCollectionId,
      ID.unique(),
      {
        ...data,
      }
    );

    const result = stripAppwriteFields<ProblemSolutionDTO>(resultDoc);
    // const result = { id, ...rest } as ProblemSolutionDTO;
    return { data: result, error: null };
  } catch (error) {
    console.error("Error creating problem solution", error);
    console.error(
      `Problem ID: ${data.problemId}, Language: ${data.language}, User ID: ${data.userId}`
    );
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};

/**
 * Retrieves a solution for a specific problem in a given programming language.
 *
 * @param userId - The ID of the user requesting the solution
 * @param problemId - The unique identifier of the problem to fetch the solution for
 * @param language - The programming language of the solution
 *
 * @returns A promise that resolves to either:
 * - A {@link ProblemSolutionDTO} object containing the solution details
 * - null if:
 *   - The problem ID is not provided
 *   - No solution is found for the given problem and language
 *   - An error occurs during the database operation
 *
 * @throws Does not throw errors (catches and returns null instead)
 */
export const getProblemSolution = async (
  userId: string,
  problemId: string,
  language: Languages
) => {
  if (!problemId) {
    // console.error("Problem ID is required");
    return null;
  }
  try {
    const { databases } = await createAdminClient();

    const problemSolutionDoc = await databases.listDocuments(
      Settings.databaseId,
      Settings.problemSolutionsCollectionId,
      [
        Query.equal("userId", userId),
        Query.equal("problemId", problemId),
        Query.equal("language", language),
        Query.orderDesc("$createdAt"),
      ]
    );

    if (!problemSolutionDoc || problemSolutionDoc.documents.length === 0) {
      // console.error("Problem solution not found");
      console.error(
        `No solution found for problem ID: ${problemId}, language: ${language}, user ID: ${userId}`
      );
      return null;
    }
    const result = stripAppwriteFields<ProblemSolutionDTO>(
      problemSolutionDoc.documents[0]
    );
    return { ...result };
  } catch (error) {
    console.error("Error getting problem solution by ID", error);
    console.error(
      `problem ID: ${problemId}, language: ${language}, user ID: ${userId}`
    );
    return null;
  }
};

/**
 * Retrieves a list of solutions for a specific problem from the database.
 *
 * @param userId - The ID of the user requesting the solutions
 * @param problemId - The unique identifier of the problem to get solutions for
 * @returns Promise that resolves to an array of ProblemSolutionDTO objects or null if:
 * - problemId is not provided
 * - no solutions are found
 * - an error occurs during the database operation
 *
 * @throws Will not throw errors, returns null instead and logs error to console
 *
 * @remarks
 * The returned solutions are:
 * - Ordered by creation date in descending order (most recent first)
 * - Transformed to remove internal database fields ($id, $collectionId, etc)
 * - Mapped to ProblemSolutionDTO format
 */
export const listProblemSolutions = async (
  userId: string,
  problemId: string
): Promise<ProblemSolutionDTO[] | null> => {
  if (!problemId) {
    // console.error("Problem ID is required");
    return null;
  }
  try {
    const { databases } = await createAdminClient();

    const problemSolutionDoc = await databases.listDocuments(
      Settings.databaseId,
      Settings.problemSolutionsCollectionId,
      [
        Query.equal("userId", userId),
        Query.equal("problemId", problemId),
        Query.orderDesc("$createdAt"),
      ]
    );

    if (!problemSolutionDoc || problemSolutionDoc.documents.length === 0) {
      // console.error("Problem solutions not found");
      console.error(
        `No solutions found for problem ID: ${problemId}, user ID: ${userId}`
      );
      return null;
    }
    const docs = problemSolutionDoc.documents;

    return docs.map((doc) => {
      const result = stripAppwriteFields<ProblemSolutionDTO>(doc);
      return { ...result, $createdAt: doc.$createdAt };
    });
  } catch (error) {
    console.error("Error getting problem solutions", error);
    console.error(`Problem ID: ${problemId}, User ID: ${userId}`);
    return null;
  }
};
