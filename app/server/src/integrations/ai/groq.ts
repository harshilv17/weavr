import Groq from "groq-sdk";

interface GroqInput {
  credentials: {
    apiKey: string;
  };
  prompt: string;
  model: string;
}

export async function runGroq(input: GroqInput) {
  const groq = new Groq({
    apiKey: input.credentials.apiKey,
  });

  const response = await groq.chat.completions.create({
    model: input.model,
    messages: [
      {
        role: "user",
        content: input.prompt,
      },
    ],
  });

  return {
    content: response.choices[0]?.message.content,
  };
}
