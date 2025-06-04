import { Databases } from "node-appwrite";

import { Settings } from "../../src/constant/setting";
import { Languages } from "../../src/models/types/indext";
import { Quiz as QuizDTO } from "../../src/models/dto/quiz-dto";

import { QuizCollection } from "../types";
import { createAttribute } from "./utils/createAttributes";

/**
 * Creates a quiz collection in the database with predefined attributes.
 *
 * This function creates a new collection for storing quiz data and sets up
 * all necessary attributes based on the quiz collection schema. If the collection
 * already exists (409 error), it will skip creation. If any error occurs during
 * attribute creation, it will clean up by deleting the partially created collection.
 *
 * @param database - The Databases instance used to interact with the database
 * @throws {Error} When the quiz collection ID is not set in environment variables
 * @returns {Promise<void>} A promise that resolves when the collection is successfully created
 *
 * @example
 * ```typescript
 * const databases = new Databases(client);
 * await createQuizzesCollection(databases);
 * ```
 */
export const createQuizzesCollection = async (database: Databases) => {
  let collectionCreated = false;

  if (!Settings.quizzesCollectionId) {
    throw new Error(
      "Quiz collection ID is not set in the environment variables."
    );
  }
  try {
    console.log("⌛ Creating Quiz collection...");
    await database.createCollection(
      Settings.databaseId,
      Settings.quizzesCollectionId,
      "Quiz",
      undefined,
      false,
      true
    );
    collectionCreated = true;

    const attributePromises = [];
    for (const [key, value] of Object.entries(quizCollectionAttributes)) {
      attributePromises.push(
        createAttribute<QuizDTO>(
          database,
          Settings.quizzesCollectionId,
          key,
          value
        )
      );
    }
    await Promise.all(attributePromises);
    console.log("✅ Quiz collection created successfully.");
    // ../../srceslint-disable-next-line
  } catch (error: any) {
    if (error.code === 409) {
      console.warn("⚠️ Quiz collection already exists. Skipping creation.");
      return;
    }
    if (collectionCreated) {
      await database.deleteCollection(
        Settings.databaseId,
        Settings.quizzesCollectionId
      );
    }
    console.error("🛑 Error creating Quiz collection:", error.message);
  }
};

const supportedLanguages: Languages[] = [
  "javascript",
  "typescript",
  "python",
  "c++",
];
// schema for Quiz Collection
const quizCollectionAttributes: QuizCollection<keyof Omit<QuizDTO, "id">> = {
  language: {
    type: "enum",
    required: false,
    array: false,
    values: supportedLanguages,
    default: supportedLanguages[0],
  },
  questions: {
    type: "string",
    size: 16512,
    array: true,
    required: true,
  },
  questionsCount: {
    type: "integer",
    required: true,
    array: false,
    min: 1,
  },
};
