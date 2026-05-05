"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CircleMarker,
  LayerGroup,
  MapContainer,
  Polyline,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { DomEvent, type Map as LeafletMap } from "leaflet";
import { AnimatePresence, motion } from "framer-motion";
import { ZoomIn, ZoomOut } from "lucide-react";
import { PortPopupCard } from "@/components/PortPopupCard";
import { getMapPortCard } from "@/data/mapPortDetails";
import { MapDepthPane } from "@/components/map/MapDepthPane";
import { MaritimeAnimLayer } from "@/components/map/MaritimeAnimLayer";
import type { MaritimeAnimRoute } from "@/components/map/MaritimeAnimLayer";
import "leaflet/dist/leaflet.css";

type Tier = "primary" | "secondary" | "context";

type PortDef = {
  id: string;
  lat: number;
  lon: number;
  role: "oman" | "partner" | "hub";
};

type PortTierLevel = "primary" | "secondary" | "minor";

const PORTS: PortDef[] = [
  { id: "Sohar", lat: 24.34, lon: 56.73, role: "oman" },
  { id: "Salalah", lat: 16.95, lon: 54.01, role: "oman" },
  { id: "Duqm", lat: 19.68, lon: 57.7, role: "oman" },
  { id: "Piraeus", lat: 37.94, lon: 23.64, role: "partner" },
  { id: "Rotterdam", lat: 51.92, lon: 4.48, role: "partner" },
  { id: "Hamburg", lat: 53.55, lon: 9.99, role: "hub" },
  { id: "Jebel Ali", lat: 24.98, lon: 55.03, role: "hub" },
  { id: "Singapore", lat: 1.35, lon: 103.82, role: "hub" },
  { id: "Shanghai", lat: 31.23, lon: 121.47, role: "hub" },
];

const ROUTES: Array<{ from: string; to: string; tier: Tier }> = [
  { from: "Sohar", to: "Piraeus", tier: "primary" },
  { from: "Salalah", to: "Piraeus", tier: "primary" },
  { from: "Sohar", to: "Rotterdam", tier: "primary" },
  { from: "Salalah", to: "Rotterdam", tier: "primary" },
  { from: "Duqm", to: "Piraeus", tier: "secondary" },
  { from: "Duqm", to: "Hamburg", tier: "secondary" },
  { from: "Piraeus", to: "Rotterdam", tier: "secondary" },
  { from: "Jebel Ali", to: "Singapore", tier: "secondary" },
  { from: "Salalah", to: "Jebel Ali", tier: "context" },
  { from: "Singapore", to: "Shanghai", tier: "context" },
];

const portById = Object.fromEntries(PORTS.map((p) => [p.id, p])) as Record<
  string,
  PortDef
>;

/** Match `PortPopupCard` max width for edge clamping */
const CARD_W = 360;
const CARD_H_EST = 400;
const MARKER_GAP = 18;
const SAFE_PAD = 16;

function portTierLevel(role: PortDef["role"]): PortTierLevel {
  if (role === "oman") return "primary";
  if (role === "partner") return "secondary";
  return "minor";
}

function roleColor(role: PortDef["role"]) {
  if (role === "oman") return "#5eead4";
  if (role === "partner") return "#38bdf8";
  return "#60a5fa";
}

function glowForTier(t: PortTierLevel, hover: boolean): number {
  const h = hover ? 1.18 : 1;
  if (t === "primary") return 26 * h;
  if (t === "secondary") return 19 * h;
  return 14 * h;
}

function coreForTier(
  t: PortTierLevel,
  hover: boolean,
  selected: boolean,
): number {
  const h = hover || selected ? 1.14 : 1;
  if (t === "primary") return 10.5 * h;
  if (t === "secondary") return 8 * h;
  return 6 * h;
}

function glowOpacityForTier(t: PortTierLevel, hover: boolean): number {
  if (hover) return t === "primary" ? 0.42 : t === "secondary" ? 0.36 : 0.3;
  if (t === "primary") return 0.32;
  if (t === "secondary") return 0.26;
  return 0.2;
}

