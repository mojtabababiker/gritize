// a set of function that will be used by the generative AI assistant (the one responsible for generating the preparing program) to create algorithms and coding patterns problems
import { TechnicalProblem } from "@/models/problems";
import { TechnicalProblemSchema } from "@/models/schemas";
import { tool } from "ai";
import { z } from "zod";

/*=========================================================================
 *                             Tools
 *=========================================================================*/

/**
 * Tool for searching problems in the database by their slugs
 *
 * @remarks
 * This tool is used to retrieve problems from the database using their slug
 * identifiers and returns a mapping of slug to problem ID.
 * Used by the generative AI assistant, and it should never be used directly.
 *
 * @param slugs - Array of problem slugs to search for in the database
 * @returns An object containing key-value pairs where keys are problem slugs and values are their corresponding IDs
 *
 */
export const searchProblemsBySlugTool = tool({
  description:
    "Function that retrieves problems from the database by their slug and returns an object containing the key-value pairs of the problem slug and its id",
  parameters: z.object({
    slugs: z
      .array(z.string().describe("The slug of a problem"))
      .describe("Array of all problems slugs to be searched"),
  }),
  execute: searchProblemsBySlug,
});

/**
 * Tool for creating new problems in the database
 *
 * @remarks
 * This tool is used to create new problems in the database from the provided
 * problem information and returns an object containing the key-value pairs of
 * the problem slug and its id.
 * Used by the generative AI assistant, and it should never be used directly.
 *
 * @param problems - Array of problem information objects to be created,
 * typically `ProblemDto` array
 * @returns An object containing key-value pairs where keys are problem slugs and values are their corresponding IDs
 */
export const createProblemsTool = tool({
  description:
    "Function that creates new problems in the database from the based on the array of problem objects provided, and returns an object containing the key-value pairs of the problem slug and its id.",
  parameters: z.object({
    problems: z
      .array(
        z
          .object({
            title: z.string().describe("The title of the problem"),
            description: z.string().describe("Problem description"),
            difficulty: z
              .enum(["easy", "mid", "advanced"])
              .describe(
                "Problem difficulty, which can be one of easy, mid, or advanced"
              ),
            type: z
              .enum(["algorithm", "coding-pattern"])
              .describe(
                "Problem type, which can be either algorithm or coding-pattern"
              ),
            hint: z
              .string()
              .describe("The starting point and hints for the problem"),
            slug: z
              .string()
              .describe(
                "The slug of the problem, (a URL-friendly unique identifier) extracted from the title"
              ),
          })
          .describe("Problem information object")
      )
      .describe("An array of problem information objects"),
  }),
  execute: createProblems,
});

/*=========================================================================
 *                             Functions
 *=========================================================================*/

/**
 * Searches for technical problems in the database using their slugs and returns a mapping of slugs to problem IDs.
 *
 * @param params - The parameters object
 * @param params.slugs - An array of problem slugs to search for
 * @returns A Promise that resolves to a Record where keys are slugs and values are either problem IDs (string) or null if not found
 *
 * @example
 * const problemIds = await searchProblemsBySlug({ slugs: ['problem-1', 'problem-2'] });
 * // Returns: { 'problem-1': '123', 'problem-2': null }
 */
export async function searchProblemsBySlug({
  slugs,
}: {
  slugs: string[];
}): Promise<Record<string, string | null>> {
  const problemIds: Record<string, string | null> = {};
  // console.log(`\nSearching for ${slugs.length} problems in the database...\n`);
  for (const s of slugs) {
    const problemData = await TechnicalProblem.getBySlug(s);
    // console.log(
    //   `\nProblem with slug '${s}' fetched: ${
    //     problemData?.id ? `and found '${problemData.id}'` : "and not found"
    //   }\n`
    // );
    if (problemData && problemData.id) {
      problemIds[s] = problemData.id;
    } else {
      problemIds[s] = null;
    }
  }
  return problemIds;
}

type ProblemDto = Omit<TechnicalProblemSchema, "id">;

/**
 * Creates multiple technical problems in the database.
 *
 * @param {Object} params - The parameters object
 * @param {ProblemDto[]} params.problems - Array of problem data transfer objects to create
 * @returns {Promise<Record<string, string | null>>} A promise that resolves to an object mapping problem slugs to their IDs
 *
 * @example
 * const problems = [
 *   { title: "Problem 1", description: "...", difficulty: "EASY", type: "CODING", hint: "...", slug: "problem-1" }
 * ];
 * const problemIds = await createProblems({ problems });
 *
 * @throws {Error} If there's an error creating any of the problems in the database
 */
export async function createProblems({
  problems,
}: {
  problems: ProblemDto[];
}): Promise<Record<string, string | null>> {
  const problemIds: Record<string, string | null> = {};

  // console.log(`\nCreating ${problems.length} problems in the database...\n`);
  for (const problem of problems) {
    const { title, description, difficulty, type, hint, slug } = problem;
    const problemObj = await TechnicalProblem.fromJson({
      title,
      description,
      difficulty,
      type,
      hint,
      slug,
    });
    problemIds[slug] = problemObj?.id || null;
    // if (problemObj && problemObj.id) {
    //   console.info(
    //     `\nProblem created successfully: ${problem.title} - ${problemObj.id}\n`
    //   );
    // } else {
    //   console.error(`\nFailed to create problem: ${problem.title}\n`);
    // }
  }

  return problemIds;
}
