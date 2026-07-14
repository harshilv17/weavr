import type { MetadataRoute } from "next";

const BASE_URL = "https://weavr.builder-net.tech";

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/dashboard", "/builder/", "/verification/", "/api/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      // AI answer engines and assistants — explicitly welcome on public pages
      // so the site stays citable in ChatGPT, Claude, Perplexity, and AI Overviews.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "Claude-User",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "meta-externalagent",
          "CCBot",
        ],
        allow: "/",
        disallow,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
