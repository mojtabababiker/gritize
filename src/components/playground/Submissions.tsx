import React, { useEffect, useState } from "react";

import { ProblemSolutionDTO } from "@/models/dto/user-dto";

import { useAuth } from "@/context/AuthProvider";

import Bounded from "@/components/common/Bounded";
import Heading from "@/components/common/Heading";
import Paragraph from "@/components/common/Paragraph";
import Button from "@/components/common/Button";

type Props = {
  problemId: string;
  problemTitle: string;
  closeSubmissions?: () => void;
  showSubmissions?: boolean;
  setCode?: (code: string) => void;
};

function Submissions({
  problemId,
  problemTitle,
  showSubmissions,
  closeSubmissions,
  setCode,
}: Props) {
  const { user } = useAuth();
  const [solutions, setSolutions] = useState<ProblemSolutionDTO[] | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSubmissions?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSubmissions]);

  useEffect(() => {
    if (!user || !showSubmissions) return;
    const fetchSolutions = async () => {
      const solutions = await user.getProblemSolutions(problemId);
      setSolutions(solutions);
    };
    fetchSolutions();
  }, [problemId, user, showSubmissions]);

  if (!showSubmissions || !user) return null;
  return (
    <>
      <div className="absolute inset-0 z-30" onClick={closeSubmissions} />
      <Bounded className="absolute z-50 w-full max-h-[45vh] overflow-auto bg-bg/65 drop-shadow-xl backdrop-blur-2xl border-t border-fg/10 rounded-t-2xl animate-slide-up">
        <div className="w-full py-8 flex flex-col gap-4">
          <Heading as="h3" size="sm" className="text-fg">
            {problemTitle}
          </Heading>
          {solutions ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2 bg-surface/30 rounded-lg ring-surface/30">
                <Paragraph size="sm" className="text-fg">
                  Score
                </Paragraph>
                <Paragraph size="sm" className="text-fg">
                  Time
                </Paragraph>
                <Paragraph size="sm" className="text-fg">
                  Language
                </Paragraph>
                <Paragraph size="sm" className="text-fg/50">
                  Date
                </Paragraph>
              </div>
              {solutions.map((solution) => (
                <div
                  key={solution.id}
                  className="flex items-center justify-between p-2 bg-surface/10 rounded-lg ring-surface/30 cursor-pointer hover:bg-surface/20 hover:scale-105 transition-all duration-200"
                  onClick={() => {
                    setCode?.(solution.solution);
                    closeSubmissions?.();
                  }}
                >
                  <Paragraph size="sm" className="text-fg">
                    {solution.score} /{" "}
                    <span className="text-accent/75">10</span>
                  </Paragraph>
                  <Paragraph size="sm" className="text-fg">
                    {solution.time.toFixed(2)}{" "}
                    <span className="text-accent/75">minutes</span>
                  </Paragraph>
                  <Paragraph size="sm" className="text-fg">
                    {solution.language}
                  </Paragraph>
                  <Paragraph size="sm" className="text-fg/50">
                    {new Date(solution.$createdAt || "").toLocaleDateString()}
                  </Paragraph>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <Paragraph size="sm" className="text-fg/50">
                No submissions yet
              </Paragraph>
            </div>
          )}

          <Button
            onClick={closeSubmissions}
            className="max-w-[120px] mt-4 p-2 bg-primary text-white rounded"
            variant="primary"
            size="sm"
            isSimple
          >
            Close
          </Button>
        </div>
      </Bounded>
    </>
  );
}

export default Submissions;