/** Smooth cubic Bézier great-circle–style bend in lat/lng space (maritime lane). */
function cubicRoutePositions(
  from: PortDef,
  to: PortDef,
  bend: number,
  steps = 48,
): [number, number][] {
  const p0: [number, number] = [from.lat, from.lon];
  const p3: [number, number] = [to.lat, to.lon];
  const dLat = p3[0] - p0[0];
  const dLon = p3[1] - p0[1];
  const len = Math.hypot(dLat, dLon) || 1;
  const nx = (-dLon / len) * bend * 0.88;
  const ny = (dLat / len) * bend * 0.88;
  const p1: [number, number] = [
    p0[0] + dLat * 0.34 + nx,
    p0[1] + dLon * 0.34 + ny,
  ];
  const p2: [number, number] = [
    p0[0] + dLat * 0.66 + nx,
    p0[1] + dLon * 0.66 + ny,
  ];
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const omt = 1 - t;
    const lat =
      omt * omt * omt * p0[0] +
      3 * omt * omt * t * p1[0] +
      3 * omt * t * t * p2[0] +
      t * t * t * p3[0];
    const lon =
      omt * omt * omt * p0[1] +
      3 * omt * omt * t * p1[1] +
      3 * omt * t * t * p2[1] +
      t * t * t * p3[1];
    pts.push([lat, lon]);
  }
  return pts;
}

function tierBend(tier: Tier): number {
  if (tier === "primary") return 5;
  if (tier === "secondary") return 3;
  return 1.5;
}

function flowAnimClass(tier: Tier): string {
  if (tier === "primary") return "cc-route-flow";
  if (tier === "secondary") return "cc-route-flow cc-route-flow--slow";
  return "cc-route-flow cc-route-flow--context";
}

function routeDimFactor(
  selectedId: string | null,
  from: string,
  to: string,
): number {
  if (!selectedId) return 1;
  if (from === selectedId || to === selectedId) return 1;
  return 0.32;
}

const FIT_BOUNDS: [[number, number], [number, number]] = [
  [-6, -12],
  [58, 132],
];

function ClearSelectionOnMapPane({ onClear }: { onClear: () => void }) {
  useMapEvents({
    click: () => onClear(),
  });
  return null;
}

