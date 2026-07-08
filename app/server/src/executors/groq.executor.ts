import type { WorkflowNode } from "../types/types.ts";
import { runGroq } from "../integrations/ai/groq.ts";

export async function executeGroqNode(
  node: WorkflowNode,
  credentials: {
    apiKey: string;
  },
) {
  console.log(`[node ${node.id}] groq: started`);
  const result = await runGroq({
    credentials,
    prompt: node.data.prompt,
    model: node.data.model,
  });
  console.log(`[node ${node.id}] groq: completed`);
  return result;
}
