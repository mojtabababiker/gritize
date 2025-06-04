import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";

import { Quiz } from "@/models/dto/quiz-dto";

import { QUIZ_GENERATION } from "@/constant/assistant-ai";
import { Settings } from "@/constant/setting";

import { saveQuiz } from "@/utils/appwrite/database-actions";
import { QuizSchema } from "@/models/schemas/";

export const runtime = "edge";

const google = createGoogleGenerativeAI({
  apiKey: Settings.googleApiKey,
});
const model = google("gemini-2.0-flash-thinking-exp-01-21");

/**
 * Retrieves or generates (using AI assistance) a quiz based on the specified language.
 *
 * @param language - The language for which to generate the quiz
 * @returns A promise that resolves to an object containing either:
 *          - data: The generated Quiz object if successful, null if failed
 *          - error: Error message string if failed, null if successful
 *
 * @remarks
 * The uses AI to generate a quiz based on the provided language.
 * It constructs a prompt using the QUIZ_GENERATION template, replacing
 * {{SELECTED_LANGUAGE}} with the provided language.
 * Using the vercel ai-sdk, it generates a quiz object.
 * It uses the QUIZ_GENERATION template, replacing {{SELECTED_LANGUAGE}} with the provided language.
 *
 * @throws Will not throw directly, but captures and returns errors in the result object
 *
 * @example
 * ```typescript
 * const result = await getQuiz("JavaScript");
 * if (result.error) {
 *   console.error(result.error);
 * } else {
 *   console.log(result.data);
 * }
 * ```
 */
export async function getQuiz(
  language: string
): Promise<{ data: Quiz | null; error: string | null }> {
  // const startTime = Date.now();
  const prompt = QUIZ_GENERATION.replace("{{SELECTED_LANGUAGE}}", language);

  // console.log("prompt from API", prompt);

  try {
    const result = await generateObject({
      model,
      temperature: 1,
      prompt,
      output: "no-schema",
    });

    // console.log("Execution time:", Date.now() - startTime, "ms");
    // console.log("result from API", result.object);
    // saving the quiz to the database
    const parsedResult = QuizSchema.safeParse(result.object);
    if (!parsedResult.success) {
      console.error("Validation error:", parsedResult.error);
      return {
        data: null,
        error: "Failed to generate quiz, please try again",
      };
    }

    const quiz = parsedResult.data;
    await saveQuiz({ id: "", ...quiz });

    return { data: { id: "", ...quiz }, error: null };
  } catch (error) {
    // console.log("Execution time:", Date.now() - startTime, "ms");
    console.error("Error in API:", error);
    return {
      data: null,
      // @ts-expect-error to expensive to type it
      error: error.message || "Failed to generate quiz, please try again",
    };
  }
}
