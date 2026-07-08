import { runOpenAI } from "../integrations/ai/openai.ts";
import type { WorkflowNode } from "../types/types.ts";

export async function executeOpenAINode(
  node: WorkflowNode,
  credentials: {
    apiKey: string;
  },
) {
  console.log(`[node ${node.id}] openai: started`);
  const content = await runOpenAI({
    apiKey: credentials.apiKey,
    prompt: node.data.prompt,
    model: node.data.model,
  });
  console.log(`[node ${node.id}] openai: completed`);

  return { content };
}
