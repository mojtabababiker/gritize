import {
  loginUser,
  logoutUser,
  registerUser,
} from "@/utils/appwrite/auth-action";
import {
  createCodingTechnique,
  createUser,
  createUserProblem,
  getUserById,
  listCodingPatternsById,
  listUserProblemsById,
} from "@/utils/appwrite/database-actions";

import { SkillLevel } from "./types/indext";
import { CodingPatternSchema, UserProblemSchema, UserSchema } from "./schemas";
import { CodingPatternDTO, UserDTO } from "./dto/user-dto";

/**
 * User class
 * @class User
 * @description a class for the user model that contains user information, and abstracts all the operations on the user model.
 */
export class User {
  id?: string;
  name: string;
  email: string;
  skillLevel: SkillLevel;
  avatar?: string;
  onboarding?: boolean;
  isNewUser?: boolean;
  totalSolvedProblems?: number;

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
    skillLevel = "mid-level",
    onboarding = false,
    isNewUser = true,
    totalSolvedProblems = 0,
  }: UserSchema) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.skillLevel = skillLevel;
    this.avatar = avatar;
    this.onboarding = onboarding;
    this.isNewUser = isNewUser;
    this.totalSolvedProblems = totalSolvedProblems;
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
      this.skillLevel = "mid-level";
      this.avatar = undefined;
      this.onboarding = false;
      this.totalSolvedProblems = 0;
      this.generalAlgorithms = {};
      this.codingPatterns = {};
    } catch (error) {
      console.error("Logout failed", error);
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
      console.error("Registration failed", authError);
      throw authError;
    }

    this.id = userId ?? undefined;
    this.name = username;
    this.isNewUser = true;

    const { data: user, error: dbError } = await createUser(this.json);

    if (dbError) {
      console.error("Database error during user registration", dbError);
      throw new Error("User registration failed.");
    }

    // return await User.fromJson(user);
    return new User({ ...user, generalAlgorithms: {}, codingPatterns: {} });
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
      skillLevel: data.skillLevel || "mid-level",
      avatar: data.avatar,
      onboarding: data.onboarding || false,
      totalSolvedProblems: data.totalSolvedProblems || 0,
      isNewUser: data.isNewUser || false,
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
      skillLevel: this.skillLevel,
      avatar: this.avatar,
      onboarding: this.onboarding,
      isNewUser: this.isNewUser,
      totalSolvedProblems: this.totalSolvedProblems,
      generalAlgorithms: Object.keys(this.generalAlgorithms),
      codingPatterns: Object.keys(this.codingPatterns),
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
   * @returns Promise<void>
   *
   * @remarks
   * - Silently skips if problems array is empty or user ID is not set
   * - Continues execution even if individual problem creation fails
   * - Failed problem creations are logged to console.error
   */
  async setAlgorithmProblems(problems: string[]): Promise<void> {
    // this.generalAlgorithms = value;
    if (!problems || !problems.length || !this.id) {
      return;
    }

    for (const problemId of problems) {
      const { data: userProblem, error } = await createUserProblem(
        this.id,
        problemId
      );
      if (error || !userProblem?.id) {
        console.error("Error creating user problem", error);
        continue;
      }
      // console.log("User problem created", userProblem.id);
      this.generalAlgorithms[userProblem.id] = userProblem;
    }
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

  updateAlgorithmProblem(id: string, problem: UserProblemSchema): void {
    if (this.generalAlgorithms[id]) {
      this.generalAlgorithms[id] = problem;
    }
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
  async setCodingTechniques(codingPatterns: CodingPatternDTO[]): Promise<void> {
    if (!codingPatterns || !codingPatterns.length || !this.id) {
      return;
    }

    for (const codingPattern of codingPatterns) {
      const { data: userCodingPattern, error } = await createCodingTechnique(
        this.id,
        codingPattern
      );
      if (error || !userCodingPattern) {
        console.error("Error creating user coding pattern", error);
        continue;
      }
      // console.log("User coding pattern created", userCodingPattern.id);
      this.codingPatterns[userCodingPattern.id] = userCodingPattern;
    }
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

  updateCodingTechniqueProblem(
    techniqueId: string,
    problemId: string,
    problem: UserProblemSchema
  ): void {
    const codingPattern = this.codingPatterns[techniqueId] || null;
    if (codingPattern) {
      const problemIndex = codingPattern.problems.findIndex(
        (p) => p.id === problemId
      );
      if (problemIndex !== -1) {
        codingPattern.problems[problemIndex] = problem;
      }
    }
  }

  async save(): Promise<void> {
    // call the backend service action with the serialized user information
    // if the save fails, throw an error
  }
}
