import {
  UserProblemSchema,
  CodingPatternSchema,
  TechnicalProblemSchema,
} from "../schemas";
import { SkillLevel } from "../types/indext";

export interface UserDTO {
  id?: string;
  name: string;
  email: string;
  skillLevel: SkillLevel;
  avatar?: string;
  onboarding?: boolean;
  isNewUser?: boolean;
  totalSolvedProblems?: number;
  generalAlgorithms: UserProblemSchema[];
  codingPatterns: CodingPatternSchema[];
}

export interface UserProblemDTO {
  id: string;
  problem: TechnicalProblemSchema;
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
