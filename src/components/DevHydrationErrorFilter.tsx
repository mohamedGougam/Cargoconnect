"use client";

import { useEffect } from "react";

/**
 * In dev, Next shows a full-screen overlay when console.error fires for hydration mismatches.
 * Many users see this due to browser extensions injecting attributes (e.g. `fdprocessedid`).
 * This filter suppresses those specific noisy errors in development so the UI remains usable.
 */
export function DevHydrationErrorFilter() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      const first = args[0];
      const msg = typeof first === "string" ? first : "";

      const isHydrationNoise =
        msg.includes("A tree hydrated but some attributes") ||
        msg.includes("did not match the client properties") ||
        msg.includes("Hydration failed because");

      if (isHydrationNoise) return;
      originalError(...args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return null;
}

