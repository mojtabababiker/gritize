"use server";
import { AppwriteException, ID, Models, Query } from "node-appwrite";
import { createAdminClient } from "@/config/appwrite";

import {
  CodingPatternSchema,
  TechnicalProblemSchema,
  UserProblemSchema,
} from "@/models/schemas";
import { CodingPatternDTO, UserDTO } from "@/models/dto/user-dto";

import { Settings } from "@/constant/setting";
import { Quiz } from "@/utils/quiz-actions";

import { checkAuth } from "./auth-action";

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

    // remove the unwanted properties from the user object
    const {
      $id: id,
      $collectionId,
      $databaseId,
      $createdAt,
      $updatedAt,
      $permissions,
      codingTechniques,
      generalAlgorithms: userGeneralAlgorithms,
      ...rest
    } = userDoc;
    const codingPatterns = (codingTechniques as Models.Document[]).map(
      (pattern) => {
        const {
          $id: id,
          $collectionId,
          $databaseId,
          $createdAt,
          $updatedAt,
          $permissions,
          user: userRelation,
          ...rest
        } = pattern;
        return {
          id,
          ...rest,
        } as CodingPatternSchema;
      }
    );
    const generalAlgorithms = (userGeneralAlgorithms as Models.Document[]).map(
      (problem) => {
        const {
          $id: id,
          $collectionId,
          $databaseId,
          $createdAt,
          $updatedAt,
          $permissions,
          user: userRelation,
          ...rest
        } = problem;
        return {
          id,
          ...rest,
        } as UserProblemSchema;
      }
    );
    const user = {
      id,
      ...rest,
      codingPatterns,
      generalAlgorithms,
    } as unknown as UserDTO;

    // this never happens, only for typescript eslinting
    if (!user.id) {
      return null;
    }
    // console.log("User from DB: ", JSON.stringify(user, null, 2));

    return user as UserDTO;
  } catch (error) {
    console.error("Error getting user by ID", error);
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
  const {
    id: userId,
    name,
    email,
    codingPatterns,
    generalAlgorithms,
    ...user
  } = userObj;
  try {
    const userDoc = await databases.createDocument(
      Settings.databaseId,
      Settings.usersCollectionId,
      userId || ID.unique(),
      {
        ...user,
        totalSolvedProblems: 0,
        avatar: user.avatar || null,
        generalAlgorithms: generalAlgorithms.map((algorithm) => ({
          ...algorithm,
          problem: [algorithm.problem],
        })),

        codingTechniques: codingPatterns.map((pattern) => ({
          ...pattern,
          problems: pattern.problems.map((problem) => ({
            ...problem,
            problem: [problem.problem],
          })),
        })),
      }
    );
    const {
      $id: id,
      $collectionId,
      $databaseId,
      $createdAt,
      $updatedAt,
      $permissions,
      ...rest
    } = userDoc;
    const data = { id, ...rest } as UserDTO;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating user", error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};

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

export const createUserProblem = async (
  userId: string | null,
  problemId: string
) => {
  const userProblemId = ID.unique();
  try {
    const { databases } = await createAdminClient();

    const resultDoc = await databases.createDocument(
      Settings.databaseId,
      Settings.userProblemsCollectionId,
      // ID.unique(),
      userProblemId,
      {
        user: userId,
        problem: problemId,
        solved: false,
        score: 0,
      }
    );

    const {
      $id: id,
      $collectionId,
      $databaseId,
      $createdAt,
      $updatedAt,
      $permissions,
      ...rest
    } = resultDoc;
    const result = { id, ...rest } as UserProblemSchema;
    return { data: result, error: null };
  } catch (error) {
    console.log(
      `\nError creating user Problem: ${userProblemId}\nWith Problem: ${problemId}\nFor user ${userId}\n`
    );
    // console.log("Error creating user problem", error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};

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
  try {
    const { databases } = await createAdminClient();
    const { problems: codingProblems, ...codingPattern } = codingPatternObj;
    const resultDoc = await databases.createDocument(
      Settings.databaseId,
      Settings.codingTechniquesCollectionId,
      ID.unique(),
      {
        ...codingPattern,
        user: userId,
      }
    );

    // Initialize user problems for the coding pattern
    // We create these after the coding pattern to maintain referential integrity
    // This ensures we don't have orphaned user problems if pattern creation fails
    const problems: string[] = [];
    for (const problem of codingProblems) {
      const { data: userProblem, error } = await createUserProblem(
        null,
        problem
      );
      if (error || !userProblem || !userProblem.id) {
        console.error("Error creating user problem", error);
        continue;
      }
      console.log("User problem created", userProblem.id);
      problems.push(userProblem.id);
    }

    // Update the coding pattern with the created user problems
    console.log(`Updating coding pattern with ${problems.length} problems`);
    await databases.updateDocument(
      Settings.databaseId,
      Settings.codingTechniquesCollectionId,
      resultDoc.$id,
      {
        problems,
      }
    );
    // Fetch the updated document
    const updatedDoc = await databases.getDocument(
      Settings.databaseId,
      Settings.codingTechniquesCollectionId,
      resultDoc.$id
    );

    // remove the unwanted properties from the result object
    const {
      $id: id,
      $collectionId,
      $databaseId,
      $createdAt,
      $updatedAt,
      $permissions,
      user,
      ...rest
    } = updatedDoc;
    const result = { id, ...rest } as CodingPatternSchema;
    console.log("Coding pattern created", result.id);
    return { data: result, error: null };
  } catch (error) {
    console.log("\nError creating user Technique\n", error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};

/**
 * Saves a quiz to the database.
 *
 * @param quiz - The quiz object to be saved
 * @returns A promise that resolves to an object containing either:
 *          - `data`: The created document if successful
 *          - `error`: Error object if the operation fails
 *
 * @throws {AppwriteException} When there's an error with the Appwrite service
 *
 * @example
 * ```typescript
 * const result = await saveQuiz({
 *   id: "quiz123",
 *   questionsCount: 5,
 *   language: "en",
 *   questions: []
 * });
 * ```
 */
export const saveQuiz = async (
  quiz: Quiz
): Promise<{
  data: Models.Document | null;
  error: AppwriteException | { response: string } | null;
}> => {
  if (!quiz) {
    return {
      error: { response: "Quiz is not provided" },
      data: null,
    };
  }
  const { databases } = await createAdminClient();
  try {
    const quizDoc = await databases.createDocument(
      Settings.databaseId,
      Settings.quizzesCollectionId,
      quiz.id || ID.unique(),
      {
        questionsCount: quiz.questionsCount,
        language: quiz.language,
        questions: JSON.stringify(quiz.questions),
      }
    );
    console.log("Quiz created", quizDoc.$id);
    return { data: quizDoc, error: null };
  } catch (error) {
    console.error("Error saving quiz", error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};
