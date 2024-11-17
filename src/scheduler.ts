import cron from "node-cron";
import { cleanupInfoLogs, cleanupErrorLogs } from "./cleanupLogs";

// Schedule cleanup for info logs every 12 hours
cron.schedule("*/1 * * * *", () => {
    cleanupInfoLogs();
});

// Schedule cleanup for error logs every 3 days
cron.schedule("0 0 */3 * *", () => {
  cleanupErrorLogs();
});

console.log(
  "Cron jobs scheduled: info logs every 12 hours, error logs every 3 days."
);
