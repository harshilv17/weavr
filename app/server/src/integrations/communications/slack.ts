import axios from "axios";

interface SlackInput {
  credentials: {
    botToken: string;
  };
  channel: string;
  text: string;
}

export async function sendSlackMessage(input: SlackInput) {
  const response = await axios.post(
    "https://slack.com/api/chat.postMessage",
    {
      channel: input.channel,
      text: input.text,
    },
    {
      headers: {
        Authorization: `Bearer ${input.credentials.botToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.data.ok) {
    throw new Error(response.data.error ?? "slack_chat_postmessage_failed");
  }

  return {
    success: true,
    status: response.status,
    ts: response.data.ts,
    channel: response.data.channel,
  };
}
