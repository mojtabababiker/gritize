import { createAdminClient } from "@/config/appwrite";
import { Settings } from "@/constant/setting";
import { ID } from "node-appwrite";

export async function POST(request: Request) {
  const { userId, title, review, rating, thoughts } = await request.json();

  if (!userId || !title || !review || !rating) {
    return Response.json(
      {
        message: `All fields are required, missing =>\`${
          !userId ? " userId" : ""
        }${!title ? " title" : ""}${!review ? " review" : ""}${
          !rating ? " rating" : ""
        }${!thoughts ? " thoughts" : ""}\``,
      },
      { status: 400 }
    );
  }

  if (rating < 1 || rating > 5) {
    return Response.json(
      {
        message: "Rating must be between 1 and 5",
      },
      { status: 400 }
    );
  }

  try {
    const { databases } = await createAdminClient();
    const response = await databases.createDocument(
      Settings.databaseId,
      Settings.testimonialsCollectionId,
      ID.unique(),
      {
        userId,
        userTitle: title,
        review,
        rating,
        extraThoughts: thoughts || "",
      }
    );
    return Response.json(
      {
        message: "Review submitted successfully",
        data: response,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);
    return Response.json(
      {
        message: "An error occurred while submitting your review",
      },
      { status: 500 }
    );
  }
}
