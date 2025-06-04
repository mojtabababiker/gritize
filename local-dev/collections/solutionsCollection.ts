import { Databases, Permission, Role } from "node-appwrite";

import { Settings } from "../../src/constant/setting";
import { Languages } from "../../src/models/types/indext";
import { ProblemSolutionDTO } from "../../src/models/dto/user-dto";

import { ProblemSolutionCollection } from "../types";
import { createAttribute } from "./utils/createAttributes";

/**
 * Creates a Problem Solutions collection in the database with the specified attributes and permissions.
 *
 * This function initializes a new collection for storing problem solutions, sets up the necessary
 * attributes, and configures read and create permissions for users. If the collection already exists,
 * it will skip creation with a warning. In case of errors during attribute creation, it will clean up
 * by deleting the partially created collection.
 *
 * @param databases - The Databases instance used to interact with the database
 * @throws {Error} When the Problem Solutions collection ID is not set in environment variables
 * @returns {Promise<void>} A promise that resolves when the collection is successfully created or skipped
 *
 * @example
 * ```typescript
 * const databases = new Databases(client);
 * await createProblemSolutionsCollection(databases);
 * ```
 */
export const createProblemSolutionsCollection = async (
  databases: Databases
) => {
  let collectionCreated = false;

  if (!Settings.problemSolutionsCollectionId) {
    throw new Error(
      "Problem Solutions collection ID is not set in the environment variables."
    );
  }

  try {
    console.log("⌛ Creating Problem Solutions collection...");
    await databases.createCollection(
      Settings.databaseId,
      Settings.problemSolutionsCollectionId,
      "Problem Solutions",
      [Permission.read(Role.users()), Permission.create(Role.users())],
      false,
      true
    );
    collectionCreated = true;

    const attributesPromises = [];

    for (const [key, value] of Object.entries(
      problemSolutionsCollectionAttributes
    )) {
      attributesPromises.push(
        createAttribute<ProblemSolutionDTO>(
          databases,
          Settings.problemSolutionsCollectionId,
          key,
          value
        )
      );
    }

    await Promise.all(attributesPromises);
    console.log("✅ Problem Solutions Collection created successfully");
    // ../../srceslint-disable-next-line
  } catch (error: any) {
    if (error.code === 409) {
      console.warn(
        "⚠️ Problem Solutions collection already exists. Skipping creation."
      );
      return;
    }
    if (collectionCreated) {
      await databases.deleteCollection(
        Settings.databaseId,
        Settings.problemSolutionsCollectionId
      );
    }
    console.error(
      "🛑 Error creating Problem Solutions Collection:",
      error.message
    );
  }
};

const supportedLanguages: Languages[] = [
  "javascript",
  "typescript",
  "python",
  "c++",
];

// schema for Problem Solutions Collection
const problemSolutionsCollectionAttributes: ProblemSolutionCollection<
  keyof Omit<ProblemSolutionDTO, "id" | "$createdAt">
> = {
  userId: {
    type: "string",
    required: true,
    array: false,
    size: 24,
  },
  problemId: {
    type: "string",
    required: true,
    array: false,
    size: 24,
  },
  solution: {
    type: "string",
    required: true,
    array: false,
  },
  language: {
    type: "enum",
    required: true,
    array: false,
    values: supportedLanguages,
  },
  score: {
    type: "float",
    required: true,
    array: false,
    min: 4,
    max: 10,
  },
  time: {
    type: "float",
    required: true,
    array: false,
    min: 0,
  },
};
