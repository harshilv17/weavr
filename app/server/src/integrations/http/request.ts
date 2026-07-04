import axios from "axios";

interface HttpRequestInput {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}

export async function makeHttpRequest(input: HttpRequestInput) {
  const response = await axios({
    url: input.url,
    method: input.method,
    ...(input.headers && { headers: input.headers }),
    data: input.body,
  });

  return {
    status: response.status,
    headers: response.headers,
    data: response.data,
  };
}
