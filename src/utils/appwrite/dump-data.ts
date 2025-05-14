"use server";

import { ID } from "node-appwrite";
import data from "../../../Data/coding-patterns";
import { createAdminClient } from "@/config/appwrite";
import { Settings } from "@/constant/setting";

/**
 * Dumps test/developing data into the database. This function can only be executed in development mode.
 * It takes problems from algorithms and coding patterns and creates documents in the database.
 *
 * @throws {Error} If the environment is not set to development
 * @returns {Promise<void>}
 */
export default async function dumpData(): Promise<void> {
  if (Settings.env !== "development") {
    throw new Error("This function can only be run in development mode.");
  }
  const { databases } = await createAdminClient();
  const problems = data.algorithms;
  data.codingPatterns.forEach((cp) => {
    cp.problems.forEach((problem) => {
      problems.push(problem);
    });
  });

  problems.forEach(async (problem) => {
    await databases.createDocument(
      Settings.databaseId,
      Settings.problemsCollectionId,
      ID.unique(),
      {
        ...problem,
      }
    );
  });
}
