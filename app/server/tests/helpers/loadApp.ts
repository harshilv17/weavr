import type { Express } from "express";

export async function loadApp(): Promise<Express> {
  const { default: app } = await import("../../src/app.ts");
  return app;
}
