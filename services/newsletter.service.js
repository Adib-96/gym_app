import { newsletterQueue } from "../queues/newsletter.queue.js";
import { generateYearTips } from "./tips.generator.js";

export async function subscribeUser(email) {
  const tips = generateYearTips();

  for (const tip of tips) {
    await newsletterQueue.add(
      "sendTip",
      {
        email,
        title: tip.title,
        content: tip.content,
      },
      {
        delay: tip.week * 7 * 24 * 60 * 60 * 1000, // schedule each tip weekly
      }
    );
  }
}