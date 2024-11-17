import { Queue } from "bullmq";
import Redis from "ioredis";

const redisConnection = new Redis(process.env.REDIS_URL || "", {
  maxRetriesPerRequest: null,
});
const highPriorityQueueName = "highPriorityQueue";
const lowPriorityQueueName = "lowPriorityQueue";
// const queue = new Queue("taskQueue", { connection: redisConnection });
const highPriorityQueue = new Queue(highPriorityQueueName, {
  connection: redisConnection,
});
const lowPriorityQueue = new Queue(lowPriorityQueueName, {
  connection: redisConnection,
});
async function getIncompleteJobs() {
  try {
    // Get jobs in various incomplete states
    const lwaitingJobs = await lowPriorityQueue.getWaiting();
    const lactiveJobs = await lowPriorityQueue.getActive();
    const ldelayedJobs = await lowPriorityQueue.getDelayed();

    const hwaitingJobs = await highPriorityQueue.getWaiting();
    const hactiveJobs = await highPriorityQueue.getActive();
    const hdelayedJobs = await highPriorityQueue.getDelayed();

    const waitingJobs = [...lwaitingJobs, ...hwaitingJobs];
    const activeJobs = [...lactiveJobs, ...hactiveJobs];
    const delayedJobs = [...ldelayedJobs, ...hdelayedJobs];

    // Combine all incomplete jobs
    const incompleteJobs = [...waitingJobs, ...activeJobs, ...delayedJobs];

    // Display incomplete job details
    for (const job of incompleteJobs) {
      console.log(`Job ID: ${job.id}`);
      console.log(`Job Data:`, job.data);
      let jobState = await job.getState();
      console.log(`Job State:`, jobState);
      console.log(job.queueName);
      console.log("----------");
    }

    // Get the total number of completed jobs
    const completedJobsCount =
      (await highPriorityQueue.getCompletedCount()) +
      (await lowPriorityQueue.getCompletedCount());
    console.log(`Total number of completed jobs: ${completedJobsCount}`);
    console.log(await highPriorityQueue.getJobCounts());
    console.log(await lowPriorityQueue.getJobCounts());
  } catch (error) {
    console.error("Error retrieving incomplete jobs:", error);
  } finally {
    await highPriorityQueue.close();
    await lowPriorityQueue.close();
    await redisConnection.quit();
  }
}

getIncompleteJobs();
