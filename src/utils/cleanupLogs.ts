import fs from "fs";
import path from "path";
import { errorFile, infoFile } from "../config/constants";

const cleanupLogs = (logFile: string): void => {
  const filePath = path.resolve(logFile);

  fs.truncate(filePath, 0, (truncateErr) => {
    if (truncateErr) {
      console.error(`Error truncating file ${logFile}:`, truncateErr);
    } else {
      console.log(`Cleared log file content: ${logFile}`);
    }
  });
};

// Export cleanup functions for info and error logs
export const cleanupInfoLogs = (): void => {
  console.log("Running cleanup for info logs...");
  cleanupLogs(infoFile);
};

export const cleanupErrorLogs = (): void => {
  console.log("Running cleanup for error logs...");
  cleanupLogs(errorFile);
};
