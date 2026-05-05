import mock from "./mock.json";
import ports from "./ports.json";

export type VesselRow = (typeof mock.vessels)[number];
export type PortRecord = (typeof ports)[number];

export const mockData = {
  ...mock,
  ports,
};
