import { z } from "zod";
import { Languages, SkillLevel } from "../types/indext";

export interface TechnicalProblemSchema {
  id?: string;
  type: "algorithm" | "coding-pattern";
  title: string;
  difficulty: "easy" | "mid" | "advanced";
  description: string;
  hint?: string;
  slug: string;
}

export interface UserSchema {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  skillLevel?: SkillLevel;
  preferredLanguage?: Languages;
  onboarding?: boolean;
  isNewUser?: boolean;
  totalSolvedProblems?: number;
  generalAlgorithms?: Record<string, UserProblemSchema>;
  codingPatterns?: Record<string, CodingPatternSchema>;

  mustReview?: boolean;
  hasReviewed?: boolean;
  lastAskedReview?: string;
}

export interface UserProblemSchema {
  id: string;
  problem: TechnicalProblemSchema;
  solved: boolean;
  score: number;
}

export interface CodingPatternSchema {
  id: string;
  title: string;
  info: string;
  problems: UserProblemSchema[];
  totalProblems: number;
  solvedProblems: number;
}

export interface TestimonialSchema {
  avatar?: string;
  name: string;
  userTitle: string;
  review: string;
  rating: number;
}

export const QuizSchema = z.object({
  id: z.string().optional(),
  questions: z.array(
    z.object({
      type: z.enum(["singleChoice", "multipleChoice", "TOF"]),
      question: z.string(),
      options: z.array(z.string()).optional(),
      answer: z.union([z.string(), z.array(z.string())]).optional(),
      userAnswer: z
        .union([z.string(), z.array(z.string()), z.boolean()])
        .optional(),
    })
  ),
  questionsCount: z.number(),
  language: z.string(),
});
