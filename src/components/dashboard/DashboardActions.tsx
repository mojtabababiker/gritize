import clsx from "clsx";
import { useState } from "react";

import { useAuth } from "@/context/AuthProvider";

import QuizzesContainer from "@/components/user-quizzes/QuizzesContainer";

import Heading from "@/components/common/Heading";

import { FeaturedProblems } from "./FeaturedProblems";

const TABS: { name: string; value: "problems" | "quizzes" }[] = [
  {
    name: "Problems",
    value: "problems",
  },
  {
    name: "Quizzes",
    value: "quizzes",
  },
];

function DashboardActions() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"problems" | "quizzes">(
    "problems"
  );
  return (
    <div className="w-full mt-6 flex flex-col gap-6 overflow-auto">
      {/* actions nav menu */}
      <nav className="w-full flex  py-3 border-b border-fg/20">
        <ul className="flex items-center gap-4">
          {TABS.map((tab) => (
            <li key={tab.value}>
              <button
                className={`py-2 px-4 rounded-lg transition-colors duration-200 ${
                  activeTab === tab.value
                    ? "bg-primary text-white"
                    : "text-fg hover:bg-fg/10"
                }`}
                onClick={() => setActiveTab(tab.value)}
              >
                {tab.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* tabs content */}
      <div className="w-full flex overflow-x-hidden">
        {/* featured problems table */}
        <div
          className={clsx(
            "w-full relative flex-col gap-6 overflow-auto",
            activeTab === "problems" ? "flex animate-slide-from-left" : "hidden"
          )}
        >
          {/* title */}
          <Heading as="h2" size="md" className="text-fg">
            Want Extra Practicing
          </Heading>
          {/* table */}
          <FeaturedProblems />
          {/* <div className="flex flex-col gap-3 items-center justify-center"></div> */}
        </div>

        {/* quizzes */}
        <div
          className={clsx(
            "w-full relative flex-col gap-6 overflow-auto",
            activeTab === "quizzes" ? "flex animate-slide-from-right" : "hidden"
          )}
        >
          <QuizzesContainer />
        </div>
      </div>
    </div>
  );
}

export default DashboardActions;
