import { Bot, Globe, Zap, Mail, MessageSquare, type LucideIcon } from "lucide-react";

export type BuilderNodeCategory = "ai" | "http" | "trigger" | "email" | "slack";

export interface BuilderNodeDef {
  type: BuilderNodeCategory;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export const NODE_DEFS: BuilderNodeDef[] = [
  {
    type: "trigger",
    label: "Trigger",
    description: "Start the workflow",
    icon: Zap,
    color: "#f0b429",
  },
  {
    type: "ai",
    label: "AI Integration",
    description: "Call an AI model",
    icon: Bot,
    color: "#a78bfa",
  },
  {
    type: "http",
    label: "HTTP Request",
    description: "Call an external API",
    icon: Globe,
    color: "#38bdf8",
  },
  { type: "email", label: "Email", description: "Send an email", icon: Mail, color: "#fb7185" },
  {
    type: "slack",
    label: "Slack",
    description: "Post a Slack message",
    icon: MessageSquare,
    color: "#4ade80",
  },
];

export function getNodeDef(type: BuilderNodeCategory | undefined) {
  return NODE_DEFS.find((n) => n.type === type);
}

export const DRAG_DATA_FORMAT = "application/weavr-node";
