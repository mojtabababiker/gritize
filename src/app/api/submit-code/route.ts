import { CODE_SUBMISSION_INSTRUCTION } from "@/constant/assistant-ai";
import { Settings } from "@/constant/setting";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";

export const runtime = "edge";

const google = createGoogleGenerativeAI({
  apiKey: Settings.googleApiKey,
});

const model = google("gemini-2.0-flash-thinking-exp-01-21");

export async function POST(request: Request) {
  const { prompt } = await request.json();

  // console.log("Received body:", prompt);

  const response = await generateText({
    model,
    prompt,
    system: CODE_SUBMISSION_INSTRUCTION,
    temperature: 1,
  });

  // return Response.json({ message: "not implemented" }, { status: 501 });

  // console.log("Response:", response.text);

  return response.text
    ? Response.json({ message: response.text }, { status: 200 })
    : Response.json(
        { message: "No response from the AI model" },
        { status: 500 }
      );
}
