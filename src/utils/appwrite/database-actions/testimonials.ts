import { createAdminClient } from "@/config/appwrite";
import { Settings } from "@/constant/setting";
import { TestimonialSchema } from "@/models/schemas";
import { Query } from "node-appwrite";

/**
 * Retrieves a list of testimonials with associated user data from the database.
 *
 * @returns {Promise<TestimonialSchema[]>} A promise that resolves to an array of testimonials.
 * Each testimonial contains:
 * - avatar: User's avatar
 * - name: User's name
 * - userTitle: User's title
 * - review: The testimonial text
 * - rating: Numeric rating (minimum 3)
 *
 * @remarks
 * - Fetches up to 9 testimonials
 * - Orders by creation date (descending)
 * - Orders by rating (descending)
 * - Only includes ratings >= 3
 * - For each testimonial, fetches associated user data from users collection
 */
export const listTestimonials = async () => {
  const { databases } = await createAdminClient();

  const docs = await databases.listDocuments(
    Settings.databaseId,
    Settings.testimonialsCollectionId,
    [
      Query.limit(9),
      Query.orderDesc("$createdAt"),
      Query.orderDesc("rating"),
      Query.greaterThanEqual("rating", 3),
    ]
  );

  const testimonials: TestimonialSchema[] = [];
  for (const doc of docs.documents) {
    const user = await databases.getDocument(
      Settings.databaseId,
      Settings.usersCollectionId,
      doc.userId
    );
    const testimonial: TestimonialSchema = {
      avatar: user.avatar,
      name: user.name,
      userTitle: doc.userTitle,
      review: doc.review,
      rating: doc.rating,
    };
    testimonials.push(testimonial);
  }

  return testimonials;
};
