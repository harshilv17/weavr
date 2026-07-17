export type WorkflowStatus = "draft" | "active" | "completed";

export interface WorkflowItem {
  id: number;
  userId: number;
  name: string;
  description: string;
  graphJson: unknown;
  status: WorkflowStatus;
  scheduleEnabled: boolean;
  scheduleIntervalSeconds: number | null;
  createdAt: string;
  updatedAt: string;
}

export const PAGE_SIZE = 8;
