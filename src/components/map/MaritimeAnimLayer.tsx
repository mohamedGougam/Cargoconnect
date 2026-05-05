"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export type MaritimeAnimRoute = {
  key: string;
  positions: [number, number][];
  showVessel: boolean;
  dotCount: number;
};

/** Lucide `Ship` icon paths (stroke), inlined for Leaflet DivIcon HTML. */
const VESSEL_HTML = `
<div class="cc-vessel-stack">
  <div class="cc-vessel-body">
    <div class="cc-vessel-trail" aria-hidden="true"></div>
    <svg class="cc-vessel-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path d="M12 10.189V14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M12 2v3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </div>
</div>`;

function pointAlong(
  positions: [number, number][],
  t: number,
): { lat: number; lng: number } {
  const n = positions.length;
  if (n === 0) return { lat: 0, lng: 0 };

  // Guard against any sparse/invalid arrays (shouldn't happen, but avoids runtime crashes).
  const safe = positions.filter(
    (p): p is [number, number] =>
      Array.isArray(p) &&
      typeof p[0] === "number" &&
      Number.isFinite(p[0]) &&
      typeof p[1] === "number" &&
      Number.isFinite(p[1]),
  );

  if (safe.length < 2) {
    const p = safe[0] ?? positions[0] ?? [0, 0];
    return { lat: p[0], lng: p[1] };
  }

  const nn = safe.length;
  const u = (t % 1) * (nn - 1);
  const i = Math.max(0, Math.min(nn - 2, Math.floor(u)));
  const f = u - i;
  const p0 = safe[i]!;
  const p1 = safe[i + 1]!;
  return {
    lat: p0[0] + (p1[0] - p0[0]) * f,
    lng: p0[1] + (p1[1] - p0[1]) * f,
  };
}

function screenHeadingDeg(
  map: L.Map,
  positions: [number, number][],
  t: number,
): number {
  const look = 0.012;
  const t2 = Math.min(1, t + look);
  const a = pointAlong(positions, t);
  const b = pointAlong(positions, t2);
  const A = map.latLngToContainerPoint(L.latLng(a.lat, a.lng));
  const B = map.latLngToContainerPoint(L.latLng(b.lat, b.lng));
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  return (Math.atan2(dx, -dy) * 180) / Math.PI;
}

export function MaritimeAnimLayer({ routes }: { routes: MaritimeAnimRoute[] }) {
  const map = useMap();
  const routesRef = useRef(routes);
  useEffect(() => {
    routesRef.current = routes;
  }, [routes]);

  useEffect(() => {
    const g = L.layerGroup().addTo(map);
    type VesselEntry = {
      m: L.Marker;
      routeKey: string;
      phase: number;
      positions: [number, number][];
    };
    type DotEntry = {
      m: L.Marker;
      routeKey: string;
      phase: number;
      positions: [number, number][];
    };

    const vessels: VesselEntry[] = [];
    const dots: DotEntry[] = [];

    for (const r of routes) {
      if (!r.positions || r.positions.length === 0) continue;
      if (r.showVessel) {
        const icon = L.divIcon({
          className: "cc-leaflet-html-icon",
          html: VESSEL_HTML,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });
        const m = L.marker(r.positions[0]!, {
          icon,
          interactive: false,
          zIndexOffset: 900,
        });
        m.addTo(g);
        vessels.push({
          m,
          routeKey: r.key,
          phase: Math.random(),
          positions: r.positions,
        });
      }
      const dc = Math.max(0, r.dotCount);
      for (let d = 0; d < dc; d++) {
        const icon = L.divIcon({
          className: "cc-leaflet-html-icon",
          html: '<div class="cc-route-flow-dot"></div>',
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });
        const m = L.marker(r.positions[0]!, {
          icon,
          interactive: false,
          zIndexOffset: 750,
        });
        m.addTo(g);
        dots.push({
          m,
          routeKey: r.key,
          phase: d / Math.max(dc, 1),
          positions: r.positions,
        });
      }
    }

    let raf = 0;
    const t0 = performance.now();
    const speed = 0.017;

    function tick(now: number) {
      const elapsed = (now - t0) / 1000;
      const activeKeys = new Set(routesRef.current.map((x) => x.key));

      for (const v of vessels) {
        if (!activeKeys.has(v.routeKey)) continue;
        const t = (elapsed * speed + v.phase) % 1;
        const { lat, lng } = pointAlong(v.positions, t);
        v.m.setLatLng([lat, lng]);
        const deg = screenHeadingDeg(map, v.positions, t);
        const el = v.m.getElement();
        const body = el?.querySelector(".cc-vessel-body") as HTMLElement | null;
        if (body) body.style.transform = `rotate(${deg}deg)`;
      }

      for (const d of dots) {
        if (!activeKeys.has(d.routeKey)) continue;
        const t = (elapsed * speed * 1.12 + d.phase) % 1;
        const { lat, lng } = pointAlong(d.positions, t);
        d.m.setLatLng([lat, lng]);
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      map.removeLayer(g);
    };
  }, [map, routes]);

  return null;
}
