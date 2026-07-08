import type { WorkflowNode } from "../types/types.ts";
import { runAnthropic } from "../integrations/ai/anthropic.ts";

export async function executeAnthropicNode(
  node: WorkflowNode,
  credentials: {
    apiKey: string;
  },
) {
  console.log(`[node ${node.id}] anthropic: started`);
  const response = await runAnthropic({
    credentials,
    prompt: node.data.prompt,
    model: node.data.model,
  });

  const content = response.content
    .filter((block): block is Extract<typeof block, { type: "text" }> => block.type === "text")
    .map((block) => block.text)
    .join("");

  console.log(`[node ${node.id}] anthropic: completed`);
  return { content };
}
