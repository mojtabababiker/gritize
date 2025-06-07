import { Settings } from "@/constant/setting";
import { UserQuizDTO } from "@/models/dto/user-dto";
import { Databases, ID, Permission, Role } from "node-appwrite";
import { UserQuizzesCollection } from "../types";
import { Languages } from "@/models/types/indext";
import { createAttribute } from "./utils/createAttributes";

export const createUserQuizzesCollection = async (database: Databases) => {
  let collectionCreated = false;

  try {
    console.log("⌛ Creating User Quizzes Collection...");
    if (!Settings.userQuizzesCollectionId) {
      console.warn(
        "⚠️ User Quizzes collection ID is not set in environment variables. Generating a unique ID.\n"
      );
      Settings.userQuizzesCollectionId = ID.unique();
    }
    await database.createCollection(
      Settings.databaseId,
      Settings.userQuizzesCollectionId,
      "User Quizzes",
      [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
      ],
      false,
      true
    );
    collectionCreated = true;

    // Create attributes for the User Quizzes collection
    const attributePromises = [];
    for (const [key, value] of Object.entries(
      userQuizzesCollectionAttributes
    )) {
      attributePromises.push(
        createAttribute<UserQuizDTO>(
          database,
          Settings.userQuizzesCollectionId,
          key,
          value
        )
      );
    }

    await Promise.all(attributePromises);
    console.log("✅ User Quizzes Collection created successfully");
    console.log(
      `📝 Collection ID: ${Settings.userQuizzesCollectionId}, Name: User Quizzes\n`
    );
  } catch (error: any) {
    if (error.code === 409) {
      console.warn(
        "⚠️ User Quizzes collection already exists. Skipping creation."
      );
      return;
    }
    if (collectionCreated) {
      await database.deleteCollection(
        Settings.databaseId,
        Settings.userQuizzesCollectionId
      );
    }
    throw error;
  }
};

const supportedLanguages: Languages[] = [
  "javascript",
  "typescript",
  "python",
  "c++",
];

const userQuizzesCollectionAttributes: UserQuizzesCollection<
  keyof Omit<UserQuizDTO, "id" | "$createdAt">
> = {
  userId: {
    type: "string",
    required: true,
    array: false,
  },
  score: {
    type: "integer",
    required: true,
    array: false,
  },
  skillLevel: {
    type: "enum",
    required: true,
    array: false,
    values: ["entry-level", "junior", "mid-level", "senior"],
  },
  language: {
    type: "enum",
    required: true,
    array: false,
    values: supportedLanguages,
  },
  questionsCount: {
    type: "integer",
    required: true,
    array: false,
    min: 1,
    max: 100,
  },
  questions: {
    type: "string",
    required: true,
    array: true,
    size: 16512, // Adjusted size for questions
  },
};
