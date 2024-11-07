import { Queue, Worker } from "bullmq";
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

// Worker to handle tasks from both high and low priority queues
const createMixedPriorityWorker = async () => {
  let queueName;
  if ((await highPriorityQueue.getWaitingCount()) == 0) {
    queueName = lowPriorityQueueName;
  } else {
    queueName = highPriorityQueueName;
  }
  const worker = new Worker(
    queueName,
    async (job) => {
      const queueType =
        job.queueName === highPriorityQueueName ? "High" : "Low";
      console.log(
        `Mixed: ${queueType}-Priority Job Worker processing job ${job.id} with data:`,
        job.data
      );
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate task processing
      console.log(`Mixed: ${queueType}-Priority Job Worker completed job ${job.id}`);
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
  return worker;
};

// Initialize workers
createHighPriorityWorker(); // Worker dedicated to high-priority tasks
createLowPriorityWorker(); // Worker dedicated to low-priority tasks
createMixedPriorityWorker(); // Worker that processes tasks from both queues

console.log("Workers are running and waiting for tasks...");
