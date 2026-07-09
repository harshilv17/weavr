import { Worker, type Job } from "bullmq";
import { connection } from "../config/queue/VerificationEmail.queue.ts";
import { sendVerificationEmail } from "../utils/emailsend.ts";
import logger from "../utils/logger.ts";

export type VerificationEmailJobData = {
  email: string;
  code: string;
};

export const verificationMailWorker = new Worker<VerificationEmailJobData>(
  "send-verification-email",
  async (job: Job<VerificationEmailJobData>) => {
    const { email, code } = job.data;
    await sendVerificationEmail(email, code);
  },
  { connection },
);

verificationMailWorker.on("completed", (job) => {
  logger.info(`Verification email sent for job ${job.id} (${job.data.email})`);
});

verificationMailWorker.on("failed", (job, err) => {
  logger.error(`Verification email job ${job?.id} failed`, err);
});
