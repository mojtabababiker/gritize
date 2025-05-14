import { getQuiz } from "@/utils/quiz-actions";

/**
 * Handles GET requests to generate a quiz based on the specified language.
 *
 * @param request - The incoming HTTP request object
 * @returns A Promise that resolves to a Response object containing either:
 *          - A JSON object with quiz data and 200 status code on success
 *          - A JSON error object with 400 status code if language parameter is missing
 *          - A JSON error object with 500 status code if quiz generation fails
 * @throws Will not throw errors directly, but returns error responses
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const language = url.searchParams.get("language");
  if (!language) {
    return Response.json(
      { error: "Language parameter is required" },
      { status: 400 }
    );
  }
  const { data, error } = await getQuiz(language);
  if (error) {
    return Response.json({ error }, { status: 500 });
  }
  return Response.json({ data }, { status: 200 });
}
