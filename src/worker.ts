import "./lib/logger";
import "./lib/scheduler";
import {
  createHighPriorityWorker,
  createLowPriorityWorker,
  createMixedPriorityWorker,
} from "./utils/worker.helper";

// Initialize workers
createHighPriorityWorker();
createLowPriorityWorker();
createMixedPriorityWorker();

console.log("Workers are running and waiting for tasks...");
