import {
  createHighPriorityWorker,
  createLowPriorityWorker,
  createMixedPriorityWorker,
} from "./worker.helper";

// Initialize workers
createHighPriorityWorker();
createLowPriorityWorker();
createMixedPriorityWorker();

console.log("Workers are running and waiting for tasks...");
