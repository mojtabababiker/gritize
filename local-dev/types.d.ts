// general Appwrite attributes types
import {
  UserDTO,
  UserProblemDTO,
  CodingPatternDTO,
  ProblemSolutionDTO,
  UserQuizDTO,
} from "../src/models/dto/user-dto";
import { TechnicalProblemDTO as ProblemDTO } from "../src/models/dto/problem-dto";
import { Quiz as QuizDTO } from "../src/models/dto/quiz-dto";
import { TestimonialDTO } from "../src/models/dto/testimonial-dto";

export type AttributeType =
  | "string"
  | "integer"
  | "float"
  | "boolean"
  | "dateTime"
  | "email"
  | "ip"
  | "url"
  | "enum";

export type CollectionAttributes<T, K extends keyof Omit<T, "id">> = Record<
  K,
  {
    [key: string]: any;
    type: AttributeType;
    required: boolean;
    array: boolean;
  }
>;

export type UserCollection<K extends keyof Omit<UserDTO, "id">> =
  CollectionAttributes<UserDTO, K>;

export type ProblemCollection<K extends keyof Omit<ProblemDTO, "id">> =
  CollectionAttributes<ProblemDTO, K>;

export type CodingTechniquesCollection<
  K extends keyof Omit<CodingPatternDTO, "id">
> = CollectionAttributes<CodingPatternDTO, K>;

export type QuizCollection<K extends keyof Omit<QuizDTO, "id">> =
  CollectionAttributes<QuizDTO, K>;

export type ProblemSolutionCollection<
  K extends keyof Omit<ProblemSolutionDTO, "id">
> = CollectionAttributes<ProblemSolutionDTO, K>;

export type TestimonialCollection<K extends keyof Omit<TestimonialDTO, "id">> =
  CollectionAttributes<TestimonialDTO, K>;

export type UserProblemCollection<K extends keyof Omit<UserProblemDTO, "id">> =
  CollectionAttributes<UserProblemDTO, K>;

export type UserQuizzesCollection<
  K extends keyof Omit<UserQuizDTO, "id" | "$createdAt">
> = CollectionAttributes<UserQuizDTO, K>;
