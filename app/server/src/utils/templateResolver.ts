const PLACEHOLDER_PATTERN = /\{\{\s*([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_.-]+)\s*\}\}/g;

const FORBIDDEN_KEYS = new Set(["__proto__", "prototype", "constructor"]);

function resolvePath(source: unknown, path: string): unknown {
  const segments = path.split(".");
  let current: unknown = source;

  for (const segment of segments) {
    if (FORBIDDEN_KEYS.has(segment)) return undefined;
    if (current === null || current === undefined) return undefined;
    if (typeof current !== "object") return undefined;

    current = (current as Record<string, unknown>)[segment];
  }

  return current;
}

function resolvePlaceholder(
  nodeId: string,
  path: string,
  nodeOutputs: Record<string, unknown>,
): unknown {
  if (FORBIDDEN_KEYS.has(nodeId)) return undefined;
  const nodeOutput = nodeOutputs[nodeId];
  if (nodeOutput === undefined) return undefined;
  return resolvePath(nodeOutput, path);
}

function resolveString(value: string, nodeOutputs: Record<string, unknown>): unknown {
  const fullMatch = value.match(/^\{\{\s*([a-zA-Z0-9_-]+)\.([a-zA-Z0-9_.-]+)\s*\}\}$/);
  if (fullMatch) {
    const [, nodeId, path] = fullMatch as unknown as [string, string, string];
    return resolvePlaceholder(nodeId, path, nodeOutputs);
  }

  return value.replace(PLACEHOLDER_PATTERN, (match, nodeId, path) => {
    const resolved = resolvePlaceholder(nodeId, path, nodeOutputs);
    if (resolved === undefined) return "";
    if (typeof resolved === "string") return resolved;
    if (typeof resolved === "number" || typeof resolved === "boolean") return String(resolved);
    try {
      return JSON.stringify(resolved);
    } catch {
      return "";
    }
  });
}

export function resolveTemplate(
  value: unknown,
  nodeOutputs: Record<string, unknown>,
  seen = new WeakSet<object>(),
): unknown {
  if (typeof value === "string") {
    return resolveString(value, nodeOutputs);
  }

  if (Array.isArray(value)) {
    return value.map((item) => resolveTemplate(item, nodeOutputs, seen));
  }

  if (value !== null && typeof value === "object") {
    if (seen.has(value)) return value;
    seen.add(value);

    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.has(key)) continue;
      result[key] = resolveTemplate(val, nodeOutputs, seen);
    }
    return result;
  }

  return value;
}
