"use client";

import { useEffect, useRef, useState } from "react";

import { ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "clsx";

import { TechnicalProblemSchema } from "@/models/schemas";
import { TableCell, TableRow } from "@/components/cards/TableRow";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";
import CustomToast from "../common/CustomToast";
import Loading from "../common/Loading";
import Tooltip from "../common/Tooltip";

const LIMIT = 10; // hard coded limit

/**
 * A component that displays a paginated list of featured technical problems.
 *
 * @component
 * @returns {JSX.Element} A responsive table showing problems with pagination controls
 *
 * @description
 * This component fetches and displays technical problems in a paginated table format.
 * Each problem shows:
 * - Index number
 * - Title
 * - Difficulty level (color-coded)
 * - Truncated description
 *
 * Features:
 * - Loading state with animated placeholders
 * - Error handling with user feedback
 * - Pagination controls (previous/next)
 * - Page counter showing current page and total pages
 * - Cursor-based pagination for efficient data fetching
 *
 * States:
 * @state {TechnicalProblemSchema[]} featuredProblems - Array of problems to display
 * @state {boolean} loading - Loading state indicator
 * @state {string | null} error - Error message if fetch fails
 * @state {number} page - Current page number
 * @state {boolean} hasMore - Indicates if more problems are available
 * @state {number} totalProblems - Total count of available problems
 *
 * @example
 * ```tsx
 * <FeaturedProblems />
 * ```
 */
export function FeaturedProblems() {
  const [featuredProblems, setFeaturedProblems] = useState<
    TechnicalProblemSchema[]
  >([]);

  const router = useRouter();

  const { user, setUser } = useAuth();

  const [creatingProblem, setCreatingProblem] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const totalProblems = useRef<number>(0);

  const firstRendered = useRef(false);

  const fetchFeaturedProblems = async (prev = false) => {
    setLoading(true);
    let currentPage;
    if (prev) {
      setPage((_prev) => _prev - 1);
      currentPage = page - 1;
    } else {
      setPage((_prev) => _prev + 1);
      currentPage = page + 1;
    }
    const lastProblem = featuredProblems[featuredProblems.length - 1];
    const firstProblem = featuredProblems[0];
    let query = `&page=${currentPage}`;
    if (prev) {
      query += "&prev=true";
      if (firstProblem) {
        query += `&cursorId=${firstProblem.id}`;
      }
    } else {
      if (lastProblem) {
        query += `&cursorId=${lastProblem.id}`;
      }
    }

    try {
      const response = await fetch(`/api/get-problems?limit=${LIMIT}${query}`);
      if (!response.ok) {
        throw new Error("Network error, please try again later.");
      }
      const data = await response.json();
      setFeaturedProblems(data.problems);
      // setHasMore(data.hasMore);
      totalProblems.current = data.total;
      setHasMore(data.hasMore);
      setLoading(false);
    } catch {
      // console.error("Error fetching featured problems:", error);
      setError("Failed to fetch featured problems.");
    } finally {
      setLoading(false);
      // console.log("\n\npage", page);
    }
  };

  const createNewUserProblem = async (problemId: string) => {
    if (!user) {
      return;
    }

    setCreatingProblem(true);

    try {
      const createdProblemId = await user.setAlgorithmProblems([problemId]);
      if (!createdProblemId) {
        throw new Error("Failed to create new user problem.");
      }
      if (!createdProblemId.length) {
        throw new Error("No problem ID returned.");
      }
      // save the user
      await user.save();
      setUser(user);
      toast.custom((t) => (
        <CustomToast t={t} message="Problem added to your profile!" />
      ));
      router.push(`/playground?problem=${createdProblemId[0]}`);
    } catch (error) {
      // console.error("Error creating new user problem:", error);
      // @ts-expect-error to expensive to type it
      setError(error.message || "Failed to create new user problem.");
    } finally {
      setCreatingProblem(false);
    }
  };

  useEffect(() => {
    if (firstRendered.current) {
      return;
    }
    firstRendered.current = true;
    // console.log("fetching featured problems");
    fetchFeaturedProblems();
  }, []);
  return (
    <>
      {loading ? (
        // loading
        <div className="w-full flex flex-col gap-3 items-center justify-center">
          {Array.from({ length: LIMIT }).map((_, index) => (
            <TableRow
              key={`loading-${index}`}
              className="relative w-full min-w-[640px] h-[52px] overflow-hidden gap-6 animate-pulse"
            />
          ))}
          <div className="flex w-full max-w-[320px] min-h-[42px]">
            <div className="size-8 px-2 py-2 rounded-2xl bg-primary/25 hover:bg-primary/35 shadow shadow-fg/10 shadow-b animate-pulse" />
            <div className="flex-1 flex items-center justify-center px-2 py-2 rounded-2xl bg-primary/25 shadow shadow-fg/10 shadow-b animate-pulse" />
            <div className="size-8 px-2 py-2 rounded-2xl bg-primary/25 hover:bg-primary/35 shadow shadow-fg/10 shadow-b animate-pulse" />
          </div>
          <span className="sr-only">loading</span>
        </div>
      ) : error ? (
        // error
        <div className="w-full flex items-center justify-center">
          <span className="text-red-500">{error}</span>
        </div>
      ) : (
        <div className="w-full overflow-hidden flex flex-col gap-6 justify-center items-center">
          {/* // table */}
          <div className="relative w-full pb-3 flex flex-col gap-3 justify-center overflow-auto">
            {/* table */}
            {featuredProblems.map((problem, index) => (
              <div
                key={problem.id}
                className="min-w-max flex items-center justify-center cursor-pointer hover:scale-95 transition-all duration-200 ease-in-out"
                onClick={() => createNewUserProblem(problem.id || "")}
              >
                <TableRow
                  key={`table-${index}`}
                  className="relative w-full1 min-w-[640px] overflow- gap-6"
                >
                  {/* problem index */}
                  <TableCell className="text-fg text-xs sm:text-base w-6 sm:w-10">
                    {index + 1 + (page - 1) * LIMIT}
                  </TableCell>
                  {/* problem title */}
                  <TableCell className="relative">
                    <div className="overflow-hidden w-[16ch] sm:w-[24ch] peer">
                      <div className="text-fg text-xs sm:text-base relative truncate">
                        {problem.title}
                      </div>
                    </div>
                    {/* tooltip */}
                    <Tooltip>{problem.title}</Tooltip>
                  </TableCell>
                  {/* problem difficulty */}
                  <TableCell
                    className={clsx(
                      "text-center text-xs sm:text-base w-12 sm:w-20",
                      problem.difficulty === "easy" && "text-[#2DDD4A]",
                      problem.difficulty === "mid" && "text-accent",
                      problem.difficulty === "advanced" && "text-[#F85151]"
                    )}
                  >
                    {problem.difficulty}
                  </TableCell>
                  {/* problem description */}
                  <TableCell className="group text-fg text-xs sm:text-base flex-1 min-w-[82ch] overflow-hidden">
                    {problem.description.slice(0, 100)}...
                    {/* TODO: Add on hover popup that shows the whole description */}
                  </TableCell>
                </TableRow>
              </div>
            ))}
          </div>
          {/* pagination */}
          <div className="w-full max-w-[320px] min-h-[42px] self-center flex items-center justify-between">
            {/* go back */}
            <div className={page <= 1 ? "opacity-0 pointer-events-none" : ""}>
              <ArrowLeft
                onClick={() => fetchFeaturedProblems(true)}
                className="size-8 px-2 py-2 rounded-2xl bg-primary/25 hover:bg-primary/35 shadow shadow-fg/10 shadow-b transition-all duration-200 cursor-pointer hover:size-9"
              />
              <span className="sr-only">Previous</span>
            </div>

            {/* current page */}
            <div className="flex-1 flex items-center justify-center px-2 py-2 rounded-2xl bg-primary/25 shadow shadow-fg/10 shadow-b">
              Page {page}/
              {Math.ceil(totalProblems.current / 10 /* the hard coded limit */)}
            </div>

            {/* go next */}
            <div className={hasMore ? "" : "opacity-0 pointer-events-none"}>
              <ArrowRight
                color="white"
                stroke="white"
                onClick={() => fetchFeaturedProblems()}
                className="size-8 px-2 py-2 rounded-2xl bg-primary/25 hover:bg-primary/35 shadow shadow-fg/10 shadow-b transition-all duration-200 cursor-pointer hover:size-9"
              />
              <span className="sr-only">Next</span>
            </div>
          </div>
          {/* loading */}
          {creatingProblem && <Loading />}
        </div>
      )}
    </>
  );
}
