import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findUsersWithZeroPointsAndGithubProfile() {
  try {
    // Find users with totalPoints = 0 and an existing GithubDevProfile
    const usersWithZeroPointsAndGithubProfile = await prisma.user.findMany({
      where: {
        totalPoints: 0,
        GithubDevProfile: {
          isNot: null,
        },
      },
      select: {
        githubId: true,
        githubUsername: true, // You can add other fields as needed
        totalPoints: true,
      },
    });

    // Log the users found
    if (usersWithZeroPointsAndGithubProfile.length > 0) {
      console.log("Users with 0 points but have a GithubDevProfile:");
      usersWithZeroPointsAndGithubProfile.forEach((user) => {
        console.log(
          `GitHub ID: ${user.githubId}, Username: ${user.githubUsername}, Points: ${user.totalPoints}`
        );
      });
    } else {
      console.log("No users found with 0 points and a GithubDevProfile.");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the script
findUsersWithZeroPointsAndGithubProfile();
