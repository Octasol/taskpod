import { Queue, Worker, Job } from "bullmq";
import Redis from "ioredis";

const redisConnection = new Redis(process.env.REDIS_URL || "", {
  maxRetriesPerRequest: null,
});

// Define separate queue names for high and low priorities
const highPriorityQueueName = "highPriorityQueue";
const lowPriorityQueueName = "lowPriorityQueue";

// Initialize the queues
const highPriorityQueue = new Queue(highPriorityQueueName, {
  connection: redisConnection,
});
const lowPriorityQueue = new Queue(lowPriorityQueueName, {
  connection: redisConnection,
});

// Worker to handle high-priority tasks only
const createHighPriorityWorker = () => {
  const worker = new Worker(
    highPriorityQueueName,
    async (job) => {
      console.log(
        `High-Priority Worker processing job ${job.id} with data:`,
        job.data
      );
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate task processing
      console.log(`High-Priority Worker completed job ${job.id}`);
    },
    {
      connection: redisConnection,
    }
  );

  worker.on("failed", (job, err) => {
    if (job)
      console.error(
        `High-Priority Worker - Job ${job.id} failed with error:`,
        err
      );
  });
  return worker;
};

// Worker to handle low-priority tasks only
const createLowPriorityWorker = () => {
  const worker = new Worker(
    lowPriorityQueueName,
    async (job) => {
      console.log(
        `Low-Priority Worker processing job ${job.id} with data:`,
        job.data
      );
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate task processing
      console.log(`Low-Priority Worker completed job ${job.id}`);
    },
    {
      connection: redisConnection,
    }
  );

  worker.on("failed", (job, err) => {
    if (job)
      console.error(
        `Low-Priority Worker - Job ${job.id} failed with error:`,
        err
      );
  });
  return worker;
};

// Worker to handle tasks from both high and low priority queues dynamically
const createMixedPriorityWorker = async () => {
  let currentQueueName = lowPriorityQueueName;
  let worker: Worker | null = null;

  const switchToQueue = async (queueName: string) => {
    if (worker) {
      await worker.close();
      console.log(`Mixed-Priority Worker stopped for ${currentQueueName}`);
    }

    currentQueueName = queueName;
    worker = new Worker(
      currentQueueName,
      async (job) => {
        const queueType =
          job.queueName === highPriorityQueueName ? "High" : "Low";
        console.log(
          `Mixed: ${queueType}-Priority Job Worker processing job ${job.id} with data:`,
          job.data
        );
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate task processing
        console.log(
          `Mixed: ${queueType}-Priority Job Worker completed job ${job.id}`
        );
      },
      {
        connection: redisConnection,
      }
    );

    worker.on("failed", (job, err) => {
      if (job)
        console.error(
          `Mixed-Priority Worker - Job ${job.id} failed with error:`,
          err
        );
    });
    console.log(`Mixed-Priority Worker started for ${currentQueueName}`);
  };

  // Initially, start the worker with low-priority tasks
  await switchToQueue(lowPriorityQueueName);

  // Check periodically for high-priority tasks
  setInterval(async () => {
    const highPriorityJobCount = await highPriorityQueue.getWaitingCount();
    if (
      highPriorityJobCount > 0 &&
      currentQueueName !== highPriorityQueueName
    ) {
      // Switch to high-priority queue if there are waiting high-priority jobs
      console.log("Switching Mixed-Priority Worker to high-priority queue.");
      await switchToQueue(highPriorityQueueName);
    } else if (
      highPriorityJobCount === 0 &&
      currentQueueName !== lowPriorityQueueName
    ) {
      // Switch back to low-priority queue if no high-priority jobs are waiting
      console.log(
        "Switching Mixed-Priority Worker back to low-priority queue."
      );
      await switchToQueue(lowPriorityQueueName);
    }
  }, 1000); // Check every second

  return worker;
};

// Initialize workers
createHighPriorityWorker(); // Worker dedicated to high-priority tasks
createLowPriorityWorker(); // Worker dedicated to low-priority tasks
createMixedPriorityWorker(); // Worker that processes tasks from both queues

console.log("Workers are running and waiting for tasks...");
