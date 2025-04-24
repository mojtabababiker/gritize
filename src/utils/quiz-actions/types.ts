export type Question = {
  type: "singleChoice" | "multipleChoice" | "TOF";
  question: string;
  options?: string[];
  answer?: string | string[];
};
export type Quiz = {
  id: number;
  questions: Question[];
};
