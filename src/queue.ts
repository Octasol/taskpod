import { Queue } from "bullmq";
import { redisConnection } from "./connection";
import { highPriorityQueueName, lowPriorityQueueName } from "./constants";

export const highPriorityQueue = new Queue(highPriorityQueueName, {
  connection: redisConnection,
});
export const lowPriorityQueue = new Queue(lowPriorityQueueName, {
  connection: redisConnection,
});
