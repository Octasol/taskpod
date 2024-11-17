import { Queue } from "bullmq";
import { redisConnection } from "../config/redis-connection";
import {
  highPriorityQueueName,
  lowPriorityQueueName,
} from "../config/constants";

export const highPriorityQueue = new Queue(highPriorityQueueName, {
  connection: redisConnection,
});
export const lowPriorityQueue = new Queue(lowPriorityQueueName, {
  connection: redisConnection,
});
