import { QueuePriority, Tasks } from "../config/constants";
import { logger } from "../lib/logger";
import { updateGithubProfile } from "./github/githubStatsHelper";
import fs from "fs";
import path from "path";

interface Task {
  method: string;
  data: { [key: string]: any };
}

const failedTasksFilePath = path.resolve(__dirname, "../failedTasks.json");

const saveFailedTask = (task: Task, priority: QueuePriority, error: any) => {
  const failedTask = {
    task,
    priority,
    error: error.message,
    timestamp: new Date().toISOString(),
  };

  let failedTasks = [];
  if (fs.existsSync(failedTasksFilePath)) {
    const fileContent = fs.readFileSync(failedTasksFilePath, "utf-8");
    failedTasks = JSON.parse(fileContent);
  }

  failedTasks.push(failedTask);
  fs.writeFileSync(failedTasksFilePath, JSON.stringify(failedTasks, null, 2));
};

export const handleTasks = async (task: Task, priority: QueuePriority) => {
  try {
    if (task.method === Tasks.updateGithubProfile) {
      logger.info(`Updating Github Profile for id: ${task.data.githubId}`);
      await updateGithubProfile(task.data.accessToken);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to handle task: ${error.message}`);
    } else {
      logger.error(`Failed to handle task: ${String(error)}`);
    }
    saveFailedTask(task, priority, error);
  }
};
