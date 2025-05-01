export interface ProgramDto {
  algorithms: string[];
  codingPatterns: {
    patternName: string;
    totalProblems: number;
    info: string;
    problems: string[];
  }[];
}
