import { Databases, ID, Permission, Role } from "node-appwrite";

import { Settings } from "../../src/constant/setting";
import { UserDTO } from "../../src/models/dto/user-dto";
import { Languages } from "../../src/models/types/indext";

import { UserCollection } from "../types";
import { createAttribute } from "./utils/createAttributes";

/**
 * Creates a Users collection in the database with predefined attributes and permissions.
 *
 * This function sets up a new collection for storing user data with appropriate
 * read, create, and update permissions for users. It also creates all necessary
 * attributes based on the usersCollectionAttributes configuration.
 *
 * @param database - The Databases instance used to interact with the database
 *
 * @throws {Error} When the users collection ID is not set in environment variables
 *
 * @returns {Promise<void>} A promise that resolves when the collection is successfully created
 *
 * @remarks
 * - If the collection already exists (error code 409), the function will skip creation
 * - If an error occurs during attribute creation, the collection will be rolled back and deleted
 * - The collection is created with documentSecurity disabled and enabled status set to true
 * - Attributes are created concurrently using Promise.all for better performance
 */
export const createUsersCollection = async (database: Databases) => {
  let collectionCreated = false;

  try {
    console.log("⌛ Creating Users collection...");
    if (!Settings.usersCollectionId) {
      console.warn(
        "⚠️ Users collection ID is not set in environment variables. Generating a unique ID.\n"
      );
      Settings.usersCollectionId = ID.unique();
    }
    await database.createCollection(
      Settings.databaseId,
      Settings.usersCollectionId,
      "Users",
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
      ],
      false,
      true
    );
    collectionCreated = true;

    // Create attributes for the Users collection
    const attributePromises = [];
    for (const [key, value] of Object.entries(usersCollectionAttributes)) {
      attributePromises.push(
        createAttribute<UserDTO>(
          database,
          Settings.usersCollectionId,
          key,
          value
        )
      );
    }
    await Promise.all(attributePromises);
    console.log("✅ Users collection created successfully.");
    console.log(
      `📝 Collection ID: ${Settings.usersCollectionId}, Name: Users\n`
    );
    // @eslint-disable-next-line
  } catch (error: any) {
    if (error.code === 409) {
      console.warn("⚠️ Users collection already exists. Skipping creation.");
      return;
    }
    if (collectionCreated) {
      await database.deleteCollection(
        Settings.databaseId,
        Settings.usersCollectionId
      );
    }
    console.error("🛑 Error creating users collection:", error.message);
  }
};

const supportedLanguages: Languages[] = [
  "javascript",
  "typescript",
  "python",
  "c++",
];

// schema for Users Collection
const usersCollectionAttributes: UserCollection<keyof Omit<UserDTO, "id">> = {
  email: { type: "string", required: true, array: false, size: 32 },
  name: { type: "string", required: true, array: false, size: 24 },
  avatar: { type: "url", required: false, array: false, default: null },
  skillLevel: {
    type: "enum",
    required: false,
    array: false,
    values: ["entry-level", "junior", "mid-level", "senior"],
  },
  preferredLanguage: {
    type: "enum",
    required: false,
    array: false,
    values: supportedLanguages,
    default: supportedLanguages[0],
  },
  onboarding: {
    type: "boolean",
    required: false,
    array: false,
    default: true,
  },
  isNewUser: {
    type: "boolean",
    required: false,
    array: false,
    default: true,
  },
  totalSolvedProblems: {
    type: "integer",
    required: false,
    array: false,
    default: 0,
    min: 0,
  },
  generalAlgorithms: {
    type: "string",
    required: false,
    array: true,
    size: 20,
  },
  codingPatterns: { type: "string", required: false, array: true, size: 20 },
  quizzes: {
    type: "string",
    required: false,
    array: true,
    size: 24,
    default: [],
  },
  mustReview: {
    type: "boolean",
    required: false,
    array: false,
    default: false,
  },
  hasReviewed: {
    type: "boolean",
    required: false,
    array: false,
    default: false,
  },
  lastAskedReview: {
    type: "string",
    required: false,
    array: false,
    size: 64,
    default: null,
  },
};
