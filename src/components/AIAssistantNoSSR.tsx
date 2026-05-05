"use client";

import dynamic from "next/dynamic";

// Avoid SSR for the assistant panel to prevent hydration mismatches caused by
// browser extensions injecting attributes into buttons/inputs before hydration.
const Panel = dynamic(
  () => import("@/components/AIAssistantPanel").then((m) => m.AIAssistantPanel),
  { ssr: false },
);

export function AIAssistantNoSSR() {
  return <Panel />;
}

