import { Databases, ID, Permission, Role } from "node-appwrite";

import { Settings } from "../../src/constant/setting";
import { UserProblemDTO } from "../../src/models/dto/user-dto";

import { UserProblemCollection } from "../types";
import { createAttribute } from "./utils/createAttributes";

/**
 * Creates a User Problems collection in the database with the specified attributes and permissions.
 *
 * This function creates a new collection for storing user problems data, sets up the necessary
 * permissions for users to read, create, and update records, and creates all required attributes
 * based on the userProblemsCollectionAttributes configuration.
 *
 * @param database - The Databases instance used to interact with the database
 *
 * @throws {Error} Throws an error if the User Problems collection ID is not set in environment variables
 *
 * @remarks
 * - If the collection already exists (error code 409), the function will log a warning and return early
 * - If an error occurs during attribute creation, the function will attempt to clean up by deleting the created collection
 * - The collection is created with permissions for users to read, create, and update records
 * - All attributes are created concurrently using Promise.all for better performance
 *
 * @example
 * ```typescript
 * const database = new Databases(client);
 * await createUserProblemsCollection(database);
 * ```
 */
export const createUserProblemsCollection = async (database: Databases) => {
  let collectionCreated = false;

  try {
    console.log("⌛ Creating User Problems Collection...");
    if (!Settings.userProblemsCollectionId) {
      console.warn(
        "⚠️ User Problems collection ID is not set in environment variables. Generating a unique ID.\n"
      );
      Settings.userProblemsCollectionId = ID.unique();
    }
    await database.createCollection(
      Settings.databaseId,
      Settings.userProblemsCollectionId,
      "User Problems",
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
      ],
      false,
      true
    );
    collectionCreated = true;

    const attributesPromises = [];

    for (const [key, value] of Object.entries(
      userProblemsCollectionAttributes
    )) {
      attributesPromises.push(
        createAttribute<UserProblemDTO>(
          database,
          Settings.userProblemsCollectionId,
          key,
          value
        )
      );
    }

    await Promise.all(attributesPromises);
    console.log("✅ User Problems Collection created successfully");
    console.log(
      `📝 Collection ID: ${Settings.userProblemsCollectionId}, Name: User Problems\n`
    );
    // @eslint-disable-next-line
  } catch (error: any) {
    if (error.code === 409) {
      console.warn(
        "⚠️ User Problems collection already exists. Skipping creation."
      );
      return;
    }
    if (collectionCreated) {
      await database.deleteCollection(
        Settings.databaseId,
        Settings.userProblemsCollectionId
      );
    }
    console.error("🛑 Error creating User Problems Collection:", error.message);
  }
};

// schema for User Problem Collection
const userProblemsCollectionAttributes: UserProblemCollection<
  keyof Omit<UserProblemDTO, "id">
> = {
  userId: {
    type: "string",
    required: false,
    array: false,
    size: 24,
    default: null, // null when user problem is assigned to coding technique
  },
  problemId: {
    type: "string",
    required: true,
    array: false,
    size: 24,
  },
  solved: {
    type: "boolean",
    required: false,
    array: false,
    default: false,
  },
  score: {
    type: "integer",
    required: false,
    array: false,
    default: 0,
    min: 0,
  },
  solutions: {
    type: "string",
    required: false,
    array: true,
  },
};
