import db from "../config/db";
import { GithubDevProfile } from "../config/types";

const getHackerrankProfile = async (id: bigint) => {
  return db.hackerrankProfile.findUnique({
    where: {
      githubId: id,
    },
  });
};

const getGFGProfile = async (id: bigint) => {
  return db.gFGProfile.findUnique({
    where: {
      githubId: id,
    },
  });
};

const getCodeChefProfile = async (id: bigint) => {
  return db.codeChefProfile.findUnique({
    where: {
      githubId: id,
    },
  });
};

const getLeetcodeProfile = async (id: bigint) => {
  return db.leetcodeProfile.findUnique({
    where: {
      githubId: id,
    },
  });
};

const getSuperteamEarnProfile = async (id: bigint) => {
  return db.superteamEarnProfile.findUnique({
    where: {
      githubId: id,
    },
  });
};

const getGithubDevProfile = async (id: bigint) => {
  return db.githubDevProfile.findUnique({
    where: {
      githubId: id,
    },
  });
};

export const getDbUser = async (githubId: bigint) => {
  return db.user.findUnique({
    where: {
      githubId: githubId,
    },
  });
};

const updateTotalPoints = async (id: bigint) => {
  //   await logToDiscord(`Updating total points initialized for id: ${id}`, "INFO");
  const hackerrankProfile = await getHackerrankProfile(id);
  const githubDevProfile = await getGithubDevProfile(id);
  const gfgProfile = await getGFGProfile(id);
  const codeChefProfile = await getCodeChefProfile(id);
  const leetcodeProfile = await getLeetcodeProfile(id);
  const superteamEarnProfile = await getSuperteamEarnProfile(id);
  const user = await getDbUser(BigInt(id));
  let totalPoints = 0;

  if (hackerrankProfile) {
    totalPoints += hackerrankProfile.currentPoints;
    totalPoints += hackerrankProfile.stars * 100;
  }

  if (githubDevProfile) {
    totalPoints += githubDevProfile.stars * 100;
    totalPoints += githubDevProfile.forks * 50;
    totalPoints += githubDevProfile.originalRepos * 50;
    totalPoints += githubDevProfile.followers * 50;
    totalPoints += githubDevProfile.totalCommits * 10;
    totalPoints += githubDevProfile.repositoriesContributedTo * 20;
    totalPoints += githubDevProfile.pullRequests * 20;
    totalPoints += githubDevProfile.mergedPullRequests * 50;
    totalPoints += githubDevProfile.totalIssues * 10;
  }

  if (gfgProfile) {
    totalPoints += gfgProfile.score;
    totalPoints += gfgProfile.problemsSolved * 10;
  }

  if (codeChefProfile) {
    totalPoints += codeChefProfile.currentRating;
  }

  if (leetcodeProfile) {
    totalPoints += leetcodeProfile.easyQues * 10;
    totalPoints += leetcodeProfile.mediumQues * 30;
    totalPoints += leetcodeProfile.hardQues * 50;
  }

  if (superteamEarnProfile) {
    totalPoints += superteamEarnProfile.participations * 10;
    totalPoints += superteamEarnProfile.wins * 100;
    totalPoints += superteamEarnProfile.totalWinnings * 2;
  }

  if (totalPoints == user?.totalPoints) {
    // await logToDiscord(
    //   `Total points (${totalPoints}) already up to date for id: ${id}`,
    //   "INFO"
    // );
    return false;
  }

//   await logToDiscord(`Updating total points triggered for id: ${id}`, "INFO");

  return await db.user.update({
    where: { githubId: id },
    data: {
      totalPoints: totalPoints,
    },
  });
};

export const setGithubDevProfile = async (
  id: any,
  profile: GithubDevProfile
) => {
  try {
    const existingProfile = await db.githubDevProfile.findUnique({
      where: { githubId: id },
    });

    if (existingProfile) {
      await db.githubDevProfile.update({
        where: { githubId: id },
        data: {
          ...profile,
        },
      });
    } else {
      await db.githubDevProfile.create({
        data: {
          githubId: id,
          stars: profile.stars,
          forkedRepos: profile.forkedRepos,
          originalRepos: profile.originalRepos,
          forks: profile.forks,
          followers: profile.followers,
          totalCommits: profile.totalCommits,
          repositoriesContributedTo: profile.repositoriesContributedTo,
          pullRequests: profile.pullRequests,
          mergedPullRequests: profile.mergedPullRequests,
          totalIssues: profile.totalIssues,
        },
      });
    }
    await updateTotalPoints(id).then(() => {
      //   logToDiscord(`Updated Github data for id: ${id}`, "INFO");
    });
    return true;
  } catch (error) {
    // await logToDiscord(
    //   `dbUtils/setGithubDevProfile: ${(error as any).message}`,
    //   "ERROR"
    // );
    console.error(error);
    return false;
  }
};
