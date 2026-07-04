import { OpenAI } from "openai";
export async function runOpenAI({
  apiKey,
  prompt,
  model,
}: {
  apiKey: string;
  prompt: string;
  model: string;
}) {
  const client = new OpenAI({
    apiKey,
  });

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return response.choices[0]?.message.content;
}
