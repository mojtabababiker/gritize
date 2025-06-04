import { Databases, Permission, Role } from "node-appwrite";

import { Settings } from "../../src/constant/setting";
import { TestimonialDTO } from "../../src/models/dto/testimonial-dto";

import { TestimonialCollection } from "../types";
import { createAttribute } from "./utils/createAttributes";

/**
 * Creates a testimonials collection in the database with the specified attributes and permissions.
 *
 * This function creates a new collection for storing testimonials with read access for any user
 * and create access for authenticated users. It also sets up all required attributes defined
 * in the testimonialsCollectionAttributes configuration.
 *
 * @param database - The Databases instance used to interact with the database
 * @throws {Error} Throws an error if the testimonials collection ID is not set in environment variables
 * @returns {Promise<void>} A promise that resolves when the collection is created successfully
 *
 * @remarks
 * - If the collection already exists (error code 409), the function will skip creation and log a warning
 * - If an error occurs during creation, any partially created collection will be cleaned up
 * - The collection is created with document security disabled and enabled state set to true
 * - Permissions are set to allow any user to read and authenticated users to create documents
 */
export const createTestimonialsCollection = async (database: Databases) => {
  let collectionCreated = false;
  if (!Settings.testimonialsCollectionId) {
    throw new Error(
      "Testimonials collection ID is not set in the environment variables."
    );
  }
  try {
    console.log("⌛ Creating Testimonials collection...");

    await database.createCollection(
      Settings.databaseId,
      Settings.testimonialsCollectionId,
      "Testimonials",
      [Permission.create(Role.users()), Permission.read(Role.any())],
      false,
      true
    );
    collectionCreated = true;

    // Create attributes for the Testimonials collection
    const attributePromises = [];
    for (const [key, value] of Object.entries(
      testimonialsCollectionAttributes
    )) {
      attributePromises.push(
        createAttribute<TestimonialDTO>(
          database,
          Settings.testimonialsCollectionId,
          key,
          value
        )
      );
    }
    await Promise.all(attributePromises);
    console.log("✅ Testimonials collection created successfully.");
    // ../../srceslint-disable-next-line
  } catch (error: any) {
    if (error.code === 409) {
      console.warn(
        "⚠️ Testimonials collection already exists. Skipping creation."
      );
      return;
    }
    if (collectionCreated) {
      await database.deleteCollection(
        Settings.databaseId,
        Settings.testimonialsCollectionId
      );
    }
    console.error("🛑 Error creating Testimonials Collection:", error.message);
  }
};

// schema for Testimonials Collection

const testimonialsCollectionAttributes: TestimonialCollection<
  keyof Omit<TestimonialDTO, "id">
> = {
  userId: {
    type: "string",
    required: true,
    array: false,
  },
  userTitle: {
    type: "string",
    required: true,
    array: false,
    size: 64,
  },
  review: {
    type: "string",
    required: true,
    array: false,
    size: 512,
  },
  rating: {
    type: "integer",
    required: true,
    array: false,
    min: 1,
    max: 5,
  },
  extraThoughts: {
    type: "string",
    required: false,
    array: false,
    size: 512,
  },
};
