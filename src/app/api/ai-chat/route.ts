import { NextResponse } from "next/server";
import { mockData } from "@/data";
import { answerFromPorts } from "@/lib/ai/portRag";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { message?: unknown };
    const message = typeof body.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        {
          answer: "Send a port intelligence question to begin.",
          matchedPorts: [],
          sources: ["ports.json"],
        },
        { status: 200 },
      );
    }

    const result = await answerFromPorts({
      message,
      ports: mockData.ports,
      useHuggingFace: true,
    });

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        answer:
          "The port intelligence assistant encountered an error. Please retry your question.",
        matchedPorts: [],
        sources: ["ports.json"],
      },
      { status: 500 },
    );
  }
}

