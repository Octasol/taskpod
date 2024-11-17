import { Tasks } from "../config/constants";
import { logger } from "../lib/logger";
import { updateGithubProfile } from "./github/githubStatsHelper";

interface Task {
  method: string;
  data: { [key: string]: any };
}

export const handleTasks = async (task: Task) => {
  if (task.method === Tasks.updateGithubProfile) {
    logger.info(`Updating Github Profile for id: ${task.data.githubId}`);
    await updateGithubProfile(task.data.accessToken);
  }
};
