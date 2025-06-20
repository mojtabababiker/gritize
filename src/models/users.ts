import {
  loginUser,
  logoutUser,
  registerUser,
} from "@/utils/appwrite/auth-action";
import {
  createCodingTechnique,
  createProblemSolution,
  createUser,
  createUserProblem,
  getProblemSolution,
  getUserById,
  listCodingPatternsById,
  listProblemSolutions,
  listUserProblemsById,
  listUserQuizzes,
  saveUserQuiz,
  updateCodingPattern,
  updateUser,
  updateUserProblem,
} from "@/utils/appwrite/database-actions";

import { Languages, SkillLevel } from "./types/indext";
import { CodingPatternSchema, UserProblemSchema, UserSchema } from "./schemas";
import {
  CodingPatternDTO,
  ProblemSolutionDTO,
  UserDTO,
  UserQuizDTO,
} from "./dto/user-dto";
import {
  deleteImage,
  uploadImage,
} from "@/utils/form-actions/profileImage-actions";

/**
 * User class
 * @class User
 * @description a class for the user model that contains user information, and abstracts all the operations on the user model.
 */
export class User {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  skillLevel?: SkillLevel;
  preferredLanguage?: Languages;
  onboarding?: boolean;
  isNewUser?: boolean;
  totalSolvedProblems?: number;
  quizzes: string[];

  mustReview?: boolean;
  hasReviewed?: boolean;
  lastAskedReview?: string;

  /**
   * general algorithms and coding patterns are a private property that
   * contains the general algorithms and coding pattern problems for the user
   * in a form of key-value pair, where
   * the key is the problem/coding-technique ID and the value is the
   * UserProblem/CodingPattern instance.
   *
   * to access or manipulate the general algorithms and coding patterns,
   * use the getter and setter methods.
   *
   * Typically those are getting filled by the AI Assistant when first
   * registered.
   */
  private generalAlgorithms: Record<string, UserProblemSchema> = {};
  private codingPatterns: Record<string, CodingPatternSchema> = {};

  constructor({
    id,
    name,
    email,
    avatar,
    skillLevel = undefined,
    preferredLanguage = undefined,
    onboarding = false,
    isNewUser = true,
    totalSolvedProblems = 0,
    quizzes = [],

    hasReviewed,
    mustReview,
    lastAskedReview,
  }: UserSchema) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.skillLevel = skillLevel;
    this.preferredLanguage = preferredLanguage;
    this.onboarding = onboarding;
    this.isNewUser = isNewUser;
    this.totalSolvedProblems = totalSolvedProblems;
    this.quizzes = quizzes;

