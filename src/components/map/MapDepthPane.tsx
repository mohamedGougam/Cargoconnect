"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";

const PANE = "ccAtmospherePane";

/** In-map atmosphere: depth gradient + subtle grid (z-index between routes and markers). */
export function MapDepthPane() {
  const map = useMap();

  useEffect(() => {
    let pane = map.getPane(PANE);
    if (!pane) {
      map.createPane(PANE);
      pane = map.getPane(PANE);
    }
    if (!pane) return;

    pane.style.zIndex = "550";
    pane.style.pointerEvents = "none";

    const grad = document.createElement("div");
    grad.className = "cc-map-atmosphere-gradient";
    const grid = document.createElement("div");
    grid.className = "cc-map-atmosphere-grid";

    pane.appendChild(grad);
    pane.appendChild(grid);

    return () => {
      try {
        if (grad.parentNode === pane) pane.removeChild(grad);
        if (grid.parentNode === pane) pane.removeChild(grid);
      } catch {
        /* pane may be torn down with map */
      }
    };
  }, [map]);

  return null;
}
