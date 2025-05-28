import { GET_HINT_INSTRUCTION } from "@/constant/assistant-ai";
import { Settings } from "@/constant/setting";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, StreamTextOnErrorCallback } from "ai";

export const runtime = "edge";

const google = createGoogleGenerativeAI({
  apiKey: Settings.googleApiKey,
});
const model = google("gemini-2.0-flash-thinking-exp-01-21");

const options = {
  model,
  temperature: 0.7,
  system: GET_HINT_INSTRUCTION,
};

export async function POST(request: Request): Promise<Response> {
  const { messages } = await request.json();
  // console.log("Received messages:", messages);

  const handleError: StreamTextOnErrorCallback = ({ error }) => {
    console.error("Error in stream:", error);
  };

  const response = streamText({ ...options, messages, onError: handleError });

  // console.log("\n\nStreaming response:", response.text, "\n");

  return response.toDataStreamResponse();
}
