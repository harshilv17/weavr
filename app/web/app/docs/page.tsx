import type { Metadata } from "next";
import DocsClient from "@/components/docs/DocsClient";

export const metadata: Metadata = {
  title: "Documentation",
  description: "How to build, connect, and debug workflows in Weavr.",
  alternates: { canonical: "/docs" },
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0d] text-[#FAFAFA]">
      <DocsClient />
    </div>
  );
}
