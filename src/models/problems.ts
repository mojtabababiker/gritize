import { TechnicalProblemSchema } from "./schemas";

/**
 * TechnicalProblem class
 * @class TechnicalProblem
 * @description a class for the technical problem model that contains technical
 * problem information, and abstracts all the operations on the technical
 * problem model including creating, retrieving, and saving problems.
 */
export class TechnicalProblem {
  id: string;
  title: string;
  difficulty: "easy" | "mid" | "advanced";
  description: string;
  type: "algorithm" | "coding-pattern";
  hint?: string;
  // tags: string[];

  constructor({
    id,
    type,
    title,
    description,
    difficulty,
    hint,
  }: TechnicalProblemSchema) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.difficulty = difficulty;

    this.type = type;
    this.hint = hint;
  }

  static async fromJson(
    data: TechnicalProblemSchema
  ): Promise<TechnicalProblem> {
    const problem = new TechnicalProblem({
      id: data.id,
      type: data.type,
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      hint: data.hint || undefined,
    });
    await problem.save();
    return problem;
  }

  static async fromJsonArray(
    data: TechnicalProblemSchema[]
  ): Promise<TechnicalProblem[]> {
    const problems = await Promise.all(
      data.map((problem) => TechnicalProblem.fromJson(problem))
    );
    return problems;
  }

  static async getByTitle(title: string): Promise<TechnicalProblem | null> {
    // call the backend to get the problem by title
    // if the problem is not found, return null
    // else construct a new TechnicalProblem instance and return it
    return null;
  }

  async save(): Promise<void> {}
}
