import { redirect } from "next/navigation";
import { SkillLevel } from "./types/indext";
import { CodingPatternSchema, UserProblemSchema, UserSchema } from "./schemas";
import { loginUser, logoutUser } from "@/utils/appwrite/auth-action";
import { getUserById } from "@/utils/appwrite/database-action";

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
    totalSolvedProblems = 0,
  }: UserSchema) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.skillLevel = skillLevel;
    this.avatar = avatar;
    this.onboarding = onboarding;
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
    const { data: userId, error } = await loginUser(email, password);
    // if the login fails, throw an error
    if (error) {
      throw error;
    }
    const userData = await getUserById(userId);
    // if the user is not found, throw an error
    if (!userData) {
      throw new Error("User not found.");
    }

    // return a new User instance with the user information
    return User.fromJson(userData);
  }

  /**
   * Logout the user, remove the session cookie and redirect to the home page.
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

      // redirect to home page
      redirect("/");
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
  static async register(email: string, password: string): Promise<User> {
    // call the backend register service action
    return new User({
      id: "123",
      name: "John Doe",
      email,
      skillLevel: "junior",
      avatar: "https://example.com/avatar.jpg",
    });
  }

  /**
   * Create a new User instance from the user information json object.
   * @param {UserSchema} data - the user information
   * @returns {User} the User instance
   */
  static fromJson(data: UserSchema): User {
    const user = new User({
      id: data.id,
      name: data.name,
      email: data.email,
      skillLevel: data.skillLevel || "mid-level",
      avatar: data.avatar,
      onboarding: data.onboarding || false,
      totalSolvedProblems: data.totalSolvedProblems || 0,
    });
    user.algorithmProblems = data.generalAlgorithms || {};
    user.codingPatterns = data.codingPatterns || {};
    return user;
  }

  public get algorithmProblems(): UserProblemSchema[] {
    return Object.values(this.generalAlgorithms);
  }
  public set algorithmProblems(value: Record<string, UserProblemSchema>) {
    this.generalAlgorithms = value;
  }

  public getAlgorithmProblem(id: string): UserProblemSchema | null {
    const problem = this.generalAlgorithms[id] || null;
    return problem;
  }

  public updateAlgorithmProblem(id: string, problem: UserProblemSchema): void {
    if (this.generalAlgorithms[id]) {
      this.generalAlgorithms[id] = problem;
    }
  }

  public get codingTechniques(): CodingPatternSchema[] {
    return Object.values(this.codingPatterns);
  }

  public set codingTechniques(value: Record<string, CodingPatternSchema>) {
    this.codingPatterns = value;
  }

  public getCodingTechnique(id: string): CodingPatternSchema | null {
    const codingPattern = this.codingPatterns[id] || null;
    return codingPattern;
  }

  public getCodingTechniqueProblems(
    techniqueId: string
  ): UserProblemSchema[] | null {
    const codingPattern = this.codingPatterns[techniqueId] || null;
    return codingPattern?.problems || null;
  }

  public updateCodingTechniqueProblem(
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
