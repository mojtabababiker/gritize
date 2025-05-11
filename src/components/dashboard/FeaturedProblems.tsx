"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "clsx";

import { TechnicalProblemSchema } from "@/models/schemas";
import { TableCell, TableRow } from "@/components/cards/TableRow";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import toast from "react-hot-toast";
import CustomToast from "../common/CustomToast";
import Loading from "../common/Loading";

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

  const fetchFeaturedProblems = async (prev = false) => {
    setLoading(true);
    const lastProblem = featuredProblems[featuredProblems.length - 1];
    const firstProblem = featuredProblems[0];
    let query = "&page=" + (page + 1);
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
      prev
        ? setPage((_lastPage) => _lastPage - 1)
        : setPage((_lastPage) => _lastPage + 1);
      totalProblems.current = data.total;
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching featured problems:", error);
      setError("Failed to fetch featured problems.");
    } finally {
      setLoading(false);
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
    } catch (error: any) {
      console.error("Error creating new user problem:", error);
      setError(error.message || "Failed to create new user problem.");
    } finally {
      setCreatingProblem(false);
    }
  };

  useEffect(() => {
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
        // table
        <div className="relative w-full flex flex-col gap-3 items-center justify-center overflow-visible">
          {/* table */}
          {featuredProblems.map((problem, index) => (
            <div
              key={problem.id}
              className="w-full flex items-center cursor-pointer hover:scale-95 transition-all duration-200 ease-in-out"
              onClick={() => createNewUserProblem(problem.id || "")}
            >
              <TableRow
                key={`table-${index}`}
                className="relative w-full min-w-[640px] overflow-hidden gap-6"
              >
                {/* problem index */}
                <TableCell className="text-fg w-10">
                  {index + 1 + (page - 1) * LIMIT}
                </TableCell>
                <TableCell className="text-fg text-center flex-1">
                  {problem.title}
                </TableCell>
                <TableCell
                  className={clsx(
                    "text-center w-20",
                    problem.difficulty === "easy" && "text-[#2DDD4A]",
                    problem.difficulty === "mid" && "text-accent",
                    problem.difficulty === "advanced" && "text-[#F85151]"
                  )}
                >
                  {problem.difficulty}
                </TableCell>
                <TableCell className="group text-fg flex-1/3 overflow-hidden">
                  {problem.description.slice(0, 100)}...
                  {/* TODO: Add on hover popup that shows the whole description */}
                </TableCell>
              </TableRow>
            </div>
          ))}
          {/* pagination */}
          <div className="w-full max-w-[320px] min-h-[42px] flex items-center justify-between">
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
