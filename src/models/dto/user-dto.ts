import { Languages, SkillLevel } from "../types/indext";
import { Quiz } from "./quiz-dto";

export interface UserDTO {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  skillLevel: SkillLevel | null;
  preferredLanguage?: Languages;
  onboarding?: boolean;
  isNewUser?: boolean;
  totalSolvedProblems?: number;
  generalAlgorithms: string[];
  codingPatterns: string[];
  quizzes: string[];

  mustReview?: boolean;
  hasReviewed?: boolean;
  lastAskedReview?: string;
}

export interface UserProblemDTO {
  id: string;
  solved: boolean;
  score: number;
  userId: string;
  problemId: string;
  solutions?: string[];
}

export interface CodingPatternDTO {
  userId?: string;
  title: string;
  info: string;
  problems: string[];
  totalProblems: number;
  solvedProblems?: number;
}

export interface ProblemSolutionDTO {
  id: string;
  userId: string;
  problemId: string;
  solution: string;
  score: number;
  language: Languages;
  time: number;
  $createdAt?: string;
}

export interface UserQuizDTO extends Quiz {
  userId: string;
  score: number;
  skillLevel: SkillLevel;
  $createdAt?: string;
}
