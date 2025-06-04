export interface Question {
  type: "singleChoice" | "multipleChoice" | "TOF";
  question: string;
  options?: string[];
  answer?: string | string[] | boolean;
  userAnswer?: string | string[] | boolean;
}
export interface Quiz {
  id: string;
  language: string;
  questionsCount: number;
  questions: Question[];
}
