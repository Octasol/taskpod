import { Tasks } from "../config/constants";

interface Task {
  method: string;
  data: { [key: string]: any };
}

export const handleTasks = async (task: Task) => {
  if (task.method === Tasks.updateGithubProfile) {
    console.log("Updating Github Profile");
    console.log("Task Data:", task.data);
  }
};
