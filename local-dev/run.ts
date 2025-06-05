import { ID } from "node-appwrite";
import { createAdminClient } from "../src/config/appwrite";
import { Settings } from "../src/constant/setting";

import { createStorageBucket } from "./buckets";
import {
  createCodingTechniquesCollection,
  createProblemSolutionsCollection,
  createQuizzesCollection,
  createTechnicalProblemCollection,
  createTestimonialsCollection,
  createUserProblemsCollection,
  createUserQuizzesCollection,
  createUsersCollection,
} from "./collections";

/**
 * Initializes the Appwrite application by creating the database, collections, and storage bucket.
 * This function should only be run in development environment.
 *
 * The function performs the following operations:
 * 1. Validates that the script is running in development mode
 * 2. Creates an Appwrite database using settings from environment variables
 * 3. Creates multiple collections including users, technical problems, quizzes, etc.
 * 4. Creates a storage bucket for file operations
 *
 * @throws {Error} When NODE_ENV is not set to "development"
 * @throws {Error} When Database ID is not configured in environment variables
 * @throws {Error} When database creation fails (unless it already exists)
 *
 * @returns {Promise<void>} A promise that resolves when all setup operations complete successfully
 *
 * @example
 * ```typescript
 * // Ensure NODE_ENV=development is set before calling
 * await run();
 * ```
 */
async function run() {
  if (process.env.NODE_ENV !== "development") {
    console.error("This script should only be run in development mode");
    throw new Error("Invalid environment");
  }
  try {
    const { databases, storage } = await createAdminClient();
    // create database
    console.log("🕛 Creating Appwrite application...");
    if (!Settings.databaseId) {
      console.warn(
        "⚠️ Database ID is not set in environment variables. Generating a unique ID.\n"
      );
      Settings.databaseId = ID.unique();
    }
    try {
      await databases.create(Settings.databaseId, Settings.databaseName, true);
      console.log(
        `Database Created Successfully:\nName: ${Settings.databaseName}\nID: ${Settings.databaseId}`
      );
    } catch (error) {
      // @ts-expect-error error.code is defined in all cases
      if (error.code === 409) {
        console.log(
          `Database with ID ${Settings.databaseId} already exists. Skipping creation.`
        );
      } else {
        console.error("🛑 Error creating database:", error);
        throw error;
      }
    } finally {
      console.log("==================================================\n");
    }

    // create collections
    console.log("🕛 Creating collections...\n");
    const collections = await Promise.allSettled([
      createUsersCollection(databases),
      createTechnicalProblemCollection(databases),
      createUserProblemsCollection(databases),
      createCodingTechniquesCollection(databases),
      createQuizzesCollection(databases),
      createUserQuizzesCollection(databases),
      createProblemSolutionsCollection(databases),
      createTestimonialsCollection(databases),
      // createStorageBucket(storage),
      console.log("\n==================================================\n"),
    ]);
    if (collections.some((result) => result.status === "rejected")) {
      console.error(
        "\n🛑 Some collections failed to create. Check the logs above."
      );
      return;
    }
    console.log("✨ All collections created successfully.");

    // create storage bucket
    console.log("\n==================================================\n");
    console.log("🕛 Creating storage bucket...\n");
    await createStorageBucket(storage);
  } catch (error) {
    console.error("🛑 Error creating Appwrite application:", error);
  }
}

run()
  .then(() =>
    console.log(
      "==============Appwrite application setup completed.==============\n"
    )
  )
  .catch((error) => console.error("🛑 Error during setup:", error));
