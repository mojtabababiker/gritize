import { Storage, Compression, ID } from "node-appwrite";
import { Settings } from "@/constant/setting";

/**
 * Creates a storage bucket with predefined configuration settings.
 *
 * This function attempts to create a new storage bucket using the provided Storage instance
 * with specific settings including file size limits, allowed file types, and compression.
 * If the bucket already exists (409 error), it logs a warning and continues execution.
 *
 * @param storage - The Storage instance used to create the bucket
 * @throws {Error} Throws an error if the storage bucket ID is not set in environment variables
 * @throws {Error} Re-throws any error that occurs during bucket creation (except 409 conflict)
 *
 * @remarks
 * - Maximum file size: 20 MB
 * - Allowed file types: jpg, jpeg, png
 * - Compression: Gzip enabled
 * - Bucket will be deleted if creation fails after being partially created
 *
 * @example
 * ```typescript
 * const storage = new Storage(client);
 * await createStorageBucket(storage);
 * ```
 */
export const createStorageBucket = async (storage: Storage) => {
  let bucketCreated = false;

  try {
    console.log("⌛ Creating storage bucket...");
    if (!Settings.storageBucketId) {
      console.warn(
        "⚠️ Storage bucket ID is not set in environment variables. Generating a unique ID.\n"
      );
      Settings.storageBucketId = ID.unique();
    }
    await storage.createBucket(
      Settings.storageBucketId || ID.unique(),
      "Gritize Storage Bucket",
      undefined,
      true,
      true,
      20 * 1024 * 1024, // 20 MB
      ["jpg", "jpeg", "png"],
      Compression.Gzip,
      true
    );
    bucketCreated = true;
    console.log("✅ Storage Bucket created successfully");
    console.log(
      `📦 Bucket ID: ${Settings.storageBucketId}, Name: Gritize Storage Bucket`
    );
  } catch (error: any) {
    if (error.code === 409) {
      console.warn("⚠️ Storage bucket already exists. Skipping creation.");
      return;
    }
    if (bucketCreated) {
      await storage.deleteBucket(Settings.storageBucketId);
    }
    console.error("🛑 Error creating Storage Bucket:", error.message);
  } finally {
    console.log("==================================================\n");
  }
};
