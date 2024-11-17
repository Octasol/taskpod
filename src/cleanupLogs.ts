import fs from "fs";
import path from "path";

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
  cleanupLogs("worker.info.log");
};

export const cleanupErrorLogs = (): void => {
  console.log("Running cleanup for error logs...");
  cleanupLogs("worker.error.log");
};
