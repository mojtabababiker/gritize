import Image from "next/image";

import { Settings } from "@/constant/setting";

import Bounded from "@/components/common/Bounded";
import Heading from "@/components/common/Heading";
import { ProjectDescription } from "@/components/base/Projectdescription";

/**
 * lastStats is an object that stores the last fetched statistics of the GitHub repository. which act as simple in memory cache
 * Need to be replaced with a better solution, but for now it works
 */
const lastStats = {
  totalStars: 0,
  openedIssues: 0,
  totalCommits: 0,
  totalContributors: 0,
  totalPullRequest: 0,
};

/**
 * A helper function to fetch data from the GitHub API, abstracting the process of authentication, error handling, and response parsing.
 * @param uri the uri to fetch data from
 * @returns a promise that resolves to the response and data
 * @throws an error if the response is not ok
 * @description fetches data from the github api for specified uri and returns the response and data if successful, otherwise throws an error
 */
const fetchData = async (uri: string) => {
  const response = await fetch(
    `https://api.github.com/repos/mojtabababiker/gritize${uri}`,
    {
      headers: {
        Authorization: `Bearer ${Settings.githubAccessToken}`,
      },
    }
  );
  if (!response.ok) {
    console.error(response.statusText);
    throw new Error(
      `Network response was not ok for ${uri}\nError: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  return { response, data };
};

async function Brief() {
  let totalStars: number;
  let totalCommits: number;
  let totalPullRequest: number;
  let openedIssues: number;
  let totalContributors: number;

  /* 
    const { totalStars, openedIssues, totalCommits, totalContributors } =
      await getProjectStats();

    getProjectStats:
    fetch https://api.github.com/repos/mojtabababiker/gritize
    - then get the `stargazers_count`, `open_issues`, `pull_requests` from the response.

    - fetch commit count:
      - fetch https://api.github.com/repos/mojtabababiker/gritize/commits?sha=main&per_page=1&page=1
      - then get the `Link` header from the response.
      - parse the `Link` searching for the `&page=/d+>rel=last` pattern.
      - then get the page number from the `&page=/d+>rel=last` pattern.

    - fetch contributors count:
      - fetch https://api.github.com/repos/mojtabababiker/gritize/contributors
      - then get the length of the response.

    totalStars => stargazers_count
    totalCommits => fetch commit count
    totalPullRequest => pull_requests
    openedIssues => open_issues
    totalContributors => fetch contributors count


  */
  try {
    const { data: repoData } = await fetchData("");
    totalStars = repoData.stargazers_count;
    openedIssues = repoData.open_issues_count;

    // update the lastStats object
    lastStats.totalStars = totalStars;
    lastStats.openedIssues = openedIssues;

    const { data: pullData } = await fetchData("/pulls?state=all");
    totalPullRequest = pullData.length;
    // update the lastStats object
    lastStats.totalPullRequest = totalPullRequest;

    const { response: commitResponse } = await fetchData(
      "/commits?sha=main&per_page=1&page=1"
    );
    const commitLinkHeader = commitResponse.headers.get("Link");
    const commitLink = commitLinkHeader?.match(/&page=(\d+)>; rel="last"/);
    const commitPage = commitLink
      ? parseInt(commitLink[1], 10)
      : lastStats.totalCommits;
    totalCommits = commitPage;
    // update the lastStats object
    lastStats.totalCommits = totalCommits;

    const { data: contributorsData } = await fetchData("/contributors");
    totalContributors = contributorsData.length;
    lastStats.totalContributors = totalContributors;
  } catch (error) {
    console.error("Error fetching GitHub repository data:", error);
    totalStars = lastStats.totalStars;
    openedIssues = lastStats.openedIssues;
    totalCommits = lastStats.totalCommits;
    totalPullRequest = lastStats.totalPullRequest;
    totalContributors = lastStats.totalContributors;
  }
  return (
    <Bounded as="section" className="brief-container" id="about-us">
      <div className="flex flex-col pt-32 pb-16 gap-3">
        {/* title */}
        <Heading as="h2" size="lg" className="text-fg text-center">
          A Platform Built From Developers, For
          <span className="text-accent text-4xl md:text-6xl text-center font-bold block">
            {" "}
            Developers
          </span>
        </Heading>

        {/* body */}
        <div className="flex flex-wrap justify-between gap-y-16">
          {/* Project stats server component Should be replaced */}
          <span className="sr-only">Gritize GitHub repository statistics</span>
          <ul className="project-stats flex flex-col gap-3 items-center justify-center flex-1 w-full sm:min-w-[420px] sm:pr-8 mt-8 md:mt-0">
            {/* stars */}
            <li className="w-full flex items-center justify-between">
              <div className="flex-1 flex gap-3 items-center">
                {/* icon */}
                <Image
                  src={"/icons/star.png"}
                  alt="Total Stars"
                  width={60}
                  height={60}
                  className="w-6 sm:w-10 h-auto object-cover"
                />

                {/* title */}
                <Heading as="h3" size="md" className="text-fg flex-1">
                  Total Stars
                </Heading>
              </div>

              {/* value */}
              <Heading as="h3" size="md" className="text-accent max-w-20">
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
                  className="w-6 sm:w-10 h-auto object-cover"
                />

                {/* title */}
                <Heading as="h3" size="md" className="text-fg flex-1">
                  Total Commits
                </Heading>
              </div>

              {/* value */}
              <Heading as="h3" size="md" className="text-accent max-w-20">
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
                  className="w-5 sm:w-10 h-auto object-cover"
                />

                {/* title */}
                <Heading as="h3" size="md" className="text-fg w-full flex-1">
                  Total Pull Requests
                </Heading>
              </div>

              {/* value */}
              <Heading as="h3" size="md" className="text-accent max-w-20">
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
                  className="w-6 sm:w-10 h-auto object-cover"
                />
                {/* title */}
                <Heading as="h3" size="md" className="text-fg w-full flex-1">
                  Open Issues
                </Heading>
              </div>
              {/* value */}
              <Heading as="h3" size="md" className="text-accent max-w-20">
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
                  className="w-6 sm:w-10 h-auto object-cover"
                />
                {/* title */}
                <Heading as="h3" size="md" className="text-fg">
                  Total Contributors
                </Heading>
              </div>
              {/* value */}
              <Heading as="h3" size="md" className="text-accent max-w-20">
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