    this.hasReviewed = hasReviewed;
    this.mustReview = mustReview;
    this.lastAskedReview = lastAskedReview;
  }

  /**
   * Authenticate and login the user, get the user information from the backend and return a User instance.
   * @param {string} email - the email of the user
   * @param {string} password - the password of the user
   * @throws {Error} when the email or password is invalid
   * @throws {Error} when the user is not found
   * @returns {Promise<User>} the user information
   */
  static async login(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    // call the backend login service action
    const { data: userAccount, error } = await loginUser(email, password);
    // if the login fails, throw an error
    if (error) {
      throw error;
    }
    const userData = await getUserById(userAccount.id);
    // if the user is not found, throw an error
    if (!userData) {
      throw new Error("User not found.");
    }

    // return a new User instance with the user information
    return await User.fromJson({
      ...userData,
      name: userAccount.name,
      email: userAccount.email,
    });
  }

  /**
   * Logout the user, remove the session cookie.
   * @throws {Error} when the logout fails
   * @returns {Promise<void>} void
   */
  async logout(): Promise<void> {
    try {
      // call the backend logout service action
      await logoutUser();
      // reset the user object

      this.id = undefined;
      this.name = "";
      this.email = "";
      this.avatar = undefined;
      this.skillLevel = undefined;
      this.preferredLanguage = undefined;
      this.onboarding = false;
      this.totalSolvedProblems = 0;
      this.generalAlgorithms = {};
      this.codingPatterns = {};
      this.quizzes = [];
      this.isNewUser = true;
      this.mustReview = undefined;
      this.hasReviewed = undefined;
      this.lastAskedReview = undefined;
    } catch (error) {
      // console.error("Logout failed", error);
      throw error;
    }
  }

  /**
   * Register a new user, create a new user in the backend with the default/defined values and return a User instance.
   * @param {string} email - the email of the user
   * @param {string} password - the password of the user
   * @throws {Error} when the email or password is invalid
   * @throws {Error} when the user already exists
   * @returns {Promise<User>} the user information
   */
  async register(
    email: string,
    password: string,
    username: string
  ): Promise<User> {
    // call the backend register service action
    const { data: userId, error: authError } = await registerUser(
      email,
      password,
      username
    );

    if (authError) {
      // console.error("Registration failed", authError);
      throw authError;
    }

    this.id = userId ?? undefined;
    this.name = username;
    this.email = email;
    this.isNewUser = true;

    const { data: user, error: dbError } = await createUser(this.json);

    if (dbError || !user) {
      // console.error("Database error during user registration", dbError);
      // console.error("User ID: ", this.id);
      throw new Error("User registration failed.");
    }

    // return await User.fromJson(user);
    return new User({
      ...user,
      skillLevel: user.skillLevel || undefined,
      name: this.name,
      email: this.email,
      generalAlgorithms: {},
      codingPatterns: {},
    });
  }

  /**
   * Creates a User instance from JSON data.
   * @param data - The user data transfer object containing user information.
   * @returns A Promise that resolves to a new User instance populated with the provided data.
   *
   * The method performs the following:
   * - Initializes a new User with basic properties from the DTO
   * - Fetches and assigns associated general algorithm problems
   * - Fetches and assigns associated coding patterns
   *
   * Default values are provided for:
   * - skillLevel (defaults to "mid-level")
   * - onboarding (defaults to false)
   * - totalSolvedProblems (defaults to 0)
   * - isNewUser (defaults to false)
   */
  static async fromJson(data: UserDTO): Promise<User> {
    // console.log("\n\nUser data from JSON", data, "\n\n");

    const user = new User({
      id: data.id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      skillLevel: data.skillLevel || undefined,
      preferredLanguage: data.preferredLanguage || undefined,
      onboarding: data.onboarding || false,
      totalSolvedProblems: data.totalSolvedProblems || 0,
      quizzes: data.quizzes || [],
      isNewUser: data.isNewUser || false,
      mustReview: data.mustReview,
      hasReviewed: data.hasReviewed,
      lastAskedReview: data.lastAskedReview,
    });

    const userProblems = await listUserProblemsById(data.generalAlgorithms);
    userProblems.forEach((problem) => {
      user.generalAlgorithms[problem.id] = problem;
    });
    const codingPatterns = await listCodingPatternsById(data.codingPatterns);
    codingPatterns.forEach((pattern) => {
      user.codingPatterns[pattern.id] = pattern;
    });
    return user;
  }

  /**
   * Converts the User instance to a Data Transfer Object (DTO)
   * @returns {UserDTO} A plain object containing user data with the following properties:
   * - id: User's unique identifier
   * - name: User's full name
   * - email: User's email address
   * - skillLevel: User's current skill level
   * - avatar: URL to user's avatar image
   * - onboarding: User's onboarding status
   * - isNewUser: Boolean indicating if user is new
   * - totalSolvedProblems: Number of problems solved by user
   * - generalAlgorithms: Array of user's general algorithm ids
   * - codingPatterns: Array of user's coding pattern ids
   */
  get json(): UserDTO {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      avatar: this.avatar,
      skillLevel: this.skillLevel || null,
      preferredLanguage: this.preferredLanguage,
      onboarding: this.onboarding,
      isNewUser: this.isNewUser,
      totalSolvedProblems: this.totalSolvedProblems,
      generalAlgorithms: Object.keys(this.generalAlgorithms),
      codingPatterns: Object.keys(this.codingPatterns),
      quizzes: this.quizzes,

      mustReview: this.mustReview,
      hasReviewed: this.hasReviewed,
      lastAskedReview: this.lastAskedReview,
    };
  }

  /**
   * Gets a list of algorithm problems associated with the user.
   * @returns {UserProblemSchema[]} An array of user algorithm problems
   */
  get algorithmProblems(): UserProblemSchema[] {
    return Object.values(this.generalAlgorithms);
  }

  /**
   * Associates a list of algorithm problems with the user.
   * For each problem ID in the input array, creates a user-problem relationship
   * and stores it in the generalAlgorithms map.
   *
   * @param problems - Array of problem IDs to associate with the user
   * @returns Promise<string[]> - A promise that resolves to an array of created user problem IDs
   *
   * @remarks
   * - Silently skips if problems array is empty or user ID is not set
   * - Continues execution even if individual problem creation fails
   * - Failed problem creations are logged to console.error
   */
  async setAlgorithmProblems(problems: string[]): Promise<string[]> {
    // this.generalAlgorithms = value;
    const createdIds: string[] = [];
    if (!problems || !problems.length || !this.id) {
      return createdIds;
    }

    for (const problemId of problems) {
      const { data: userProblem, error } = await createUserProblem(
        this.id,
        problemId
      );
      if (error || !userProblem?.id) {
        // console.error("Error creating user problem", error);
        continue;
      }
      // console.log("User problem created", userProblem.id);
      this.generalAlgorithms[userProblem.id] = userProblem;
      createdIds.push(userProblem.id);
    }
    return createdIds;
  }

  /**
   * Retrieves an algorithm problem from the user's general algorithms by its ID
   * @param id - The unique identifier of the algorithm problem
   * @returns The algorithm problem matching the ID, or null if not found
   */
  getAlgorithmProblem(id: string): UserProblemSchema | null {
    const problem = this.generalAlgorithms[id] || null;
    return problem;
  }

  get codingTechniques(): CodingPatternSchema[] {
    return Object.values(this.codingPatterns);
  }

  /**
   * Sets coding techniques/patterns for the user
   * @param codingPatterns - Array of coding pattern data transfer objects to be associated with the user
   * @returns {Promise<void>} - Returns void if successful, continues to next pattern if error occurs
   * @remarks
   * - Requires user id to be set
   * - Skips if codingPatterns array is empty or undefined
   * - Creates coding techniques one by one and stores them in the user's codingPatterns map
   * - Continues to next pattern if error occurs during creation
   */
  async setCodingTechniques(codingPattern: CodingPatternDTO): Promise<void> {
    if (!codingPattern || !this.id) {
      return;
    }

    const { data: userCodingPattern, error } = await createCodingTechnique(
      this.id,
      codingPattern
    );
    if (error || !userCodingPattern?.id) {
      // console.error("Error creating user coding pattern", error);
      return;
    }
    // console.log("User coding pattern created", userCodingPattern.id);
    this.codingPatterns[userCodingPattern.id] = userCodingPattern;
    // this.codingPatterns = value;
  }

  getCodingTechnique(id: string): CodingPatternSchema | null {
    const codingPattern = this.codingPatterns[id] || null;
    return codingPattern;
  }

  getCodingTechniqueProblems(techniqueId: string): UserProblemSchema[] | null {
    const codingPattern = this.codingPatterns[techniqueId] || null;
    return codingPattern?.problems || null;
  }

  /**
   * Retrieves a specific problem from a coding pattern in the user's data
   * @param patternId - The unique identifier of the coding pattern
   * @param problemId - The unique identifier of the problem to find
   * @returns The matching problem data if found, null otherwise
   */
  getCodingPatternProblem(
    patternId: string,
    problemId: string
  ): UserProblemSchema | null {
    const codingPattern = this.codingPatterns[patternId] || null;
    if (!codingPattern) {
      return null;
    }
    const problem = codingPattern.problems.find(
      (problem) => problem.id === problemId
    );
    return problem || null;
  }

  getProblemAfter(
    problemId: string,
    codingPatternId: string | null = null
  ): UserProblemSchema | null {
    if (codingPatternId) {
      const codingPattern = this.codingPatterns[codingPatternId];
      if (!codingPattern) {
        return null;
      }
      const problemIndex = codingPattern.problems.findIndex(
        (problem) => problem.id === problemId
      );
      if (
        problemIndex === -1 ||
        problemIndex + 1 >= codingPattern.problems.length
      ) {
        return null;
      }
      return codingPattern.problems[problemIndex + 1];
    } else {
      const problemIndex = this.algorithmProblems.findIndex(
        (problem) => problem.id === problemId
      );
      if (
        problemIndex === -1 ||
        problemIndex + 1 >= this.algorithmProblems.length
      ) {
        return null;
      }
      return this.algorithmProblems[problemIndex + 1];
    }
  }

  /**
   * Updates a problem for the current user and manages related coding pattern statistics
   * @param problemId - The ID of the problem to update
   * @param data - The problem data to update, excluding 'problem' and 'id' fields
   * @param codingPatternId - Optional ID of the associated coding pattern
   * @param isFirstSubmission - Optional flag indicating if this is the first submission for this problem
   * @returns A promise containing either the updated problem data or an error
   *
   * @remarks
   * - If the user is not logged in, an error is returned
   * - If the coding pattern ID is provided, the corresponding coding pattern is updated
   * - If the coding pattern ID is not provided, the problem is updated in the general algorithms
   * - If the coding pattern is updated, the number of solved problems is incremented (only if it's the first submission)
   * - If the coding pattern is not found, an error is returned
   */
  async updateProblem(
    problemId: string,
    data: Omit<UserProblemSchema, "problem" | "id">,
    codingPatternId: string | null = null,
    isFirstSubmission: boolean = false
  ): Promise<{ data: UserProblemSchema | null; error: unknown }> {
    if (!this.id) {
      return { error: "User not logged in", data: null };
    }
    const { error, data: updateProblem } = await updateUserProblem(
      this.id || "",
      problemId,
      data
    );
    if (error) {
      return { error, data: null };
    }
    if (codingPatternId) {
      const codingPattern = this.codingPatterns[codingPatternId];
      if (!codingPattern) {
        return { error: "Coding pattern not found", data: null };
      }

      if (isFirstSubmission) {
        codingPattern.solvedProblems++;
        const { error } = await updateCodingPattern(codingPatternId, {
          solvedProblems: codingPattern.solvedProblems,
        });
        if (error) {
          // console.error(error);
          codingPattern.solvedProblems--;
          return { error, data: null };
        }
      }
    }

    // update user total solved problems
    if (isFirstSubmission) {
      this.totalSolvedProblems = (this.totalSolvedProblems || 0) + 1;
      const { error } = await updateUser(this.id, {
        totalSolvedProblems: this.totalSolvedProblems,
      });
      if (error) {
        // console.error("Error updating user total solved problems", error);
        this.totalSolvedProblems--;
        return { error, data: null };
      }
    }
    return { data: updateProblem, error: null };
  }

  /**
   * Submits a solution for a programming problem.
   *
   * @param problemId - The unique identifier of the problem being solved
   * @param solution - The submitted solution code
   * @param score - The score achieved for the solution
   * @param language - The programming language used for the solution
   * @param time - The execution time of the solution
   *
   * @returns A promise that resolves to an object containing either:
   * - data: The created solution data if successful
   * - error: Error message if submission fails or user is not logged in
   *
   * @throws Will return an error object if user is not logged in (no this.id)
   */
  async submitSolution({
    problemId,
    solution,
    score,
    language,
    time,
  }: {
    problemId: string;
    solution: string;
    score: number;
    language: Languages;
    time: number;
  }) {
    if (!this.id) {
      // console.error("Login to submit solution");
      return { error: "Login to submit solution" };
    }

    const { error, data } = await createProblemSolution({
      userId: this.id,
      problemId,
      solution,
      score,
      language,
      time,
    });

    return { data, error };
  }

  /**
   * Retrieves the user's most recent solution for a specific problem.
   * @param problemId - The unique identifier of the user problem to fetch the solution for
   * @returns A Promise that resolves to either a ProblemSolutionDTO object containing the solution,
   * or null if the user is not logged in or no solution exists
   */
  async getLastSolution(problemId: string): Promise<ProblemSolutionDTO | null> {
    if (!this.id) {
      // console.error("Login to get last solution");
      return null;
    }
    const solution = await getProblemSolution(
      this.id,
      problemId,
      this.preferredLanguage || "javascript"
    );

    if (!solution) {
      return null;
    }
    return solution;
  }

  /**
   * Retrieves all solutions for a specific problem
   * @param problemId - The unique identifier of the user problem to get solutions for
   * @returns Promise that resolves to an array of solutions if successful, null otherwise
   */
  async getProblemSolutions(problemId: string) {
    if (!this.id) {
      // console.error("Login to get problem solutions");
      return null;
    }
    const solutions = await listProblemSolutions(this.id, problemId);
    if (!solutions) {
      return null;
    }
    return solutions;
  }

  /**
   * Saves a user quiz and adds it to the user's quiz collection.
   *
   * @param quiz - The quiz data to be saved
   * @returns A promise that resolves to an object containing either an error message or the saved quiz ID
   *
   * @remarks
   * - Requires the user to be logged in (user must have an ID)
   * - On successful save, the quiz ID is automatically added to the user's quizzes array
   *
   * @example
   * ```typescript
   * const result = await user.saveQuiz(quizData);
   * if (result.error) {
   *   console.error(result.error);
   * } else {
   *   console.log('Quiz saved with ID:', result.data);
   * }
   * ```
   */
  async saveQuiz(
    quiz: UserQuizDTO
  ): Promise<{ error: string | null; data: string | null }> {
    if (!this.id) {
      // console.error("Login to save quiz");
      return { error: "Login to save quiz", data: null };
    }

    const { error, data: quizId } = await saveUserQuiz(quiz);

    if (error || !quizId) {
      // console.error("Error saving quiz", error);
      return { error, data: null };
    }
    // console.log("Quiz saved successfully", quizId);
    this.quizzes.push(quizId);

    return { error: null, data: quizId };
  }

  /**
   * Retrieves all quizzes taken by the user.
   * @returns A Promise that resolves to an array of UserQuizDTO objects representing the user's quizzes.
   *          Returns an empty array if no quizzes are found or if the user is not logged in.
   */
  async getQuizzes(): Promise<UserQuizDTO[]> {
    if (!this.id) {
      // console.error("Login to get quizzes");
      return [];
    }
    const { error, data: quizzes } = await listUserQuizzes(this.id);
    if (error || !quizzes) {
      // console.error("No quizzes found for user", this.id);
      return [];
    }
    return quizzes;
  }

  /**
   * Uploads a new avatar image for the user and updates their profile.
   * If an existing avatar exists, it will be deleted before the new one is saved.
   *
   * @param file - The image file to upload as the new avatar
   * @returns A promise that resolves to an object containing either:
   *          - On success: {error: null, url: string} where url is the uploaded image URL
   *          - On failure: {error: string, url: null} where error contains the error message
   * @throws {Error} If user is not logged in (no ID present)
   */
  async uploadAvatar(
    file: Blob
  ): Promise<{ error: string | null; url: string | null }> {
    if (!this.id) {
      // console.error("Login to upload avatar");
      return { error: "Login to upload avatar", url: null };
    }
    const { error, data } = await uploadImage(this.id, file);
    if (error || !data) {
      // console.error("Error uploading avatar", error);
      // console.error("Error uploading avatar", data);
      return { error, url: null };
    }
    // delete the old image
    if (this.avatar) {
      await deleteImage(this.avatar);
    }
    this.avatar = data;
    await this.save();
    return { error: null, url: data };
  }

  async save(): Promise<void> {
    // call the backend service action with the serialized user information
    // if the save fails, throw an error
    if (!this.id) {
      // console.error("Login to save user data");
      throw new Error("Login to save user data");
    }
    const { error } = await updateUser(this.id, this.json);
    if (error) {
      // console.error("Error saving user data", error);
      throw new Error("Error saving user data");
    }
  }
}
