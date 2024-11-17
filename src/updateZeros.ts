import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateTotalPoints() {
  let email: { email: string; githubUsername: string }[] = [];
  // Fetch all users with totalPoints = 0
  const users = await prisma.user.findMany({
    where: { totalPoints: 0 },
    include: {
      HackerrankProfile: true,
      GithubDevProfile: true,
      GFGProfile: true,
      CodeChefProfile: true,
      LeetcodeProfile: true,
      SuperteamEarnProfile: true,
    },
  });

  // Prepare an array of update operations
  const updates = users
    .map((user: any) => {
      let totalPoints = 0;

      // Calculate points from HackerrankProfile
      if (user.HackerrankProfile) {
        totalPoints += user.HackerrankProfile.currentPoints;
        totalPoints += user.HackerrankProfile.stars * 100;
      }

      // Calculate points from GithubDevProfile
      if (user.GithubDevProfile) {
        totalPoints += user.GithubDevProfile.stars * 100;
        totalPoints += user.GithubDevProfile.forks * 50;
        totalPoints += user.GithubDevProfile.originalRepos * 50;
        totalPoints += user.GithubDevProfile.followers * 50;
        totalPoints += user.GithubDevProfile.totalCommits * 10;
        totalPoints += user.GithubDevProfile.repositoriesContributedTo * 20;
        totalPoints += user.GithubDevProfile.pullRequests * 20;
        totalPoints += user.GithubDevProfile.mergedPullRequests * 50;
        totalPoints += user.GithubDevProfile.totalIssues * 10;
      }

      // Calculate points from GFGProfile
      if (user.GFGProfile) {
        totalPoints += user.GFGProfile.score;
        totalPoints += user.GFGProfile.problemsSolved * 10;
      }

      // Calculate points from CodeChefProfile
      if (user.CodeChefProfile) {
        totalPoints += user.CodeChefProfile.currentRating;
      }

      // Calculate points from LeetcodeProfile
      if (user.LeetcodeProfile) {
        totalPoints += user.LeetcodeProfile.easyQues * 10;
        totalPoints += user.LeetcodeProfile.mediumQues * 30;
        totalPoints += user.LeetcodeProfile.hardQues * 50;
      }

      // Calculate points from SuperteamEarnProfile
      if (user.SuperteamEarnProfile) {
        totalPoints += user.SuperteamEarnProfile.participations * 10;
        totalPoints += user.SuperteamEarnProfile.wins * 100;
        totalPoints += user.SuperteamEarnProfile.totalWinnings * 2;
      }

      console.log(`User: ${user.githubId}, Points: ${totalPoints}`);

      // Only add update if totalPoints > 0
      if (totalPoints > 0) {
        return prisma.user.update({
          where: { githubId: user.githubId },
          data: { totalPoints },
        });
      } else {
        email.push({
          email: user.email,
          githubUsername: user.githubUsername
        });
        if(!user.email){
          console.log(user.githubUsername)
        }
      }
      return null;
    })
    .filter((update): update is NonNullable<typeof update> => update !== null); // Type assertion to remove null values

  // Execute all updates in a single transaction
  await prisma.$transaction(updates);

  console.log("All user points updated successfully.");
  console.log("Users with 0 points and no profiles: ", email);
}

// Execute the script
updateTotalPoints()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