export function RealRouteMap() {
  const mapRef = useRef<LeafletMap | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredPortId, setHoveredPortId] = useState<string | null>(null);
  const [hoveredRouteKey, setHoveredRouteKey] = useState<string | null>(null);
  const [cardPos, setCardPos] = useState<{ left: number; top: number } | null>(
    null,
  );
  const cardRef = useRef<HTMLElement | null>(null);
  const [cardSize, setCardSize] = useState<{ w: number; h: number } | null>(
    null,
  );
  const [mapEpoch, setMapEpoch] = useState(0);

  const clearSelection = useCallback(() => {
    setSelectedId(null);
    setCardSize(null);
  }, []);

  const selectedDetail =
    selectedId != null ? getMapPortCard(selectedId) : undefined;

  useEffect(() => {
    if (!selectedId) return;
    const raf = window.requestAnimationFrame(() => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      setCardSize((prev) => {
        if (prev && prev.w === w && prev.h === h) return prev;
        return { w, h };
      });
    });
    return () => window.cancelAnimationFrame(raf);
  }, [selectedId, selectedDetail]);

  const animRoutes = useMemo((): MaritimeAnimRoute[] => {
    return ROUTES.map((r, i) => {
      const a = portById[r.from];
      const b = portById[r.to];
      if (!a || !b) return null;
      const positions = cubicRoutePositions(a, b, tierBend(r.tier));
      return {
        key: `${r.from}-${r.to}-${i}`,
        positions,
        showVessel: r.tier !== "context",
        dotCount: r.tier === "primary" ? 3 : r.tier === "secondary" ? 2 : 1,
      };
    }).filter((x): x is MaritimeAnimRoute => x != null);
  }, []);

  const recalcCardPos = useCallback(() => {
    const map = mapRef.current;
    if (!map || !selectedId) {
      setCardPos(null);
      return;
    }
    const p = portById[selectedId];
    if (!p) {
      setCardPos(null);
      return;
    }
    const pt = map.latLngToContainerPoint([p.lat, p.lon]);
    const { x: w, y: h } = map.getSize();

    const cw = cardSize?.w ?? CARD_W;
    const ch = cardSize?.h ?? CARD_H_EST;

    const canRight = pt.x + MARKER_GAP + cw <= w - SAFE_PAD;
    const preferRight = canRight || pt.x < w * 0.52;
    const rawLeft = preferRight
      ? pt.x + MARKER_GAP
      : pt.x - MARKER_GAP - cw;
    const left = Math.max(SAFE_PAD, Math.min(rawLeft, w - cw - SAFE_PAD));

    const topCenter = Math.max(
      SAFE_PAD + ch / 2,
      Math.min(pt.y, h - SAFE_PAD - ch / 2),
    );

    setCardPos({ left, top: topCenter });
  }, [selectedId, cardSize]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const onViewChange = () => recalcCardPos();
    map.on("moveend", onViewChange);
    map.on("zoomend", onViewChange);
    const onResize = () => recalcCardPos();
    window.addEventListener("resize", onResize);
    const raf = window.requestAnimationFrame(() => recalcCardPos());
    return () => {
      map.off("moveend", onViewChange);
      map.off("zoomend", onViewChange);
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(raf);
    };
  }, [recalcCardPos, selectedId, mapEpoch, cardSize]);

  useEffect(() => {
    if (!selectedId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSelection();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedId, clearSelection]);

  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const p = portById[selectedId];
    if (!p) return;
    const map = mapRef.current;
    const targetZoom = Math.max(map.getZoom(), 6.25);
    map.flyTo([p.lat, p.lon], targetZoom, {
      duration: 0.65,
      easeLinearity: 0.22,
    });
  }, [selectedId]);

  return (
    <div className="relative h-full min-h-[320px] w-full sm:min-h-[420px] lg:min-h-[560px]">
      <MapContainer
        ref={mapRef}
        bounds={FIT_BOUNDS}
        boundsOptions={{ padding: [28, 28], maxZoom: 6 }}
        className="z-0 h-full w-full min-h-[inherit] rounded-none [&_.leaflet-control-attribution]:max-w-[55%] [&_.leaflet-control-attribution]:truncate [&_.leaflet-control-attribution]:text-[9px] [&_.leaflet-control-attribution]:opacity-80"
        scrollWheelZoom
        dragging
        doubleClickZoom
        touchZoom
        keyboard
        worldCopyJump
        style={{ minHeight: "inherit", height: "100%", width: "100%" }}
        whenReady={() => setMapEpoch((n) => n + 1)}
      >
        <ClearSelectionOnMapPane onClear={clearSelection} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />
        <MapDepthPane />

        {ROUTES.map((r, i) => {
          const a = portById[r.from];
          const b = portById[r.to];
          if (!a || !b) return null;
          const positions = cubicRoutePositions(a, b, tierBend(r.tier));
          const routeKey = `${r.from}-${r.to}-${i}`;
          const dim = routeDimFactor(selectedId, r.from, r.to);
          const hover = hoveredRouteKey === routeKey;
          const hoverW = hover ? 1.15 : 1;
          const hoverBright = hover ? 1.22 : 1;

          const baseW =
            r.tier === "primary" ? 2.1 : r.tier === "secondary" ? 1.75 : 1.35;
          const flowW =
            (r.tier === "primary" ? 2.85 : r.tier === "secondary" ? 2.35 : 1.75) *
            hoverW;

          const baseOpacity = Math.min(
            1,
            (r.tier === "primary" ? 0.52 : r.tier === "secondary" ? 0.46 : 0.38) *
              dim *
              hoverBright,
          );
          const flowOpacity = Math.min(
            1,
            (r.tier === "primary" ? 0.88 : r.tier === "secondary" ? 0.78 : 0.62) *
              dim *
              hoverBright,
          );

          return (
            <LayerGroup key={routeKey}>
              <Polyline
                positions={positions}
                pathOptions={{
                  className: "cc-route-base",
                  color: "#0c2a45",
                  weight: baseW * (hover ? 1.05 : 1),
                  opacity: baseOpacity,
                  lineCap: "round",
                  lineJoin: "round",
                  interactive: false,
                  bubblingMouseEvents: false,
                }}
              />
              <Polyline
                positions={positions}
                pathOptions={{
                  className: flowAnimClass(r.tier),
                  color: r.tier === "context" ? "#5eead4" : "#34e1d8",
                  weight: flowW,
                  opacity: flowOpacity,
                  dashArray: "9 14",
                  lineCap: "round",
                  lineJoin: "round",
                  interactive: true,
                  bubblingMouseEvents: false,
                }}
                eventHandlers={{
                  mouseover: () => setHoveredRouteKey(routeKey),
                  mouseout: () =>
                    setHoveredRouteKey((k) => (k === routeKey ? null : k)),
                }}
              />
            </LayerGroup>
          );
        })}

        <MaritimeAnimLayer routes={animRoutes} />

        {PORTS.map((p) => {
          const tier = portTierLevel(p.role);
          const ph = hoveredPortId === p.id;
          const sel = selectedId === p.id;
          const glowR = glowForTier(tier, ph);
          const coreR = coreForTier(tier, ph, sel);
          const gOp = glowOpacityForTier(tier, ph);

          return (
            <LayerGroup key={p.id}>
              <CircleMarker
                center={[p.lat, p.lon]}
                radius={glowR}
                pathOptions={{
                  className: `cc-port-glow cc-port-glow--${tier}`,
                  stroke: false,
                  fillColor: roleColor(p.role),
                  fillOpacity: gOp,
                  interactive: false,
                  bubblingMouseEvents: false,
                }}
              />
              <CircleMarker
                center={[p.lat, p.lon]}
                radius={coreR}
                pathOptions={{
                  color: sel ? "#f8fafc" : "#061525",
                  weight: sel ? 2.5 : 2,
                  fillColor: roleColor(p.role),
                  fillOpacity: sel ? 1 : 0.96,
                  interactive: true,
                  bubblingMouseEvents: false,
                }}
                eventHandlers={{
                  click: (e) => {
                    DomEvent.stopPropagation(e);
                    setSelectedId(p.id);
                  },
                  mouseover: () => setHoveredPortId(p.id),
                  mouseout: () =>
                    setHoveredPortId((id) => (id === p.id ? null : id)),
                }}
              />
            </LayerGroup>
          );
        })}
      </MapContainer>

      <AnimatePresence mode="wait">
        {selectedId != null && selectedDetail != null && cardPos != null ? (
          <motion.div
            key={selectedId}
            className="pointer-events-none absolute"
            style={{ zIndex: 8000 }}
            initial={false}
            animate={{ left: cardPos.left, top: cardPos.top }}
            transition={{ type: "spring", damping: 26, stiffness: 380, mass: 0.85 }}
          >
            <div className="pointer-events-none" style={{ transform: "translateY(-50%)" }}>
              <PortPopupCard
                ref={cardRef}
                portId={selectedId}
                port={selectedDetail}
                onClose={clearSelection}
              />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="pointer-events-auto absolute right-2 top-2 z-[7500] flex flex-col gap-1 rounded-lg border border-white/15 bg-[#0B1F33]/92 p-0.5 shadow-lg backdrop-blur-sm">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Zoom in"
          onClick={() => mapRef.current?.zoomIn()}
        >
          <ZoomIn className="h-4 w-4" strokeWidth={2} />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Zoom out"
          onClick={() => mapRef.current?.zoomOut()}
        >
          <ZoomOut className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      <p className="pointer-events-none absolute left-2 top-2 z-[7500] max-w-[min(100%,220px)] rounded-md border border-white/10 bg-[#0B1F33]/88 px-2 py-1 text-[9px] leading-snug text-slate-400 backdrop-blur-sm sm:text-[10px]">
        Drag to pan · scroll to zoom · click a port for details
      </p>
    </div>
  );
}
