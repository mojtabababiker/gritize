import { Dispatch, useRef, useState } from "react";

import { z } from "zod";
import { experimental_useObject as useObject } from "@ai-sdk/react";

import { User } from "@/models/users";
import { ProgramDto } from "@/dto";

type Program = {
  program?: ProgramDto;
  error?: Error;
};

type UseProgramGeneratorProps = {
  programType: "algorithms" | "coding-patterns";
  user: User | null;
  onComplete: () => void | Promise<void>;
  onError: (message: string) => void;
  onStatusChange: Dispatch<React.SetStateAction<string>>;
};

/**
 * Custom hook for generating and managing user programs (algorithms or coding patterns).
 *
 * @param options - Configuration options for the program generator
 * @param options.onComplete - Callback function to execute when program generation is complete
 * @param options.onError - Callback function to handle error messages
 * @param options.onStatusChange - Callback function to handle status message updates
 * @param options.programType - Type of program to generate ('algorithms' or 'coding-patterns')
 * @param options.user - User object containing profile and program data
 *
 * @returns Object containing:
 * - createProgram: Function to initiate program generation
 * - isLoading: Boolean indicating if program generation is in progress
 * - error: Any error that occurred during generation
 * - setIsLoading: Function to manually update loading state
 * - onError: Function to handle errors
 * - onStatusChange: Function to update status messages
 *
 * @remarks
 * This hook manages the entire lifecycle of program generation including:
 * - Validation of user state and program type
 * - Status message rotation during generation
 * - Error handling and timeout management
 * - Program data validation and storage
 *
 * The generation process includes automatic status updates every 6 seconds and
 * will show a delayed message if generation takes longer than 45 seconds.
 *
 * @example
 * ```typescript
 * const {
 *   createProgram,
 *   isLoading,
 *   error
 * } = useProgramGenerator({
 *   onComplete: () => console.log('Done'),
 *   onError: (msg) => console.error(msg),
 *   onStatusChange: (status) => console.log(status),
 *   programType: 'algorithms',
 *   user: currentUser
 * });
 * ```
 */
