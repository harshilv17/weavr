import Anthropic from "@anthropic-ai/sdk";

interface AnthropicInput {
  credentials: {
    apiKey: string;
  };
  prompt: string;
  model: string;
}

export async function runAnthropic(input: AnthropicInput) {
  const anthropic = new Anthropic({
    apiKey: input.credentials.apiKey,
  });

  const response = await anthropic.messages.create({
    model: input.model,
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: input.prompt,
      },
    ],
  });

  return response;
}
