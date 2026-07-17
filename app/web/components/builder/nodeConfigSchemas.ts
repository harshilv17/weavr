import type { BuilderNodeCategory } from "./nodeTypes";

export type FieldType = "text" | "textarea" | "select" | "password" | "number" | "keyvalue";

export interface ConfigField {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

export const AI_PROVIDERS = [
  {
    value: "anthropic",
    label: "Anthropic",
    models: ["claude-opus-4-8", "claude-sonnet-5", "claude-haiku-4-5-20251001"],
  },
  {
    value: "openai",
    label: "OpenAI",
    models: ["gpt-5.1", "gpt-5.1-mini", "gpt-5.1-nano"],
  },
  {
    value: "groq",
    label: "Groq",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"],
  },
] as const;

export type AIProviderValue = (typeof AI_PROVIDERS)[number]["value"];

// Fields shared by every AI provider, once a provider is chosen.
const AI_COMMON_FIELDS: ConfigField[] = [
  { key: "apiKey", label: "API Key", type: "password", placeholder: "sk-...", required: true },
  {
    key: "prompt",
    label: "Prompt",
    type: "textarea",
    placeholder: "Enter the prompt to send",
    required: true,
  },
];

export function getAIModelField(provider: AIProviderValue | undefined): ConfigField {
  const models = AI_PROVIDERS.find((p) => p.value === provider)?.models ?? [];
  return {
    key: "model",
    label: "Model",
    type: "select",
    required: true,
    options: models.map((m) => ({ value: m, label: m })),
  };
}

export function getAIProviderFields(provider: AIProviderValue | undefined): ConfigField[] {
  if (!provider) return [];
  return [getAIModelField(provider), ...AI_COMMON_FIELDS];
}

const HTTP_METHOD_OPTIONS = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
  { value: "DELETE", label: "DELETE" },
];

export const NODE_CONFIG_FIELDS: Record<
  Exclude<BuilderNodeCategory, "ai" | "trigger">,
  ConfigField[]
> = {
  http: [
    {
      key: "url",
      label: "URL",
      type: "text",
      placeholder: "https://api.example.com/endpoint",
      required: true,
    },
    {
      key: "method",
      label: "Method",
      type: "select",
      options: HTTP_METHOD_OPTIONS,
      required: true,
    },
    { key: "headers", label: "Headers", type: "keyvalue" },
    { key: "body", label: "Body", type: "keyvalue" },
  ],
  email: [
    {
      key: "host",
      label: "SMTP Host",
      type: "text",
      placeholder: "smtp.example.com",
      required: true,
    },
    { key: "port", label: "SMTP Port", type: "number", placeholder: "587", required: true },
    { key: "username", label: "Username", type: "text", required: true },
    { key: "password", label: "Password", type: "password", required: true },
    { key: "to", label: "To", type: "text", placeholder: "recipient@example.com", required: true },
    { key: "subject", label: "Subject", type: "text", required: true },
    { key: "html", label: "Body (HTML)", type: "textarea", required: true },
  ],
  slack: [
    {
      key: "botToken",
      label: "Bot Token",
      type: "password",
      placeholder: "xoxb-...",
      required: true,
    },
    {
      key: "channel",
      label: "Channel",
      type: "text",
      placeholder: "#general or C0123456789",
      required: true,
    },
    { key: "text", label: "Message", type: "textarea", required: true },
  ],
};

export const MIN_SCHEDULE_INTERVAL_SECONDS = 60;

export const TRIGGER_TYPE_FIELD: ConfigField = {
  key: "type",
  label: "Trigger Type",
  type: "select",
  required: true,
  options: [
    { value: "manual", label: "Manual" },
    { value: "webhook", label: "Webhook" },
    { value: "cron", label: "Schedule (Cron)" },
  ],
};

const CRON_INTERVAL_FIELD: ConfigField = {
  key: "intervalSeconds",
  label: "Interval (seconds)",
  type: "number",
  placeholder: `Minimum ${MIN_SCHEDULE_INTERVAL_SECONDS}`,
  required: true,
};

export function getTriggerFields(type: string | undefined): ConfigField[] {
  if (type === "cron") return [TRIGGER_TYPE_FIELD, CRON_INTERVAL_FIELD];
  return [TRIGGER_TYPE_FIELD];
}
