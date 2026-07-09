import { VerificationEmailQueue } from "../config/queue/VerificationEmail.queue.ts";
export async function addVerificationEmailJob(data: { email: string; code: string }) {
  return VerificationEmailQueue.add("send-verification-email", data, {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 50,
  });
}
