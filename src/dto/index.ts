export interface ProgramDto {
  algorithms?: string[];
  codingPatterns?: {
    title: string;
    totalProblems: number;
    info: string;
    problems: string[];
  }[];
}
