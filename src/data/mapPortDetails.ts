/**
 * Port intel for map popup cards (prototype).
 * Keys = slug: lowercase, spaces → hyphens.
 */
export type FacilityType = "modern" | "traditional";

export type MapPortCard = {
  name: string;
  country: string;
  unLocode: string;
  facilityType: FacilityType;
  /** Display label, e.g. "Modern Container & Bulk Port" */
  portType: string;
  maxDraftM: number;
  congestion: string;
  waitingTime: string;
  routes: string[];
  throughputLabel?: string;
  opsHighlight?: string;
};

export const MAP_PORT_DETAILS: Record<string, MapPortCard> = {
  sohar: {
    name: "Port of Sohar",
    country: "Oman",
    unLocode: "OMSOH",
    facilityType: "modern",
    portType: "Modern Industrial & Container Port",
    maxDraftM: 18,
    congestion: "Low–medium",
    waitingTime: "6–12 hours",
    routes: [
      "Sohar → Piraeus",
      "Sohar → Rotterdam",
      "Sohar → Jebel Ali",
      "Sohar → Mumbai",
    ],
    throughputLabel: "~3M TEU / yr (est.)",
  },
  salalah: {
    name: "Port of Salalah",
    country: "Oman",
    unLocode: "OMSLL",
    facilityType: "modern",
    portType: "Deep-water Transshipment Hub",
    maxDraftM: 18,
    congestion: "Medium",
    waitingTime: "10–18 hours",
    routes: [
      "Salalah → Piraeus",
      "Salalah → Rotterdam",
      "Salalah → Jebel Ali",
      "Salalah → Durban",
    ],
    throughputLabel: "~4M TEU / yr (est.)",
  },
  duqm: {
    name: "Port of Duqm",
    country: "Oman",
    unLocode: "OMDQM",
    facilityType: "modern",
    portType: "Greenfield Multi-purpose Port",
    maxDraftM: 19,
    congestion: "Low",
    waitingTime: "4–10 hours",
    routes: [
      "Duqm → Piraeus",
      "Duqm → Hamburg",
      "Duqm → Jebel Ali",
      "Duqm → Karachi",
    ],
    throughputLabel: "Rapid ramp-up",
  },
  piraeus: {
    name: "Port of Piraeus",
    country: "Greece",
    unLocode: "GRPIR",
    facilityType: "modern",
    portType: "Modern Container & Bulk Port",
    maxDraftM: 18.5,
    congestion: "Medium",
    waitingTime: "8–14 hours",
    routes: [
      "Piraeus → Rotterdam",
      "Piraeus → Alexandria",
      "Piraeus → Jebel Ali",
      "Piraeus → Singapore",
    ],
    throughputLabel: "~5.6M TEU / yr (est.)",
  },
  rotterdam: {
    name: "Port of Rotterdam",
    country: "Netherlands",
    unLocode: "NLRTM",
    facilityType: "modern",
    portType: "Deep-water Smart Port",
    maxDraftM: 24,
    congestion: "Low",
    waitingTime: "4–8 hours",
    routes: [
      "Rotterdam → Piraeus",
      "Rotterdam → Hamburg",
      "Rotterdam → London Gateway",
      "Rotterdam → Singapore",
    ],
    throughputLabel: "~14M TEU / yr (est.)",
  },
  hamburg: {
    name: "Port of Hamburg",
    country: "Germany",
    unLocode: "DEHAM",
    facilityType: "traditional",
    portType: "River Estuary Container & Breakbulk",
    maxDraftM: 15.2,
    congestion: "Medium",
    waitingTime: "12–24 hours",
    routes: [
      "Hamburg → Rotterdam",
      "Hamburg → Piraeus",
      "Hamburg → Shanghai",
      "Hamburg → Gdansk",
    ],
    throughputLabel: "~8M TEU / yr (est.)",
  },
  "jebel-ali": {
    name: "Jebel Ali Port",
    country: "United Arab Emirates",
    unLocode: "AEJEA",
    facilityType: "modern",
    portType: "Mega Container Port",
    maxDraftM: 17,
    congestion: "Medium",
    waitingTime: "10–16 hours",
    routes: [
      "Jebel Ali → Singapore",
      "Jebel Ali → Piraeus",
      "Jebel Ali → Mumbai",
      "Jebel Ali → Rotterdam",
    ],
    throughputLabel: "~13M TEU / yr (est.)",
  },
  singapore: {
    name: "Port of Singapore",
    country: "Singapore",
    unLocode: "SGSIN",
    facilityType: "modern",
    portType: "Global Transshipment Mega-hub",
    maxDraftM: 21,
    congestion: "Low (velocity)",
    waitingTime: "2–8 hours",
    routes: [
      "Singapore → Rotterdam",
      "Singapore → Piraeus",
      "Singapore → Shanghai",
      "Singapore → Jebel Ali",
    ],
    throughputLabel: "~37M TEU / yr (est.)",
  },
  shanghai: {
    name: "Port of Shanghai",
    country: "China",
    unLocode: "CNSHA",
    facilityType: "modern",
    portType: "Yangtze Estuary Super-hub",
    maxDraftM: 17,
    congestion: "Medium (seasonal)",
    waitingTime: "6–18 hours",
    routes: [
      "Shanghai → Rotterdam",
      "Shanghai → Los Angeles",
      "Shanghai → Singapore",
      "Shanghai → Piraeus",
    ],
    throughputLabel: "~49M TEU / yr (est.)",
  },
};

export function mapPortSlug(portId: string): string {
  return portId.toLowerCase().replace(/\s+/g, "-");
}

export function getMapPortCard(portId: string): MapPortCard | undefined {
  return MAP_PORT_DETAILS[mapPortSlug(portId)];
}
