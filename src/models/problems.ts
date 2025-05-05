import { ID } from "node-appwrite";

import { TechnicalProblemSchema } from "./schemas";
import {
  createProblem,
  getProblemBySlug,
} from "@/utils/appwrite/database-actions";

/**
 * TechnicalProblem class
 * @class TechnicalProblem
 * @description a class for the technical problem model that contains technical
 * problem information, and abstracts all the operations on the technical
 * problem model including creating, retrieving, and saving problems.
 */
export class TechnicalProblem {
  id?: string;
  title: string;
  difficulty: "easy" | "mid" | "advanced";
  description: string;
  type: "algorithm" | "coding-pattern";
  hint?: string;
  slug: string;
  // tags: string[];

  constructor({
    id,
    type,
    title,
    description,
    difficulty,
    hint,
    slug,
  }: TechnicalProblemSchema) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.difficulty = difficulty;

    this.type = type;
    this.hint = hint;
    this.slug = slug;
  }

  /**
   * Creates a new TechnicalProblem instance from JSON data and saves it to the database
   * @param data - The technical problem data conforming to TechnicalProblemSchema
   * @returns Promise resolving to a new TechnicalProblem instance or null
   * @throws Error if saving to database fails
   */
  static async fromJson(
    data: TechnicalProblemSchema
  ): Promise<TechnicalProblem | null> {
    const problem = new TechnicalProblem({
      id: data.id || ID.unique(),
      type: data.type,
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      hint: data.hint || undefined,
      slug: data.slug,
    });
    try {
      await problem.save();
      return problem;
    } catch (error) {
      return null;
    }
  }

  /**
   * Creates an array of TechnicalProblem instances from an array of problem schema objects.
   * @param data - An array of TechnicalProblemSchema objects to convert
   * @returns Promise that resolves to an array of TechnicalProblem instances or null
   * @throws Will throw an error if any problem schema fails to convert
   */
  static async fromJsonArray(
    data: TechnicalProblemSchema[]
  ): Promise<(TechnicalProblem | null)[]> {
    const problems = await Promise.all(
      data.map((problem) => TechnicalProblem.fromJson(problem))
    );
    return problems.filter(
      (problem): problem is TechnicalProblem => problem !== null
    );
  }

  /**
   * Retrieves a technical problem by its slug identifier.
   *
   * @param slug - The unique slug identifier of the problem
   * @returns A Promise that resolves to a TechnicalProblem instance if found, null otherwise
   *
   * @throws {Error} If there's an error fetching the problem data
   *
   * @example
   * ```typescript
   * const problem = await TechnicalProblem.getBySlug('unique-problem-slug');
   * if (problem) {
   *   console.log(problem.title);
   * }
   * ```
   */
  static async getBySlug(slug: string): Promise<TechnicalProblem | null> {
    if (!slug) {
      return null;
    }

    const problemData = await getProblemBySlug(slug);
    if (!problemData) return null;

    const problem = new TechnicalProblem({
      id: problemData.id,
      type: problemData.type,
      title: problemData.title,
      description: problemData.description,
      difficulty: problemData.difficulty,
      hint: problemData.hint || undefined,
      slug: problemData.slug,
    });
    return problem;
  }

  /**
   * Saves the current problem to the database.
   * Description and hint fields are truncated to 2048 characters before saving.
   *
   * @returns Promise that resolves when the save operation is complete
   * @throws Logs error to console if save operation fails
   */
  async save(): Promise<void> {
    const { data, error } = await createProblem({
      title: this.title,
      slug: this.slug,
      description: this.description.slice(0, 2048), // LIMIT DESCRIPTION TO 2048
      difficulty: this.difficulty,
      type: this.type,
      hint: this.hint?.slice(0, 2048), // LIMIT HINT TO 2048
    });

    if (error || !data) {
      console.error("Error saving problem:", error);
    }
  }
}
