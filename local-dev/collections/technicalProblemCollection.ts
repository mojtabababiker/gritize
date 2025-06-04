import { Databases } from "node-appwrite";

import { Settings } from "../../src/constant/setting";
import { TechnicalProblemDTO } from "../../src/models/dto/problem-dto";

import { ProblemCollection } from "../types";
import { createAttribute } from "./utils/createAttributes";

/**
 * Creates a Technical Problems collection in the database with all required attributes.
 *
 * This function attempts to create a new collection for storing technical problems,
 * including setting up all necessary attributes defined in technicalProblemCollectionAttributes.
 * If the collection already exists (409 error), it will skip creation gracefully.
 * In case of other errors during attribute creation, it will clean up by deleting
 * the partially created collection.
 *
 * @param database - The Databases instance used to interact with the database
 * @throws {Error} When Settings.problemsCollectionId is not configured
 * @returns {Promise<void>} A promise that resolves when the collection is successfully created or already exists
 *
 * @example
 * ```typescript
 * const databases = new Databases(client);
 * await createTechnicalProblemCollection(databases);
 * ```
 */
export const createTechnicalProblemCollection = async (database: Databases) => {
  let collectionCreated = false;

  if (!Settings.problemsCollectionId) {
    throw new Error(
      "Technical Problems collection ID is not set in the environment variables."
    );
  }
  try {
    console.log("⌛ Creating Technical Problems collection...");
    await database.createCollection(
      Settings.databaseId,
      Settings.problemsCollectionId,
      "Technical Problems",
      undefined,
      false,
      true
    );
    collectionCreated = true;

    // Create attributes for the Technical Problems collection
    const attributePromises = [];
    for (const [key, value] of Object.entries(
      technicalProblemCollectionAttributes
    )) {
      attributePromises.push(
        createAttribute<TechnicalProblemDTO>(
          database,
          Settings.problemsCollectionId,
          key,
          value
        )
      );
    }
    await Promise.all(attributePromises);
    console.log("✅ Technical Problems collection created successfully.");
    // ../../srceslint-disable-next-line
  } catch (error: any) {
    if (error.code === 409) {
      console.warn(
        "⚠️ Technical Problems collection already exists. Skipping creation."
      );
      return;
    }
    if (collectionCreated) {
      await database.deleteCollection(
        Settings.databaseId,
        Settings.problemsCollectionId
      );
    }
    console.error(
      "🛑 Error creating Technical Problems collection:",
      error.message
    );
  }
};

// schema for Technical Problem Collection
const technicalProblemCollectionAttributes: ProblemCollection<
  keyof Omit<TechnicalProblemDTO, "id">
> = {
  title: {
    type: "string",
    required: true,
    array: false,
    size: 128,
  },
  slug: {
    type: "string",
    required: true,
    array: false,
    size: 128,
  },
  type: {
    type: "enum",
    required: true,
    array: false,
    values: ["algorithm", "coding-pattern"],
  },
  difficulty: {
    type: "enum",
    required: true,
    values: ["easy", "mid", "advanced"],
    array: false,
  },

  description: {
    type: "string",
    required: true,
    array: false,
    size: 2048,
  },
  hint: {
    type: "string",
    required: false,
    array: false,
    size: 2048,
  },
};
