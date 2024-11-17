import { Queue } from "bullmq";
import Redis from "ioredis";

const redisConnection = new Redis(process.env.REDIS_URL || "");

// Initialize the queue
// export const taskQueue = new Queue("taskQueue", {
//   connection: redisConnection,
// });

const highPriorityQueueName = "highPriorityQueue";
const lowPriorityQueueName = "lowPriorityQueue";

const highPriorityQueue = new Queue(highPriorityQueueName, {
  connection: redisConnection,
});
const lowPriorityQueue = new Queue(lowPriorityQueueName, {
  connection: redisConnection,
});
// Function to add tasks
export const addToQueue = async (taskData: object) => {
  const num = Math.random() < 0.5 ? 1 : 10;
  // await taskQueue.add("task", taskData, {
  //   priority: num,
  // });
  if (num === 1) {
    await highPriorityQueue.add("task", taskData);
  } else {
    const jobs = await lowPriorityQueue.getJobs([
      "waiting",
      "active",
      "delayed",
      "paused",
    ]);
    const isDuplicate = jobs.some(
      (job) => JSON.stringify(job.data) === JSON.stringify(taskData)
    );
    if (isDuplicate) {
      console.log("Duplicate task found, not enqueuing.");
      return;
    }
    await lowPriorityQueue.add("task", taskData);
  }
  console.log("Task added to the queue:", taskData, num);
};

const now = new Date();
const getISTTimestamp = (): string => {

  return now.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
};
const run = async () => {
  let time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  time = getISTTimestamp();
  await addToQueue({
    time: time,
  });
  console.log("Task added and console exited.");
  process.exit(0);
};

run();
