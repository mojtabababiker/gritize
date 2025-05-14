/* eslint-disable @typescript-eslint/no-unused-vars */
import { Models } from "node-appwrite";

export const stripAppwriteFields = <T>(doc: Models.Document) => {
  const {
    $id: id,
    $collectionId,
    $databaseId,
    $createdAt,
    $updatedAt,
    $permissions,
    ...rest
  } = doc;
  const result = { id, ...rest };
  return result as unknown as T;
};
