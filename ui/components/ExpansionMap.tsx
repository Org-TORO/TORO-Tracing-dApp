"use client";

/* Expansion map: global nautical chart with Vietnam home port and dotted
   trade lanes to pilot markets. Ports are quiet dots; their names surface
   on hover.
   Map data: world-atlas countries-110m (public/maps/countries-110m.json),
   rendered with react-simple-maps, routes drawn as great-circle arcs. */

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
} from "react-simple-maps";
import { geoNaturalEarth1, geoInterpolate } from "d3-geo";
import type { GeoProjection } from "d3-geo";

const GEO_URL = "/maps/countries-110m.json";

interface Port {
  id: string;
  coords: [number, number];
  label: string;
  sub: string;
  anchor: "start" | "middle" | "end";
  dx: number;
  dy: number;
}

const HOME_PORT: Port = {
  id: "home",
  coords: [109.22, 13.78], // Quy Nhơn
  label: "QUY NHƠN",
  sub: "VIETNAM · HOME PORT",
  anchor: "end",
  dx: -12,
  dy: -6,
};

const DESTINATIONS: Port[] = [
  { id: "busan", coords: [129.07, 35.18], label: "BUSAN", sub: "KOREA", anchor: "middle", dx: 0, dy: -12 },
  { id: "tokyo", coords: [139.69, 35.68], label: "TOKYO", sub: "JAPAN", anchor: "end", dx: -12, dy: -6 },
  { id: "rotterdam", coords: [4.48, 51.92], label: "ROTTERDAM", sub: "NETHERLANDS", anchor: "start", dx: 12, dy: -6 },
];

/* Dotted great-circle lane, dots flowing toward the destination. */
function RouteArc({
  from,
  to,
  projection,
}: {
  from: [number, number];
  to: [number, number];
  projection: GeoProjection;
}) {
  const d = useMemo(() => {
    const interpolate = geoInterpolate(from, to);
    const parts: string[] = [];
    for (let i = 0; i <= 96; i++) {
      const pt = projection(interpolate(i / 96));
      if (!pt) continue;
      parts.push(`${i === 0 ? "M" : "L"}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`);
    }
    return parts.join("");
  }, [from, to, projection]);

  return (
    <path
      d={d}
      fill="none"
      stroke="#3e96cc"
      strokeOpacity={0.5}
      strokeWidth={1.4}
      strokeDasharray="1 7"
      strokeLinecap="round"
      className="map-route-flow"
    />
  );
}

function PortNode({
  port,
  projection,
  home = false,
  hovered,
  onHover,
}: {
  port: Port;
  projection: GeoProjection;
  home?: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const [x, y] = projection(port.coords) ?? [0, 0];
  const r = home ? 5 : 3.5;

  return (
    <g
      transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
      onMouseEnter={() => onHover(port.id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
    >
      {/* generous invisible hit area */}
      <circle r={18} fill="transparent" />
      {home && (
        <circle
          r={7}
          fill="none"
          stroke="#ffc354"
          strokeWidth={1}
          className="map-port-ping"
          style={{ opacity: hovered ? 1 : 0.6 }}
        />
      )}
      <circle
        r={hovered ? r + 1.5 : r}
        fill={home ? "#ffc354" : "#3e96cc"}
        stroke="#08101f"
        strokeWidth={1.5}
        style={{ transition: "r 0.2s ease" }}
      />

      {/* hover label: floating text, no box */}
      <g className="map-port-label" opacity={hovered ? 1 : 0}>
        <text
          x={port.dx}
          y={port.dy}
          textAnchor={port.anchor}
          className="font-mono-data"
          fontSize={12}
          letterSpacing={2}
          fill="#ffffff"
        >
          {port.label}
        </text>
        <text
          x={port.dx}
          y={port.dy + 14}
          textAnchor={port.anchor}
          className="font-mono-data"
          fontSize={8.5}
          letterSpacing={2}
          fill="rgba(255,255,255,0.5)"
        >
          {port.sub}
        </text>
      </g>
    </g>
  );
}

export default function ExpansionMap() {
  const [hovered, setHovered] = useState<string | null>(null);

  // full-world Natural Earth projection
  const projection = useMemo(
    () =>
      geoNaturalEarth1().fitExtent(
        [[8, 8], [992, 512]],
        { type: "Sphere" } as never
      ),
    []
  );

  return (
    <ComposableMap width={1000} height={520} projection={projection}>
      {/* ocean */}
      <Sphere fill="#0a1526" stroke="rgba(255,255,255,0.05)" strokeWidth={0.6} />
      {/* graticule grid */}
      <Graticule stroke="rgba(255,255,255,0.04)" strokeWidth={0.4} step={[30, 30]} />
      {/* landmasses */}
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map((g) => (
            <Geography
              key={g.rsmKey}
              geography={g}
              fill="#101f3a"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={0.4}
            />
          ))
        }
      </Geographies>

      {DESTINATIONS.map((dest) => (
        <RouteArc
          key={dest.label}
          from={HOME_PORT.coords}
          to={dest.coords}
          projection={projection}
        />
      ))}

      {DESTINATIONS.map((dest) => (
        <PortNode
          key={dest.id}
          port={dest}
          projection={projection}
          hovered={hovered === dest.id}
          onHover={setHovered}
        />
      ))}
      <PortNode
        port={HOME_PORT}
        projection={projection}
        home
        hovered={hovered === HOME_PORT.id}
        onHover={setHovered}
      />
    </ComposableMap>
  );
}
