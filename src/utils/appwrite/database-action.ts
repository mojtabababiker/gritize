"use server";
import { AppwriteException, ID, Query } from "node-appwrite";
import { createAdminClient } from "@/config/appwrite";
import { Settings } from "@/constant/setting";
import {
  CodingPatternSchema,
  UserProblemSchema,
  UserSchema,
} from "@/models/schemas";
import { UserDTO } from "@/models/dto/user-dto";

export const getUserById = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  const { databases } = await createAdminClient();

  try {
    // get the user document from the database
    const userDoc = await databases.getDocument(
      Settings.databaseId,
      Settings.usersCollectionId,
      userId
    );
    if (!userDoc) {
      return null;
    }

    // remove the unwanted properties from the user object
    const {
      $id: id,
      $collectionId,
      $databaseId,
      $createdAt,
      $updatedAt,
      $permissions,
      ...rest
    } = userDoc;
    const user = { id, ...rest } as UserDTO;
    // retrieve user's general algorithms and coding patterns
    const generalAlgorithmsDocs = await databases.listDocuments(
      Settings.databaseId,
      Settings.userProblemsCollectionId,
      [Query.equal("user", user.id || "")]
    );
    const { documents: gaDocs } = generalAlgorithmsDocs;
    // update generalAlgorithm schema
    const generalAlgorithms = gaDocs.map((algorithm) => {
      const {
        $id: id,
        $collectionId,
        $databaseId,
        $createdAt,
        $updatedAt,
        $permissions,
        ...rest
      } = algorithm;
      return {
        id,
        ...rest,
      } as UserProblemSchema;
    });

    console.log("General Algorithms:", generalAlgorithms);
    const codingPatternsDoc = await databases.listDocuments(
      Settings.databaseId,
      Settings.userProblemsCollectionId,
      [
        Query.equal("user", user.id || ""),
        Query.equal("type", "coding-pattern"),
      ]
    );
    const { documents: cpDocs } = codingPatternsDoc;

    // update codingPatterns schema
    const codingPatterns = cpDocs.map((pattern) => {
      const {
        $id: id,
        $collectionId,
        $databaseId,
        $createdAt,
        $updatedAt,
        $permissions,
        ...rest
      } = pattern;
      return {
        id,
        ...rest,
      } as CodingPatternSchema;
    });
    console.log("Coding Patterns:", codingPatterns);
    // add the general algorithms and coding patterns to the user object
    user.generalAlgorithms = generalAlgorithms;
    user.codingPatterns = codingPatterns;

    // return the result as UserSchema object

    return user as UserDTO;
  } catch (error) {
    console.error("Error getting user by ID", error);
    return null;
  }
};

export const createUser = async (user: UserDTO) => {
  const { databases } = await createAdminClient();
  try {
    const userDoc = await databases.createDocument(
      Settings.databaseId,
      Settings.usersCollectionId,
      user.id || ID.unique(),
      {
        ...user,
        totalSolvedProblems: 0,
        generalAlgorithms: user.generalAlgorithms.map((algorithm) => ({
          ...algorithm,
          problem: [algorithm.problem.id],
        })),

        codingTechniques: user.codingPatterns.map((pattern) => ({
          ...pattern,
          problems: pattern.problems.map((problem) => ({
            ...problem,
            problem: [problem.problem.id],
          })),
        })),
      }
    );
    const {
      $id: id,
      $collectionId,
      $databaseId,
      $createdAt,
      $updatedAt,
      $permissions,
      ...rest
    } = userDoc;
    const data = { id, ...rest } as UserDTO;
    return { data, error: null };
  } catch (error) {
    console.error("Error creating user", error);
    if (error instanceof AppwriteException) {
      return { error, data: null };
    }
    return { data: null, error: { response: "An unexpected error occurred" } };
  }
};
