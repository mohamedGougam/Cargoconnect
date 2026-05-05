export type PortTimelineItem = {
  code: string;
  status: "Planned" | "In Transit" | "Completed";
  departure: string;
  arrival?: string;
};

export type CargoBlockDef = {
  id: string;
  code: string;
  ref: string;
  kg: number;
  tag: string;
  /** 0..1 coordinate within the ship overlay */
  x: number;
  /** 0..1 coordinate within the ship overlay */
  y: number;
  highlight?: boolean;
};

export type PayloadRow = {
  section: string;
  ref: string;
  kg: number;
  tag: string;
};

export type TableRow = {
  awbNo: string;
  prefix: string;
  pkg: string;
  origin: string;
  dest: string;
  bookingDate: string;
  voyageNo: string;
  voyageDate: string;
  customer: string;
  containerType: string;
  bookingRef: string;
};

