import { listProblems } from "@/utils/appwrite/database-actions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const cursorId = url.searchParams.get("cursorId") || "";
  const page = url.searchParams.get("page") || "1";
  const limit = url.searchParams.get("limit") || "10";
  const prev = url.searchParams.get("prev");

  const { data, total, hasMore, error } = await listProblems(
    cursorId,
    parseInt(page),
    parseInt(limit),
    prev === "true"
  );
  if (error || !data) {
    return Response.json({ data: null, error }, { status: 500 });
  }

  return Response.json({ problems: data, total, hasMore }, { status: 200 });
}
