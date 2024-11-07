import { Queue } from "bullmq";
import Redis from "ioredis";

const redisConnection = new Redis(process.env.REDIS_URL || "");

// Initialize the queue
export const taskQueue = new Queue("taskQueue", {
  connection: redisConnection,
});

// Function to add tasks
export const addToQueue = async (taskData: object) => {
  await taskQueue.add("task", taskData);
  console.log("Task added to the queue:", taskData);
};

const getISTTimestamp = (): string => {
  const now = new Date();

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
