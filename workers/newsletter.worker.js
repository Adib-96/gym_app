import { Worker } from "bullmq";
import redis from "../lib/redis.js";
import { sendGymTips } from "../lib/email.js";

const worker = new Worker(
  "newsletterQueue",
  async (job) => {
    const { email, title, content } = job.data;
    console.log("Sending email to:", email);
    await sendGymTips(email, title, content);
  },
  { connection: redis }
);

worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
worker.on("failed", (job, err) => console.log(`Job ${job.id} failed`, err));