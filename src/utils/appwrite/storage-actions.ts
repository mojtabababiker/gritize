"use server";
import { ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";

import { createAdminClient } from "@/config/appwrite";
import { Settings } from "@/constant/setting";

/**
 * Uploads a file to Appwrite storage and returns the public URL
 * @param userId - The ID of the user uploading the file
 * @param file - The file blob to upload
 * @throws {Error} When file parameter is null or undefined
 * @returns {Promise<string>} The public URL of the uploaded file
 */
export const uploadFile = async (userId: string, file: Blob) => {
  if (!file) {
    throw new Error("File is required");
  }
  const { storage } = await createAdminClient();
  const fileToUpload = InputFile.fromBuffer(file, `user-${userId}/avatar.png`);
  const uploadedFile = await storage.createFile(
    Settings.storageBucketId,
    ID.unique(),
    fileToUpload
  );

  const url = `${Settings.endpoint}/storage/buckets/${Settings.storageBucketId}/files/${uploadedFile.$id}/view?project=${Settings.project}`;
  return url;
};

/**
 * Deletes a file from Appwrite storage using its URL.
 * @param fileUrl - The complete URL of the file to be deleted from storage
 * @throws {Error} When unable to parse the file ID from the URL
 * @returns Promise<void>
 */
export const deleteFile = async (fileUrl: string) => {
  const fileId = fileUrl.split("/").at(-2);
  if (!fileId) {
    throw new Error("Error parsing file ID from URL");
  }
  const { storage } = await createAdminClient();
  await storage.deleteFile(Settings.storageBucketId, fileId);
};
