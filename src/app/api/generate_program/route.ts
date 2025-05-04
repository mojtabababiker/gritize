import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import { Settings } from "@/constant/setting";
import {
  SYSTEM_INSTRUCTION_ALGORITHM,
  SYSTEM_INSTRUCTION_CODING_PATTERN,
} from "@/constant/assistant-ai";
import {
  createProblemsTool,
  searchProblemsBySlugTool,
} from "@/utils/assistant-tools";

const google = createGoogleGenerativeAI({
  apiKey: Settings.googleApiKey,
});

export const runtime = "edge";

const model = google("gemini-2.0-flash-thinking-exp-01-21");

// configuration options for the generateText function
// system instructions and prompt are passed in the function call
const options = {
  model,
  temperature: 1,
  tools: {
    createProblemsFromArray: createProblemsTool,
    searchProblemsBySlug: searchProblemsBySlugTool,
  },
  providerOptions: {
    config: {
      responseMimeType: "application/json",
    },
  },
  maxSteps: 15,
};

/**
 * Handles POST requests to generate program content by combining algorithms and coding patterns.
 *
 * @async
 * @param {Request} request - The incoming HTTP request object containing a JSON body with a prompt
 * @returns {Promise<Response>} JSON response containing the combined results of algorithms and coding patterns
 *
 * @remarks
 * The function performs the following steps:
 * 1. Extracts prompt from request body
 * 2. Generates algorithms using the prompt
 * 3. Generates coding patterns using the same prompt
 * 4. Measures and logs execution time
 * 5. Combines algorithm and coding pattern results
 *
 * @example
 * ```typescript
 * const response = await fetch('/api/generate_program', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *   },
 *   body: JSON.stringify(
 *        { prompt: 'Create a program for a mid-level software engineer' }),
 *   });
 * const result = await response.json();
 * console.log(result);
 * ```
 */
export async function POST(request: Request): Promise<Response> {
  const startTime = Date.now();
  const { prompt } = await request.json();
  console.log("prompt from API", prompt);

  // Generate the general algorithms
  console.log("Generating algorithms...");
  const algorithmsResult = await generateText({
    ...options,
    system: SYSTEM_INSTRUCTION_ALGORITHM,
    prompt: prompt,
  });
  console.log("Algorithms generated.");
  console.log("Prompt Tokens used:", algorithmsResult.usage.promptTokens);
  console.log(
    "Completion Tokens used:",
    algorithmsResult.usage.completionTokens
  );

  // Generate the coding patterns
  console.log("Generating coding patterns...");
  const codingPatternsResult = await generateText({
    ...options,
    system: SYSTEM_INSTRUCTION_CODING_PATTERN,
    prompt: prompt,
  });
  console.log("Coding patterns generated.");
  console.log("Prompt Tokens used:", codingPatternsResult.usage.promptTokens);
  console.log(
    "Completion Tokens used:",
    codingPatternsResult.usage.completionTokens
  );

  const endTime = Date.now();
  const totalTime = (endTime - startTime) / 1000; // in seconds
  console.log(
    `\n** Total time taken to generate the program: ${totalTime} seconds\n`
  );

  // Combine the results
  console.log("Combining results...");
  const result = combine(codingPatternsResult.text, algorithmsResult.text);

  return Response.json(result);
}

/**
 * A helper function to combine two JSON strings into a single object.
 * @param object1 - The first JSON string.
 * @param object2 - The second JSON string.
 * @returns The combined object.
 */
const combine = (object1: string, object2: string) => {
  try {
    const parsedObject1 = JSON.parse(object1);
    const parsedObject2 = JSON.parse(object2);
    const combined = { ...parsedObject1, ...parsedObject2 };
    return combined;
  } catch {
    const cleanObject1 = object1.slice(
      8, // remove the ```json\n
      object1.length - 4 // remove the \n```
    );
    const cleanObject2 = object2.slice(
      8, // remove the ```json\n
      object2.length - 4 // remove the \n```
    );
    console.log("\n\ncleanObject1", cleanObject1);
    console.log("cleanObject2", cleanObject2);
    console.log("\n\n");
    try {
      const combined = {
        ...JSON.parse(cleanObject1),
        ...JSON.parse(cleanObject2),
      };
      console.log("combined", combined);
      return combined;
    } catch (error) {
      console.error("Error parsing combined JSON:", error);
      throw new Error("Output generation failed.");
    }
  }
};
