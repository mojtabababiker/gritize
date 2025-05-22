"use server";

import { deleteFile, uploadFile } from "../appwrite/storage-actions";

/**
 * Uploads an image file to storage
 * @param file - The image file to upload as a Blob
 * @returns A promise that resolves to an object containing either:
 * - On success: {error: null, data: uploadResult}
 * - On failure: {error: string, data: null}
 * @throws Will not throw - errors are handled and returned in the error property
 */
export const uploadImage = async (userId: string, file: Blob) => {
  if (!file) {
    return { error: "Please select an image", data: null };
  }

  try {
    const result = await uploadFile(userId, file);
    return { error: null, data: result };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { error: "Failed to upload image", data: null };
  }
};

export const deleteImage = async (imageUrl: string) => {
  if (!imageUrl) {
    return;
  }
  try {
    await deleteFile(imageUrl);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
