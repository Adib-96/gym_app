import { Queue } from "bullmq";
import redis from "../lib/redis.js";

export const newsletterQueue = new Queue("newsletterQueue", {
  connection: redis,
});