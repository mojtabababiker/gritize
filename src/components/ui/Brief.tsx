import Image from "next/image";
import Bounded from "../common/Bounded";
import Heading from "../common/Heading";
import { ProjectDescription } from "../base/Projectdescription";

const stats = Promise.resolve({
  totalStars: 27,
  openedIssues: 13,
  totalCommits: 324,
  totalContributors: 7,
  totalPullRequest: 11,
});

async function Brief() {
  const {
    totalStars,
    totalCommits,
    totalPullRequest,
    openedIssues,
    totalContributors,
  } = await stats;
  return (
    <Bounded as="section" className="brief-container">
      <div className="flex flex-col pt-32 pb-16 gap-3">
        {/* title */}
        <Heading as="h2" size="lg" className="text-fg text-center">
          A Platform Built From Developers, For
          <span className="text-accent text-5xl md:text-6xl text-center font-bold block">
            {" "}
            Developers
          </span>
        </Heading>

        {/* body */}
        <div className="flex flex-wrap justify-between gap-y-16">
          {/* Project stats server component Should be replaced */}
          <span className="sr-only">Gritize GitHub repository statistics</span>
          <ul className="project-stats flex flex-col gap-3 items-center justify-center flex-1 sm:min-w-[420px] px-4 mt-8 md:mt-0">
            {/* stars */}
            <li className="w-full flex items-center justify-between">
              <div className="flex-1 flex gap-3 items-center">
                {/* icon */}
                <Image
                  src={"/icons/star.png"}
                  alt="Total Stars"
                  width={60}
                  height={60}
                  className="w-10 h-auto object-cover"
                />

                {/* title */}
                <Heading as="h3" size="md" className="text-fg">
                  Total Stars
                </Heading>
              </div>

              {/* value */}
              <Heading as="h3" size="md" className="text-accent w-20 ">
                {totalStars}
              </Heading>
            </li>

            {/* commits */}
            <li className="w-full flex items-center justify-between">
              <div className="flex-1 flex gap-3 items-center">
                {/* icon */}
                <Image
                  src={"/icons/timer.png"}
                  alt="Total Commit"
                  width={60}
                  height={60}
                  className="w-10 h-auto object-cover"
                />

                {/* title */}
                <Heading as="h3" size="md" className="text-fg">
                  Total Commits
                </Heading>
              </div>

              {/* value */}
              <Heading as="h3" size="md" className="text-accent w-20">
                {totalCommits}
              </Heading>
            </li>

            {/* pull requests */}
            <li className="w-full flex items-center justify-between">
              <div className="flex-1 flex gap-3 items-center">
                {/* icon */}
                <Image
                  src={"/icons/pull-request.png"}
                  alt="Total Pull Request"
                  width={60}
                  height={60}
                  className="w-10 h-auto object-cover"
                />

                {/* title */}
                <Heading as="h3" size="md" className="text-fg">
                  Total Pull Requests
                </Heading>
              </div>

              {/* value */}
              <Heading as="h3" size="md" className="text-accent w-20">
                {totalPullRequest}
              </Heading>
            </li>
            {/* issues */}
            <li className="w-full flex items-center justify-between">
              <div className="flex-1 flex gap-3 items-center">
                <Image
                  src={"/icons/warning.png"}
                  alt="Open Issue"
                  width={60}
                  height={60}
                  className="w-10 h-auto object-cover"
                />
                {/* title */}
                <Heading as="h3" size="md" className="text-fg">
                  Open Issues
                </Heading>
              </div>
              {/* value */}
              <Heading as="h3" size="md" className="text-accent w-20">
                {openedIssues}
              </Heading>
            </li>

            {/* contributors */}
            <li className="w-full flex items-center justify-between">
              <div className="flex-1 flex gap-3 items-center">
                <Image
                  src={"/icons/handshake.png"}
                  alt="Total Contributors"
                  width={60}
                  height={60}
                  className="w-10 h-auto object-cover"
                />
                {/* title */}
                <Heading as="h3" size="md" className="text-fg">
                  Total Contributors
                </Heading>
              </div>
              {/* value */}
              <Heading as="h3" size="md" className="text-accent w-20">
                {totalContributors}
              </Heading>
            </li>
          </ul>

          {/* Project description */}
          <ProjectDescription />
        </div>
      </div>
    </Bounded>
  );
}

export default Brief;
