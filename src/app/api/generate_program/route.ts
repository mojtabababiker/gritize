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
import { NextRequest } from "next/server";

export const maxDuration = 45;

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
export async function POST(request: NextRequest): Promise<Response> {
  // const startTime = Date.now();
  const { prompt } = await request.json();
  const searchParams = request.nextUrl.searchParams;
  const programType = searchParams.get("programType");

  if (
    !programType ||
    !["algorithms", "coding-patterns"].includes(programType)
  ) {
    return Response.json(
      "Invalid program type. Must be either 'algorithms' or 'coding-patterns'.",
      { status: 400 }
    );
  }

  // Generate the program
  const programResult = await generateText({
    ...options,
    system:
      programType === "algorithms"
        ? SYSTEM_INSTRUCTION_ALGORITHM
        : SYSTEM_INSTRUCTION_CODING_PATTERN,
    prompt: prompt,
  });
  // console.log("Request IP: ", request.);
  // console.log("Prompt Tokens used:", programResult.usage.promptTokens);
  // console.log("Completion Tokens used:", programResult.usage.completionTokens);

  // const endTime = Date.now();
  // const totalTime = (endTime - startTime) / 1000; // in seconds
  // console.log(
  // `\n** Total time taken to generate the program: ${totalTime} seconds**\n`
  // );

  try {
    const cleanResult = cleanJsonResponse(programResult.text);

    // console.log(cleanResult);
    return Response.json(cleanResult);
  } catch (error) {
    console.error("Error cleaning JSON response:", error);
    return Response.json("Failed to parse the generated program output.", {
      status: 500,
    });
  }
}

/**
 * Cleans the JSON response by removing unnecessary characters and parsing it.
 *
 * @param {string} response - The JSON response string to be cleaned
 * @returns Parsed JSON object
 *
 * @throws {Error} If the response cannot be parsed as JSON
 *
 * @example
 * ```typescript
 * const jsonResponse = cleanJsonResponse('{"key": "value"}');
 * console.log(jsonResponse.key); // Output: value
 * ```
 */
const cleanJsonResponse = (response: string) => {
  try {
    return JSON.parse(response);
  } catch {
    if (response.startsWith("```json")) {
      const cleanResponse = response.slice(
        8, // remove the ```json\n
        response.length - 4 // remove the \n```
      );
      return JSON.parse(cleanResponse);
    }
    throw new Error("Output generation failed.");
  }
};
