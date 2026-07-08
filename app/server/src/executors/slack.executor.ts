import type { WorkflowNode } from "../types/types.ts";
import { sendSlackMessage } from "../integrations/communications/slack.ts";

export async function executeSlackNode(
  node: WorkflowNode,
  credentials: {
    botToken: string;
  },
) {
  console.log(`[node ${node.id}] slack: started`);
  const result = await sendSlackMessage({
    credentials,
    channel: node.data.channel,
    text: node.data.text,
  });
  console.log(`[node ${node.id}] slack: completed`);
  return result;
}
