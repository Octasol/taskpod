import { Queue } from "bullmq";
import Redis from "ioredis";

const redisConnection = new Redis(process.env.REDIS_URL || "", {
  maxRetriesPerRequest: null,
});

const queue = new Queue("taskQueue", { connection: redisConnection });

async function getIncompleteJobs() {
  try {
    // Get jobs in various incomplete states
    const waitingJobs = await queue.getWaiting();
    const activeJobs = await queue.getActive();
    const delayedJobs = await queue.getDelayed();

    // Combine all incomplete jobs
    const incompleteJobs = [...waitingJobs, ...activeJobs, ...delayedJobs];

    // Display incomplete job details
    for (const job of incompleteJobs) {
      console.log(`Job ID: ${job.id}`);
      console.log(`Job Data:`, job.data);
      let jobState = await job.getState();
      console.log(`Job State:`, jobState);
      console.log("----------");
    }

    // Get the total number of completed jobs
    const completedJobsCount = await queue.getCompletedCount();
    console.log(`Total number of completed jobs: ${completedJobsCount}`);
  } catch (error) {
    console.error("Error retrieving incomplete jobs:", error);
  } finally {
    await queue.close();
    await redisConnection.quit();
  }
}

getIncompleteJobs();
