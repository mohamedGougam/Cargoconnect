import type { PortRecord } from "@/data";

export type RagResult = {
  answer: string;
  matchedPorts: string[];
  sources: string[];
};

type Intent =
  | { kind: "compare"; ports: PortRecord[] }
  | { kind: "field"; ports: PortRecord[]; field: FieldKey }
  | { kind: "filter"; ports: PortRecord[]; filter: FilterKey }
  | { kind: "overview"; ports: PortRecord[] };

type FieldKey =
  | "draftDepthM"
  | "channelDepthM"
  | "congestion"
  | "waitingHours"
  | "annualThroughputTeu"
  | "cranesSts"
  | "megaMaxCranes"
  | "berthsContainer"
  | "coldChainCapacity"
  | "routes"
  | "portType"
  | "loading";

type FilterKey = "lowCongestion" | "coldChainBest";

function norm(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function tokenize(s: string) {
  return norm(s).split(/\s+/g).filter(Boolean);
}

function scorePort(qTokens: string[], p: PortRecord): number {
  const hay = `${p.id} ${p.name} ${p.country} ${p.unLocode} ${p.gatewayLabel} ${p.portType} ${p.congestion} ${p.waitingHours} ${p.coldChainCapacity} ${p.routes.join(" ")}`;
  const hTokens = new Set(tokenize(hay));
  let score = 0;
  for (const t of qTokens) {
    if (hTokens.has(t)) score += 2;
  }
  // bonus: direct id mention
  if (qTokens.includes(p.id)) score += 8;
  return score;
}

export function retrievePorts(message: string, ports: PortRecord[]): PortRecord[] {
  const qTokens = tokenize(message);
  const scored = ports
    .map((p) => ({ p, s: scorePort(qTokens, p) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);

  // If user asked for a comparison, prefer top 2.
  const wantsCompare =
    /\bcompare\b/.test(message.toLowerCase()) || /\bvs\b|\bversus\b/.test(message.toLowerCase());
  const top = scored.slice(0, wantsCompare ? 2 : 4).map((x) => x.p);

  // If no matches, return empty; caller will fall back to generic guidance.
  return top;
}

function detectField(message: string): FieldKey | null {
  const m = message.toLowerCase();
  if (m.includes("draft")) return "draftDepthM";
  if (m.includes("channel")) return "channelDepthM";
  if (m.includes("congestion")) return "congestion";
  if (m.includes("waiting") || m.includes("wait time")) return "waitingHours";
  if (m.includes("throughput") || m.includes("teu")) return "annualThroughputTeu";
  if (m.includes("sts") || m.includes("crane")) return "cranesSts";
  if (m.includes("mega") && m.includes("crane")) return "megaMaxCranes";
  if (m.includes("berth")) return "berthsContainer";
  if (m.includes("cold") || m.includes("reefer")) return "coldChainCapacity";
  if (m.includes("route") || m.includes("connection")) return "routes";
  if (m.includes("type")) return "portType";
  if (m.includes("loading")) return "loading";
  return null;
}

function detectFilter(message: string): FilterKey | null {
  const m = message.toLowerCase();
  if (m.includes("lowest congestion") || (m.includes("low") && m.includes("congestion"))) {
    return "lowCongestion";
  }
  if (m.includes("cold chain") || m.includes("cold-chain") || m.includes("reefer")) {
    return "coldChainBest";
  }
  return null;
}

function formatTeu(n: number) {
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M TEU/yr`;
  return `${Math.round(n / 1_000)}k TEU/yr`;
}

function portLine(p: PortRecord) {
  return `${p.name} (${p.id}) — Draft ${p.draftDepthM}m · Congestion ${p.congestion} · Wait ${p.waitingHours}`;
}

function buildIntent(message: string, ports: PortRecord[]): Intent {
  const m = message.toLowerCase();
  const field = detectField(message);
  const filter = detectFilter(message);
  const isCompare = /\bcompare\b/.test(m) || /\bvs\b|\bversus\b/.test(m);
  if (isCompare && ports.length >= 2) return { kind: "compare", ports: ports.slice(0, 2) };
  if (filter) return { kind: "filter", ports, filter };
  if (field) return { kind: "field", ports, field };
  return { kind: "overview", ports };
}

function safeMissing(fieldLabel: string) {
  return `I do not have enough operational data for **${fieldLabel}** yet, but the port record can be enriched.`;
}

function renderAnswer(message: string, ports: PortRecord[], allPorts: PortRecord[]): string {
  const intent = buildIntent(message, ports);

  if (intent.kind === "filter") {
    if (intent.filter === "lowCongestion") {
      const candidates = allPorts
        .filter((p) => /low/i.test(p.congestion))
        .slice(0, 5);
      if (!candidates.length) return safeMissing("congestion");
      const head = candidates[0]!;
      return [
        `Based on the available port intelligence data, **${head.name}** currently shows **${head.congestion} congestion**, with an estimated waiting time of **${head.waitingHours}** and draft depth of **${head.draftDepthM}m**.`,
        ``,
        `Other low-congestion ports in the dataset:`,
        candidates.map((p) => `- ${portLine(p)}`).join("\n"),
      ].join("\n");
    }

    if (intent.filter === "coldChainBest") {
      const candidates = allPorts
        .filter((p) => /very high|high/i.test(p.coldChainCapacity))
        .slice(0, 5);
      if (!candidates.length) return safeMissing("cold-chain capacity");
      return [
        `For cold-chain cargo, these ports rank highest **based on the dataset’s cold-chain capacity field**:`,
        candidates
          .map(
            (p) =>
              `- **${p.name}**: ${p.coldChainCapacity} cold-chain capacity · Wait ${p.waitingHours} · Draft ${p.draftDepthM}m`,
          )
          .join("\n"),
      ].join("\n");
    }
  }

  if (intent.kind === "compare") {
    const [a, b] = intent.ports;
    return [
      `Here’s a grounded comparison based on Cargoconnect’s port dataset:`,
      ``,
      `- **${a.name}**: Draft ${a.draftDepthM}m · Channel ${a.channelDepthM}m · Congestion ${a.congestion} · Wait ${a.waitingHours} · Throughput ${formatTeu(a.annualThroughputTeu)}`,
      `- **${b.name}**: Draft ${b.draftDepthM}m · Channel ${b.channelDepthM}m · Congestion ${b.congestion} · Wait ${b.waitingHours} · Throughput ${formatTeu(b.annualThroughputTeu)}`,
      ``,
      `If you tell me your cargo type (container / Ro-Ro / bulk / cold-chain) and target lane, I can recommend the better fit using only these fields.`,
    ].join("\n");
  }

  if (intent.kind === "field") {
    const p = intent.ports[0];
    if (!p) return safeMissing("that port");

    switch (intent.field) {
      case "draftDepthM":
        return `**${p.name}** draft depth is **${p.draftDepthM}m** (channel depth: **${p.channelDepthM}m**).`;
      case "channelDepthM":
        return `**${p.name}** channel depth is **${p.channelDepthM}m** (draft at berth: **${p.draftDepthM}m**).`;
      case "congestion":
        return `**${p.name}** is marked as **${p.congestion}** congestion with an estimated waiting time of **${p.waitingHours}**.`;
      case "waitingHours":
        return `**${p.name}** estimated waiting time is **${p.waitingHours}** (congestion: **${p.congestion}**).`;
      case "annualThroughputTeu":
        return `**${p.name}** annual throughput is **${formatTeu(p.annualThroughputTeu)}** (TEU/year).`;
      case "coldChainCapacity":
        return `**${p.name}** cold-chain capacity is **${p.coldChainCapacity}** in the dataset.`;
      case "routes":
        if (!p.routes?.length) return safeMissing("liner connections");
        return [
          `**${p.name}** sample liner connections:`,
          p.routes.slice(0, 8).map((r) => `- ${r}`).join("\n"),
        ].join("\n");
      case "portType":
        return `**${p.name}** port type: **${p.portType}**.`;
      case "cranesSts":
        return `**${p.name}** STS cranes: **${p.cranesSts.toLocaleString("en-US")}** (mega-max cranes: **${p.megaMaxCranes.toLocaleString("en-US")}**).`;
      case "megaMaxCranes":
        return `**${p.name}** mega-max cranes: **${p.megaMaxCranes.toLocaleString("en-US")}** (STS cranes: **${p.cranesSts.toLocaleString("en-US")}**).`;
      case "berthsContainer":
        return `**${p.name}** container berths: **${p.berthsContainer.toLocaleString("en-US")}**.`;
      case "loading":
        return `**${p.name}** loading discipline: **${p.loading}**.`;
      default:
        return safeMissing("that field");
    }
  }

  // overview
  if (!intent.ports.length) {
    return [
      `I can answer port questions using Cargoconnect’s port intelligence dataset (draft, congestion, waiting time, capacity, routes).`,
      ``,
      `Try: “Compare Rotterdam and Piraeus”, “Which port has low congestion?”, or “What is the draft depth of Sohar?”`,
    ].join("\n");
  }

  const p = intent.ports[0]!;
  return [
    `**${p.name}** — ${p.gatewayLabel}`,
    `- Draft: **${p.draftDepthM}m** (channel: ${p.channelDepthM}m)`,
    `- Congestion: **${p.congestion}** · Waiting: **${p.waitingHours}**`,
    `- Throughput: **${formatTeu(p.annualThroughputTeu)}** · STS cranes: ${p.cranesSts.toLocaleString("en-US")}`,
    p.routes?.length ? `- Sample connections: ${p.routes.slice(0, 3).join(" · ")}` : ``,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function answerFromPorts({
  message,
  ports,
  useHuggingFace,
}: {
  message: string;
  ports: PortRecord[];
  useHuggingFace?: boolean;
}): Promise<RagResult> {
  const matched = retrievePorts(message, ports);
  const deterministic = renderAnswer(message, matched, ports);

  let answer = deterministic;
  if (useHuggingFace) {
    const key = process.env.HUGGINGFACE_API_KEY;
    if (key) {
      try {
        // Use HF only as a response layer: rewrite the grounded answer, do not add facts.
        const prompt = [
          "Rewrite the following answer in a concise, maritime operations tone.",
          "Rules: do NOT add new facts; only rephrase using the provided answer.",
          "",
          `Answer:\n${deterministic}`,
        ].join("\n");

        const res = await fetch("https://api-inference.huggingface.co/models/google/flan-t5-small", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: { max_new_tokens: 180, temperature: 0.2, return_full_text: false },
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as Array<{ generated_text?: string }> | { error?: string };
          const text = Array.isArray(data) ? data[0]?.generated_text : undefined;
          if (text && typeof text === "string" && text.trim().length > 0) {
            answer = text.trim();
          }
        }
      } catch {
        // Fall back to deterministic answer.
      }
    }
  }

  return {
    answer,
    matchedPorts: matched.map((p) => p.id),
    sources: ["ports.json"],
  };
}

