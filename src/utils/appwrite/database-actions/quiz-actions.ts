"use server";
import { Models, AppwriteException, ID, Query } from "node-appwrite";
import { createAdminClient } from "@/config/appwrite";

import { Settings } from "@/constant/setting";
import { Question, Quiz } from "@/utils/quiz-actions";
import { UserQuizDTO } from "@/models/dto/user-dto";
import { stripAppwriteFields } from "./stripAppwriteFields";

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
    // console.log("Quiz created", quizDoc.$id);
    return { data: quizDoc, error: null };
  } catch (error) {
    // console.error("Error saving quiz", error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};

/**
 * Saves a user quiz to the database.
 * @param quiz - The user quiz object to be saved
 * @returns {Promise<{ error: string | null; data: string | null }>} Object with `data` containing the created document ID on success (null on error), and `error` containing error message on failure (null on success)
 * @throws {AppwriteException} When database operations fail
 *
 * @example
 * ```typescript
 * const result = await saveUserQuiz({
 *  userId: "user123",
 *  id: "userQuiz123",
 *  questions: [...],
 *  // other quiz properties
 * });
 * ```
 */
export const saveUserQuiz = async (
  quiz: UserQuizDTO
): Promise<{ error: string | null; data: string | null }> => {
  if (!quiz.userId) {
    return { error: "User ID is required", data: null };
  }
  if (!quiz) {
    return { error: "Quiz is required", data: null };
  }
  const { id: quizId, questions, ...quizData } = quiz;
  delete quizData.$createdAt; // Remove Appwrite specific $createdAt if it exists
  const questionsData = questions.map((q) => JSON.stringify(q));

  const { databases } = await createAdminClient();
  try {
    const quizDoc = await databases.createDocument(
      Settings.databaseId,
      Settings.userQuizzesCollectionId,
      quizId || ID.unique(),
      {
        ...quizData,
        questions: questionsData,
      }
    );
    // console.log("User quiz created", quizDoc.$id);
    return { data: quizDoc.$id, error: null };
  } catch (error) {
    console.error("Error saving user quiz", error);
    if (error instanceof AppwriteException) {
      return { error: error.response, data: null };
    }
    return { data: null, error: "An unexpected error occurred" };
  }
};

/**
 * Retrieves all quizzes associated with a specific user from the database.
 *
 * @param userId - The unique identifier of the user whose quizzes to retrieve
 * @returns A promise that resolves to an object containing either the quiz data or an error message
 * @returns {Promise<{data: UserQuizDTO[] | null, error: string | null}>} Object with `data` containing array of user quizzes on success (null on error), and `error` containing error message on failure (null on success)
 *
 * @throws {AppwriteException} When database operations fail
 *
 * @example
 * ```typescript
 * const result = await listUserQuizzes("user123");
 * if (result.error) {
 *   console.error("Failed to fetch quizzes:", result.error);
 * } else {
 *   console.log("User quizzes:", result.data);
 * }
 * ```
 */
export const listUserQuizzes = async (
  userId: string
): Promise<{
  data: UserQuizDTO[] | null;
  error: string | null;
}> => {
  if (!userId) {
    return { data: null, error: "User ID is required" };
  }
  const { databases } = await createAdminClient();
  try {
    const quizzes = await databases.listDocuments(
      Settings.databaseId,
      Settings.userQuizzesCollectionId,
      [
        Query.equal("userId", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(12),
      ]
    );
    const quizData = quizzes.documents.map((doc) => {
      const data = stripAppwriteFields<UserQuizDTO>(doc);
      return {
        ...data,
        questions: doc.questions.map((q: string) =>
          JSON.parse(q)
        ) as Question[],
        $createdAt: doc.$createdAt,
      };
    });
    return { data: quizData, error: null };
  } catch (error) {
    console.error("Error listing user quizzes", error);
    if (error instanceof AppwriteException) {
      return { data: null, error: error.response };
    }
    return { data: null, error: "An unexpected error occurred" };
  }
};
