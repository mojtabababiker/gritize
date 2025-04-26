import { UserProblemSchema, CodingPatternSchema } from "../schemas";
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
