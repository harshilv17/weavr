import { Bot, Globe, Mail, MessageSquare, Zap } from "lucide-react";
import DocsSection from "../DocsSection";
import NodeTypeCard from "../NodeTypeCard";

export default function NodesSection() {
  return (
    <DocsSection
      id="nodes"
      title="Node Types"
      description="Every node lives under one of five categories. Add a node by dragging it from the sidebar, then fill in its configuration panel."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <NodeTypeCard
          icon={Zap}
          color="#f0b429"
          name="Trigger"
          description="Starts the workflow"
          fields={[
            { name: "Trigger Type", detail: "Manual, Webhook, or Schedule (Cron)" },
            { name: "Interval (sec)", detail: "Schedule only — minimum 60 seconds" },
          ]}
        />
        <NodeTypeCard
          icon={Bot}
          color="#a78bfa"
          name="AI Integration"
          description="Calls an AI model"
          fields={[
            { name: "Provider", detail: "Anthropic, OpenAI, or Groq" },
            {
              name: "Model",
              detail: "Depends on provider, e.g. claude-sonnet-5, gpt-5.1, llama-3.3-70b-versatile",
            },
            { name: "API Key", detail: "Provider API key" },
            {
              name: "Prompt",
              detail: "Supports {{nodeId.field}} references to earlier node output",
            },
          ]}
        />
        <NodeTypeCard
          icon={Globe}
          color="#38bdf8"
          name="HTTP Request"
          description="Calls an external API"
          fields={[
            { name: "URL", detail: "Request URL, required" },
            { name: "Method", detail: "GET, POST, PUT, PATCH, or DELETE" },
            { name: "Headers", detail: "Key-value pairs" },
            { name: "Body", detail: "Key-value pairs" },
          ]}
        />
        <NodeTypeCard
          icon={Mail}
          color="#fb7185"
          name="Email"
          description="Sends an email over SMTP"
          fields={[
            { name: "SMTP Host / Port", detail: "Your mail server" },
            { name: "Username / Password", detail: "SMTP credentials" },
            { name: "To / Subject", detail: "Recipient and subject line" },
            { name: "Body (HTML)", detail: "Supports {{nodeId.field}} references" },
          ]}
        />
        <NodeTypeCard
          icon={MessageSquare}
          color="#4ade80"
          name="Slack"
          description="Posts a Slack message"
          fields={[
            { name: "Bot Token", detail: "xoxb-... bot token" },
            { name: "Channel", detail: "#channel-name or channel ID" },
            { name: "Message", detail: "Supports {{nodeId.field}} references" },
          ]}
        />
      </div>
    </DocsSection>
  );
}
