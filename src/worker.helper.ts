import { Worker } from "bullmq";
import { redisConnection } from "./connection";
import { highPriorityQueue } from "./queue";
import { logger } from "./logger";
import { highPriorityQueueName, lowPriorityQueueName } from "./constants";

// Worker to handle high-priority tasks only
/**
 * Creates a high-priority worker that processes jobs from the high-priority queue.
 *
 * The worker logs the start and completion of each job, simulates task processing
 * with a delay, and handles job failures by logging the error.
 *
 * @returns {Worker} The high-priority worker instance.
 */
export const createHighPriorityWorker = () => {
  const worker = new Worker(
    highPriorityQueueName,
    async (job) => {
      logger.info(
        `High-Priority Worker processing job ${job.id} with data:`,
        job.data
      );
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate task processing
      logger.info(`High-Priority Worker completed job ${job.id}`);
    },
    {
      connection: redisConnection,
    }
  );

  worker.on("failed", (job, err) => {
    if (job) {
      logger.error(
        `High-Priority Worker - Job ${job.id} failed with error:`,
        err
      );
    }
  });
  return worker;
};

// Worker to handle low-priority tasks only
/**
 * Creates a low-priority worker that processes jobs from the low-priority queue.
 *
 * The worker logs the job details, simulates task processing by waiting for 2 seconds,
 * and logs the completion of the job. If a job fails, it logs the error details.
 *
 * @returns {Worker} The low-priority worker instance.
 */
export const createLowPriorityWorker = () => {
  const worker = new Worker(
    lowPriorityQueueName,
    async (job) => {
      logger.info(
        `Low-Priority Worker processing job ${job.id} with data:`,
        job.data
      );
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate task processing
      logger.info(`Low-Priority Worker completed job ${job.id}`);
    },
    {
      connection: redisConnection,
    }
  );

  worker.on("failed", (job, err) => {
    if (job)
      logger.error(
        `Low-Priority Worker - Job ${job.id} failed with error:`,
        err
      );
  });
  return worker;
};

// Worker to handle tasks from both high and low priority queues dynamically
/**
 * Creates a mixed-priority worker that switches between processing high and low priority queues.
 *
 * The worker initially starts with the low-priority queue and periodically checks the high-priority queue.
 * If there are jobs waiting in the high-priority queue, the worker switches to process those jobs.
 * Once the high-priority queue is empty, the worker switches back to the low-priority queue.
 *
 * @returns {Promise<Worker | null>} A promise that resolves to the worker instance.
 */
export const createMixedPriorityWorker = async () => {
  let currentQueueName = lowPriorityQueueName;
  let worker: Worker | null = null;

  const switchToQueue = async (queueName: string) => {
    if (worker) {
      await worker.close();
      logger.info(`Mixed-Priority Worker stopped for ${currentQueueName}`);
    }

    currentQueueName = queueName;
    worker = new Worker(
      currentQueueName,
      async (job) => {
        const queueType =
          job.queueName === highPriorityQueueName ? "High" : "Low";
        logger.info(
          `Mixed: ${queueType}-Priority Job Worker processing job ${job.id} with data:`,
          job.data
        );
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate task processing
        logger.info(
          `Mixed: ${queueType}-Priority Job Worker completed job ${job.id}`
        );
      },
      {
        connection: redisConnection,
      }
    );

    worker.on("failed", (job, err) => {
      if (job)
        logger.error(
          `Mixed-Priority Worker - Job ${job.id} failed with error:`,
          err
        );
    });
    logger.info(`Mixed-Priority Worker started for ${currentQueueName}`);
  };

  // Initially, start the worker with low-priority tasks
  await switchToQueue(lowPriorityQueueName);

  setInterval(async () => {
    const highPriorityJobCount = await highPriorityQueue.getWaitingCount();
    if (
      highPriorityJobCount > 0 &&
      currentQueueName !== highPriorityQueueName
    ) {
      logger.info("Switching Mixed-Priority Worker to high-priority queue.");
      await switchToQueue(highPriorityQueueName);
    } else if (
      highPriorityJobCount === 0 &&
      currentQueueName !== lowPriorityQueueName
    ) {
      logger.info(
        "Switching Mixed-Priority Worker back to low-priority queue."
      );
      await switchToQueue(lowPriorityQueueName);
    }
  }, 1000);

  return worker;
};
