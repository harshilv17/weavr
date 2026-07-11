const CSRF_TOKEN = "test-csrf-token-0123456789abcdef0123456789abcdef";

export function csrfCookie(): string {
  return `XSRF-TOKEN=${CSRF_TOKEN}`;
}

export function csrfHeader(): Record<string, string> {
  return { "x-xsrf-token": CSRF_TOKEN };
}
