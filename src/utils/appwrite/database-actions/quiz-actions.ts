"use server";
import { Models, AppwriteException, ID } from "node-appwrite";
import { createAdminClient } from "@/config/appwrite";

import { Settings } from "@/constant/setting";
import { Quiz } from "@/utils/quiz-actions";

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
