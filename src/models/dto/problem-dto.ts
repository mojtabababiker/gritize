import { TechnicalProblemSchema } from "../schemas";

export type TechnicalProblemDTO = Omit<TechnicalProblemSchema, "id">;
