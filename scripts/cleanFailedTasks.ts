
import fs from "fs";
import path from "path";

const failedTasksFilePath = path.resolve(__dirname, "../src/failedTasks.json");

const cleanFailedTasks = () => {
  if (fs.existsSync(failedTasksFilePath)) {
    fs.writeFileSync(failedTasksFilePath, JSON.stringify([], null, 2));
    console.log("Failed tasks have been cleaned.");
  } else {
    console.log("No failed tasks file found.");
  }
};

cleanFailedTasks();