import cron from "node-cron";
import { cleanupErrorLogs, cleanupInfoLogs } from "../utils/cleanupLogs";

// Schedule cleanup for info logs every 6 hours
cron.schedule("0 */6 * * *", () => {
  cleanupInfoLogs();
});

// Schedule cleanup for error logs every 2 days
cron.schedule("0 0 */2 * *", () => {
  cleanupErrorLogs();
});

console.log(
  "Cron jobs scheduled: info logs every 6 hours, error logs every 2 days."
);
