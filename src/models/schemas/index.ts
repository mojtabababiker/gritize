import { SkillLevel } from "../types/indext";

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
  skillLevel: SkillLevel;
  avatar?: string;
  onboarding?: boolean;
  isNewUser?: boolean;
  totalSolvedProblems?: number;
  generalAlgorithms?: Record<string, UserProblemSchema>;
  codingPatterns?: Record<string, CodingPatternSchema>;
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
