export const Settings = {
  // environment
  env: process.env.NODE_ENV || "development",
  dumpData: process.env.DUMP_DATA || false,

  // Appwrite API Settings
  apiKey: process.env.NEXT_APPWRITE_API_KEY || "",
  endpoint: process.env.NEXT_PUBLIC_API_URL || "",
  appURL: process.env.NEXT_PUBLIC_APP_URL || "",
  project: process.env.NEXT_APPWRITE_PROJECT_ID || "",

  // Appwrite Database Collections IDs
  // You can find these IDs in the Appwrite console under the database settings
  // Make sure to replace these with your actual collection IDs
  databaseId: process.env.NEXT_APPWRITE_DATABASE_ID || "",
  usersCollectionId: process.env.NEXT_APPWRITE_USERS_COLLECTION_ID || "",
  problemsCollectionId: process.env.NEXT_APPWRITE_PROBLEMS_COLLECTION_ID || "",
  userProblemsCollectionId:
    process.env.NEXT_APPWRITE_USER_PROBLEMS_COLLECTION_ID || "",
  codingTechniquesCollectionId:
    process.env.NEXT_APPWRITE_CODING_TECHNIQUES_COLLECTION_ID || "",
  quizzesCollectionId: process.env.NEXT_APPWRITE_QUIZZES_COLLECTION_ID || "",
  problemSolutionsCollectionId:
    process.env.NEXT_APPWRITE_PROBLEM_SOLUTIONS_COLLECTION_ID || "",

  testimonialsCollectionId:
    process.env.NEXT_APPWRITE_TESTIMONIALS_COLLECTION_ID || "",

  // Appwrite Storage Buckets IDs
  // You can find these IDs in the Appwrite console under the storage settings
  // Make sure to replace these with your actual bucket IDs
  storageBucketId: process.env.NEXT_APPWRITE_STORAGE_ID || "",

  // Google Generative AI Settings
  googleApiKey: process.env.NEXT_GOOGLE_AI_API_KEY || "",

  // github settings
  githubAccessToken: process.env.NEXT_GITHUB_ACCESS_TOKEN || "",
};