export function useProgramGenerator({
  onComplete,
  onError,
  onStatusChange,
  programType,
  user,
}: UseProgramGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const creationMessageInterval = useRef<NodeJS.Timeout | null>(null);
  const creationCompletedTimeout = useRef<NodeJS.Timeout | null>(null);

  // ==================================
  //              Utils
  // ==================================

  /**
   * Saves a generated program to the user's data.
   * @param program - The program object containing algorithms or coding patterns data
   * @returns Promise that resolves when the save operation is complete
   *
   * This function:
   * 1. Validates the user is initialized
   * 2. Clears any existing completion timeouts
   * 3. Validates program data exists and has no errors
   * 4. Based on programType ('coding-patterns' or 'algorithms'):
   *    - Validates coding patterns have required fields (title, totalProblems, problems)
   *    - Validates algorithms exist and are valid
   * 5. Saves the validated data to user's profile
   * 6. Calls completion handler and updates loading state
   */
  const saveProgram = async (program: Program): Promise<void> => {
    if (!user) {
      // console.error("User is not initialized");
      return;
    }
    if (creationCompletedTimeout.current) {
      clearTimeout(creationCompletedTimeout.current);
    }
    const { program: programData, error } = program;
    if (error || !programData) {
      // console.error("Error generating program:", { error, programData });
      setIsLoading(false);
      onError("Error generating program. Please try again later.");
      onStatusChange("");
      return;
    }

    onStatusChange("Saving program");
    if (creationMessageInterval.current) {
      clearInterval(creationMessageInterval.current);
    }
    const { algorithms, codingPattern } = programData;

    if (programType === "coding-patterns") {
      if (
        !codingPattern ||
        !codingPattern.title ||
        !codingPattern.totalProblems ||
        !codingPattern.problems?.length
      ) {
        setIsLoading(false);
        // console.error("Invalid coding pattern data:", codingPattern);
        onError("Error in program generation, please try again.");
        onStatusChange("");
        return;
      }
      await user.setCodingTechniques(codingPattern);
    } else if (programType === "algorithms") {
      const isNotValid = algorithms?.some((algorithm) => !algorithm);
      if (!algorithms?.length || isNotValid) {
        setIsLoading(false);
        onError("Error in program generation, please try again.");
        onStatusChange("");
        return;
      }
      await user.setAlgorithmProblems(algorithms);
    }

    // console.log("Calling onComplete");
    await onComplete();
    // console.log("onComplete called");
    setIsLoading(false);
  };

  /**
   * Initiates the program creation process for a new user.
   *
   * This function handles the program generation workflow by:
   * 1. Validating user existence and new user status
   * 2. Submitting the program generation prompt
   * 3. Managing loading states and status messages
   * 4. Setting up status rotation intervals
   * 5. Implementing a timeout for long-running operations
   *
   * @remarks
   * The status message rotates every 6 seconds through the following states:
   * - "Creating program"
   * - "Analyzing your profile"
   * - "Fetching problems"
   * - "Finalizing your program"
   * - "Creating Problems"
   *
   * If the operation takes longer than 45 seconds, an error message is displayed.
   *
   * @throws {Error} Logs error to console if user is not initialized
   */
  const createProgram = () => {
    if (!user) {
      // console.error("User is not initialized");
      return;
    }
    if (!isLoading && (user.isNewUser || programType === "coding-patterns")) {
      onStatusChange("Creating program");
      onError("");
      setIsLoading(true);

      let prompt = `Create a program for a ${user?.skillLevel} software engineer`;
      if (programType === "coding-patterns") {
        const codingPatternsTitles = user?.codingTechniques.map(
          (technique) => technique.title
        );
        const patternsToSkip = codingPatternsTitles?.join(", ");
        if (patternsToSkip) {
          prompt += `, excluding the following coding patterns: [${patternsToSkip}]`;
        }
      }

      submit({
        prompt: prompt,
      });

      creationMessageInterval.current = setInterval(() => {
        onStatusChange((prev) => {
          if (prev === "Creating program") {
            return "Analyzing your profile";
          } else if (prev === "Analyzing your profile") {
            return "Fetching problems";
          } else if (prev === "Fetching problems") {
            return "Finalizing your program";
          } else {
            return "Creating Problems";
          }
        });
      }, 6000);

      // if the program creation takes more than 45 seconds, show a message
      creationCompletedTimeout.current = setTimeout(() => {
        // console.error("Timeout reached for program creation");
        clearInterval(creationMessageInterval.current!);
        setIsLoading(false);
        onStatusChange("");
        if (creationMessageInterval.current) {
          clearInterval(creationMessageInterval.current);
        }
        onError(
          "Program creation is taking longer than expected. Please try again."
        );
        stop();
      }, 75000); // 75 seconds timeout to complete the program creation (for development purposes)
    } else if (!user.isNewUser) {
      // router.replace("/dashboard");
    }
  };

  const handleError = (error: Error) => {
    // const { message } = error;
    // console.error("Error:", message);
    setIsLoading(false);
    if (creationMessageInterval.current) {
      clearInterval(creationMessageInterval.current);
    }
    if (creationCompletedTimeout.current) {
      clearTimeout(creationCompletedTimeout.current);
    }
    onStatusChange("");
    onError(
      error.message ||
        "It seems all slots are occupied, please wait or try again later."
    );
  };

  // ==================================
  //              AI SDK
  // ==================================

  const algorithms =
    programType === "algorithms" ? z.array(z.string()) : z.optional(z.any());
  const codingPattern =
    programType === "coding-patterns"
      ? z.object({
          title: z.string(),
          totalProblems: z.number(),
          info: z.string(),
          problems: z.array(z.string()),
        })
      : z.optional(z.any());
  const schema = z.object({
    algorithms,
    codingPattern,
  });

  const api = `/api/generate_program?programType=${programType}`;
  const { submit, error, stop } = useObject({
    api,
    schema,
    onFinish: ({ object, error }) => saveProgram({ program: object, error }),
    onError: handleError,
  });

  return {
    createProgram,
    cancelProgram: stop,
    isLoading,
    error,
    setIsLoading,
    onError,
    onStatusChange,
  };
}
