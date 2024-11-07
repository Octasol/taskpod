// worker.ts
import { Worker } from "bullmq";
import Redis from "ioredis";

const redisConnection = new Redis(process.env.REDIS_URL || "", {
  maxRetriesPerRequest: null
});

// Function to create a worker
const createWorker = (id: number) => {
  const worker = new Worker(
    "taskQueue",
    async (job) => {
      // Process the task here
      console.log(`Worker ${id} processing job ${job.id} with data:`, job.data);

      // Simulate task processing (replace with actual logic)
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2));

      console.log(`Worker ${id} completed job ${job.id}`);
    },
    {
      connection: redisConnection,
      concurrency: 5 // Adjust the concurrency level as needed
    }
  );

  // Handle errors
  worker.on("failed", (job, err) => {
    if (job) console.error(`Worker ${id} - Job ${job.id} failed with error:`, err);
  });

  return worker;
};

// Create multiple workers
const numberOfWorkers = 3; // Adjust the number of workers as needed
for (let i = 1; i <= numberOfWorkers; i++) {
  createWorker(i);
}

console.log("Workers are running and waiting for tasks...");
