import type { WorkflowNode } from "../types/types.ts";
import { sendEmail } from "../integrations/communications/email.ts";

export async function executeEmailNode(
  node: WorkflowNode,
  credentials: {
    host: string;
    port: number;
    username: string;
    password: string;
  },
) {
  console.log(`[node ${node.id}] email: started`);
  const result = await sendEmail({
    credentials,
    to: node.data.to,
    subject: node.data.subject,
    html: node.data.html,
  });
  console.log(`[node ${node.id}] email: completed`);
  return result;
}
