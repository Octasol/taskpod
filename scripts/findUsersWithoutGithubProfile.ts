import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findUsersWithoutGithubProfile() {
  try {
    // Find users without an associated GithubDevProfile
    const usersWithoutGithubProfile = await prisma.user.findMany({
      where: {
        GithubDevProfile: null,
      },
      select: {
        githubId: true,
        githubUsername: true,
      },
    });

    // Log the users found
    if (usersWithoutGithubProfile.length > 0) {
      console.log("Users without a GithubDevProfile:");
      usersWithoutGithubProfile.forEach((user) => {
        console.log(
          `GitHub ID: ${user.githubId}, Username: ${user.githubUsername}`
        );
      });
    } else {
      console.log("No users found without a GithubDevProfile.");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the script
findUsersWithoutGithubProfile();
