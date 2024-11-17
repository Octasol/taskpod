import { Queue } from "bullmq";
import { redisConnection } from "./connection";

export const highPriorityQueue = new Queue(highPriorityQueueName, {
  connection: redisConnection,
});
export const lowPriorityQueue = new Queue(lowPriorityQueueName, {
  connection: redisConnection,
});
