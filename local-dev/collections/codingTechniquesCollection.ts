import { Databases, ID, Permission, Role } from "node-appwrite";

import { Settings } from "../../src/constant/setting";
import { CodingPatternDTO } from "../../src/models/dto/user-dto";

import { CodingTechniquesCollection } from "../types";
import { createAttribute } from "./utils/createAttributes";

/**
 * Creates a Coding Techniques collection in the database with specified attributes and permissions.
 *
 * This function initializes a new collection for storing coding techniques/patterns with read and create
 * permissions for users. If the collection already exists (error code 409), it logs a warning and returns.
 * In case of other errors during creation, it performs cleanup by deleting the partially created collection.
 *
 * @param database - The Databases instance used to interact with the database
 * @throws {Error} When the coding techniques collection ID is not set in environment variables
 * @returns {Promise<void>} A promise that resolves when the collection is successfully created or skipped
 *
 * @example
 * ```typescript
 * const databases = new Databases(client);
 * await createCodingTechniquesCollection(databases);
 * ```
 */
export const createCodingTechniquesCollection = async (database: Databases) => {
  let collectionCreated = false;

  try {
    console.log("⌛ Creating Coding Techniques collection...");
    if (!Settings.codingTechniquesCollectionId) {
      console.warn(
        "⚠️ Coding Techniques collection ID is not set in environment variables. Generating a unique ID.\n"
      );
      Settings.codingTechniquesCollectionId = ID.unique();
    }
    await database.createCollection(
      Settings.databaseId,
      Settings.codingTechniquesCollectionId,
      "Coding Techniques",
      [Permission.read(Role.users()), Permission.create(Role.users())],
      false,
      true
    );
    collectionCreated = true;

    const attributePromises = [];
    for (const [key, value] of Object.entries(
      codingTechniquesCollectionAttributes
    )) {
      attributePromises.push(
        createAttribute<CodingPatternDTO>(
          database,
          Settings.codingTechniquesCollectionId,
          key,
          value
        )
      );
    }
    await Promise.all(attributePromises);
    console.log("✅ Coding Techniques collection created successfully.");
    console.log(
      `📝 Collection ID: ${Settings.codingTechniquesCollectionId}, Name: Coding Techniques\n`
    );
    // @eslint-disable-next-line
  } catch (error: any) {
    if (error.code === 409) {
      console.warn(
        "⚠️ Coding Techniques collection already exists. Skipping creation."
      );
      return;
    }
    if (collectionCreated) {
      await database.deleteCollection(
        Settings.databaseId,
        Settings.codingTechniquesCollectionId
      );
    }
    console.error(
      "🛑 Error creating Coding Techniques collection:",
      error.message
    );
  }
};

// schema for Coding Techniques Collection
const codingTechniquesCollectionAttributes: CodingTechniquesCollection<
  keyof Omit<CodingPatternDTO, "id">
> = {
  title: {
    type: "string",
    required: true,
    array: false,
    size: 255,
  },
  info: {
    type: "string",
    required: true,
    array: false,
    size: 1024,
  },
  totalProblems: {
    type: "integer",
    required: true,
    array: false,
    min: 0,
  },
  solvedProblems: {
    type: "integer",
    required: false,
    array: false,
    min: 0,
    default: 0,
  },
  userId: {
    type: "string",
    required: true,
    array: false,
    size: 24,
  },
  problems: {
    type: "string",
    required: false,
    array: true,
    size: 24, // Array of problem IDs
  },
};
