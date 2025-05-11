import { Languages, SkillLevel } from "../types/indext";

export interface UserDTO {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  skillLevel: SkillLevel;
  preferredLanguage?: Languages;
  onboarding?: boolean;
  isNewUser?: boolean;
  totalSolvedProblems?: number;
  generalAlgorithms: string[];
  codingPatterns: string[];
}

export interface UserProblemDTO {
  id: string;
  problemId: string;
  solved: boolean;
  score: number;
}

export interface CodingPatternDTO {
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
