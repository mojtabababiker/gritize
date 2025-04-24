export const Settings = {
  apiKey: process.env.NEXT_APPWRITE_API_KEY || "",
  endpoint: process.env.NEXT_PUBLIC_API_URL || "",
  appURL: process.env.NEXT_PUBLIC_APP_URL || "",
  project: process.env.NEXT_APPWRITE_PROJECT_ID || "",
  databaseId: process.env.NEXT_APPWRITE_DATABASE_ID || "",
  usersCollectionId: process.env.NEXT_APPWRITE_USERS_COLLECTION_ID || "",
  problemsCollectionId: process.env.NEXT_APPWRITE_PROBLEMS_COLLECTION_ID || "",
  codingTechniquesCollectionId:
    process.env.NEXT_APPWRITE_CODING_TECHNIQUES_COLLECTION_ID || "",
  userProblemsCollectionId:
    process.env.NEXT_APPWRITE_USER_PROBLEMS_COLLECTION_ID || "",
  storageBucketId: process.env.NEXT_APPWRITE_STORAGE_ID || "",
};
