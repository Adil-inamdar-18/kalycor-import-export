"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import {
  MAP_COLS,
  MAP_LAT_BOTTOM,
  MAP_LAT_TOP,
  MAP_ROWS,
  worldDots,
} from "@/content/worldDots";
import { homeBase, markets } from "@/content/site";

type V3 = [number, number, number];
type LL = [number, number];
const RAD = Math.PI / 180;
const TAU = Math.PI * 2;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const posMod = (a: number) => ((a % TAU) + TAU) % TAU;
const wrapPI = (a: number) => posMod(a + Math.PI) - Math.PI;
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const toVec = (lon: number, lat: number): V3 => {
  const la = lat * RAD;
  const lo = lon * RAD;
  return [
    Math.cos(la) * Math.sin(lo),
    Math.sin(la),
    Math.cos(la) * Math.cos(lo),
  ];
};

export const GLOBE_SCENES = [
  { id: "sea", label: "Sea freight", lon: 68, lat: 13 },
  { id: "air", label: "Air cargo", lon: -168, lat: 18 },
  { id: "road", label: "Road haulage", lon: -56, lat: -24 },
] as const;
const SCENE_LON = GLOBE_SCENES.map((s) => s.lon * RAD);
const SCENE_TILT = GLOBE_SCENES.map((s) => s.lat * RAD * 0.9);
const DWELL = 8.5;
const nearestScene = (lonC: number) => {
  let best = 0;
  let bd = 9;
  for (let i = 0; i < SCENE_LON.length; i++) {
    const d = Math.abs(wrapPI(lonC - SCENE_LON[i]));
    if (d < bd) {
      bd = d;
      best = i;
    }
  }
  return best;
};

export type GlobeHandle = { goTo: (scene: number) => void };
type Props = {
  className?: string;
  onScene?: (scene: number) => void;
  onInteract?: () => void;
};

const LAND: V3[] = (() => {
  const out: V3[] = [];
  for (const [c, r] of worldDots) {
    const lon = (c / (MAP_COLS - 1)) * 360 - 180;
    const lat =
      MAP_LAT_TOP - (r / (MAP_ROWS - 1)) * (MAP_LAT_TOP - MAP_LAT_BOTTOM);
    const step = Math.min(
      6,
      Math.max(1, Math.round(1 / Math.max(0.05, Math.cos(lat * RAD)))),
    );
    if (c % step === 0) out.push(toVec(lon, lat));
  }
  return out;
})();
const N_LAND = LAND.length;

const OCEAN = (() => {
  const land = new Set<number>();
  for (const [c, r] of worldDots) land.add(r * MAP_COLS + c);
  const isLand = (c: number, r: number) => land.has(r * MAP_COLS + c);
  let s = 11;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const v: number[] = [];
  const ph: number[] = [];
  for (let r = 1; r < MAP_ROWS - 1; r++) {
    for (let c = 1; c < MAP_COLS - 1; c++) {
      if (rnd() < 0.7) continue;
      let near = false;
      for (let dr = -1; dr <= 1 && !near; dr++)
        for (let dc = -1; dc <= 1; dc++)
          if (isLand(c + dc, r + dr)) {
            near = true;
            break;
          }
      if (near) continue;
      const lon = ((c + (rnd() - 0.5) * 1.5) / (MAP_COLS - 1)) * 360 - 180;
      const lat =
        MAP_LAT_TOP -
        ((r + (rnd() - 0.5) * 1.5) / (MAP_ROWS - 1)) *
          (MAP_LAT_TOP - MAP_LAT_BOTTOM);
      if (Math.abs(lat) > 72) continue;
      v.push(...toVec(lon, lat));
      ph.push(lon * 0.11 + lat * 0.19 + rnd() * 1.2);
    }
  }
  return { v: Float32Array.from(v), ph: Float32Array.from(ph), n: ph.length };
})();

const DECOR_HUBS: LL[] = [
  [73.8, 20],
  [55.3, 25.2],
  [4.5, 51.9],
  [103.8, 1.3],
  [-74, 40.7],
  [151.2, -33.9],
  [-46.6, -23.5],
  [139.7, 35.7],
  [31.2, 30],
  [28, -26],
];
const DECOR_ROUTES: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [1, 2],
  [3, 7],
  [2, 4],
  [0, 5],
  [1, 8],
  [8, 2],
  [0, 9],
  [6, 4],
  [3, 5],
];

const placed = markets.filter(
  (m) => m.lon !== undefined && m.lat !== undefined,
);
const real =
  !!homeBase &&
  homeBase.lon !== undefined &&
  homeBase.lat !== undefined &&
  placed.length > 0;
const NODES: V3[] = real
  ? [homeBase!, ...placed].map((m) => toVec(m.lon!, m.lat!))
  : DECOR_HUBS.map(([lo, la]) => toVec(lo, la));
const ROUTES: [number, number][] = real
  ? placed.map((_, i) => [0, i + 1] as [number, number])
  : DECOR_ROUTES;

const ARC_N = 48;
const ARCS: Float32Array[] = ROUTES.map(([i, j]) => {
  const a = NODES[i];
  const b = NODES[j];
  const dot = Math.min(
    1,
    Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]),
  );
  const om = Math.acos(dot);
  const so = Math.sin(om) || 1;
  const h = 0.05 + 0.2 * (om / Math.PI);
  const arr = new Float32Array((ARC_N + 1) * 3);
  for (let k = 0; k <= ARC_N; k++) {
    const t = k / ARC_N;
    const k1 = Math.sin((1 - t) * om) / so;
    const k2 = Math.sin(t * om) / so;
    const e = 1 + h * Math.sin(Math.PI * t);
    arr[k * 3] = (k1 * a[0] + k2 * b[0]) * e;
    arr[k * 3 + 1] = (k1 * a[1] + k2 * b[1]) * e;
    arr[k * 3 + 2] = (k1 * a[2] + k2 * b[2]) * e;
  }
  return arr;
});

const GRID: Float32Array[] = (() => {
  const lines: Float32Array[] = [];
  for (let lon = -180; lon < 180; lon += 30) {
    const pts: number[] = [];
    for (let lat = -80; lat <= 80; lat += 5) pts.push(...toVec(lon, lat));
    lines.push(new Float32Array(pts));
  }
  for (const lat of [-60, -30, 0, 30, 60]) {
    const pts: number[] = [];
    for (let lon = 0; lon <= 360; lon += 5) pts.push(...toVec(lon, lat));
    lines.push(new Float32Array(pts));
  }
  return lines;
})();

const RING: Float32Array = (() => {
  const pts: number[] = [];
  const incl = 1.15;
  const roll = -0.32;
  for (let k = 0; k <= 160; k++) {
    const th = (k / 160) * Math.PI * 2;
    const x = Math.cos(th) * 1.34;
    const y = Math.sin(th) * 1.34;
    const y2 = y * Math.cos(incl);
    const z2 = y * Math.sin(incl);
    pts.push(
      x * Math.cos(roll) - y2 * Math.sin(roll),
      x * Math.sin(roll) + y2 * Math.cos(roll),
      z2,
    );
  }
  return new Float32Array(pts);
})();

const BUCKETS = 12;
const STYLE = Array.from({ length: BUCKETS }, (_, k) => {
  const b = (k + 0.5) / BUCKETS;
  return `rgba(${Math.round(60 + 145 * b)},${Math.round(115 + 115 * b)},${Math.round(175 + 80 * b)},${(0.14 + 0.86 * b).toFixed(2)})`;
});

const STARS = (() => {
  let s = 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  return Array.from({ length: 130 }, () => ({
    x: rnd(),
    y: rnd(),
    r: 0.4 + rnd() * 1.1,
    p: rnd() * 6.28,
  }));
})();

const LX = -0.45;
const LY = 0.55;
const LZ = 0.7;
const L_LEN = Math.hypot(LX, LY, LZ);

type Route = { pts: Float32Array; cum: Float32Array; n: number; len: number };
const buildRoute = (wp: LL[], step = 0.012): Route => {
  const vs = wp.map(([lo, la]) => toVec(lo, la));
  const out: number[] = [];
  const cum: number[] = [];
  let acc = 0;
  for (let i = 0; i < vs.length - 1; i++) {
    const a = vs[i];
    const b = vs[i + 1];
    const om = Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1));
    const so = Math.sin(om) || 1;
    const steps = Math.max(1, Math.ceil(om / step));
    for (let k = 0; k < steps; k++) {
      const t = k / steps;
      const k1 = Math.sin((1 - t) * om) / so;
      const k2 = Math.sin(t * om) / so;
      out.push(
        k1 * a[0] + k2 * b[0],
        k1 * a[1] + k2 * b[1],
        k1 * a[2] + k2 * b[2],
      );
      cum.push(acc + t * om);
    }
    acc += om;
  }
  out.push(...vs[vs.length - 1]);
  cum.push(acc);
  return {
    pts: Float32Array.from(out),
    cum: Float32Array.from(cum),
    n: cum.length,
    len: acc,
  };
};
const sampleRoute = (r: Route, f: number, out: Float32Array) => {
  const target = clamp(f, 0, 1) * r.len;
  let lo = 0;
  let hi = r.n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (r.cum[mid] <= target) lo = mid;
    else hi = mid;
  }
  const t = (target - r.cum[lo]) / (r.cum[hi] - r.cum[lo] || 1);
  const x = r.pts[lo * 3] + (r.pts[hi * 3] - r.pts[lo * 3]) * t;
  const y = r.pts[lo * 3 + 1] + (r.pts[hi * 3 + 1] - r.pts[lo * 3 + 1]) * t;
  const z = r.pts[lo * 3 + 2] + (r.pts[hi * 3 + 2] - r.pts[lo * 3 + 2]) * t;
  const m = Math.hypot(x, y, z) || 1;
  out[0] = x / m;
  out[1] = y / m;
  out[2] = z / m;
};

type Kind = "ship" | "plane" | "truck";
type Vehicle = {
  kind: Kind;
  scene: number;
  route: Route;
  dur: number;
  f0: number;
  size: number;
  dir: number;
};
const VEHICLES: Vehicle[] = [
  {
    kind: "ship",
    scene: 0,
    route: buildRoute([
      [72.6, 18.4],
      [65.5, 16.2],
      [58, 14.4],
      [51, 12.9],
      [44.8, 12.3],
    ]),
    dur: 12,
    f0: 0.34,
    size: 0.235,
    dir: -1,
  },
  {
    kind: "ship",
    scene: 0,
    route: buildRoute([
      [74.2, 9.0],
      [77.6, 6.9],
      [80.6, 5.2],
      [86, 5.0],
      [92, 5.8],
      [96.6, 6.6],
    ]),
    dur: 11,
    f0: 0.12,
    size: 0.21,
    dir: 1,
  },
  {
    kind: "plane",
    scene: 1,
    route: buildRoute([
      [151.2, -33.9],
      [-118.2, 34.1],
    ]),
    dur: 15,
    f0: 0.24,
    size: 0.19,
    dir: 1,
  },
  {
    kind: "plane",
    scene: 1,
    route: buildRoute([
      [-157.9, 21.3],
      [139.7, 35.7],
    ]),
    dur: 10,
    f0: 0.1,
    size: 0.165,
    dir: -1,
  },
  {
    kind: "truck",
    scene: 2,
    route: buildRoute([
      [-46.3, -23.9],
      [-50.5, -22.6],
      [-54.6, -20.5],
      [-57.6, -19.1],
      [-63.2, -17.8],
    ]),
    dur: 9,
    f0: 0.3,
    size: 0.19,
    dir: -1,
  },
  {
    kind: "truck",
    scene: 2,
    route: buildRoute([
      [-70.6, -33.4],
      [-68.8, -32.9],
      [-64.2, -31.4],
      [-60.6, -32.9],
      [-58.4, -34.6],
    ]),
    dur: 8,
    f0: 0.14,
    size: 0.17,
    dir: 1,
  },
];
const PAUSE = 1.3;
const PLANE_LIFT = 0.13;
type Ctx = CanvasRenderingContext2D;
const BOX_COLORS = [
  "#C8481C",
  "#2C8596",
  "#E8764A",
  "#1F5489",
  "#9E3512",
  "#4FB3C4",
];

function drawShip(c: Ctx, t: number) {
  c.fillStyle = "#e8eef6";
  c.beginPath();
  c.moveTo(-0.5, -0.045);
  c.lineTo(0.5, -0.045);
  c.lineTo(0.43, 0.075);
  c.lineTo(-0.46, 0.075);
  c.closePath();
  c.fill();
  c.fillStyle = "#C8481C";
  c.beginPath();
  c.moveTo(-0.473, 0.035);
  c.lineTo(0.453, 0.035);
  c.lineTo(0.43, 0.075);
  c.lineTo(-0.46, 0.075);
  c.closePath();
  c.fill();
  const stacks = [2, 3, 3, 3, 2, 3];
  const cw = 0.095;
  c.lineWidth = 0.004;
  c.strokeStyle = "rgba(0,0,0,0.28)";
  for (let i = 0; i < stacks.length; i++) {
    const x = -0.2 + i * (cw + 0.006);
    for (let j = 0; j < stacks[i]; j++) {
      c.fillStyle = BOX_COLORS[(i * 2 + j) % BOX_COLORS.length];
      c.fillRect(x, -0.045 - (j + 1) * 0.052, cw, 0.048);
      c.strokeRect(x, -0.045 - (j + 1) * 0.052, cw, 0.048);
    }
  }
  c.fillStyle = "#f7f9fc";
  c.fillRect(-0.47, -0.15, 0.17, 0.105);
  c.fillRect(-0.45, -0.195, 0.13, 0.045);
  c.fillStyle = "#0b2a45";
  c.fillRect(-0.44, -0.18, 0.11, 0.016);
  c.fillStyle = "#C8481C";
  c.fillRect(-0.4, -0.24, 0.04, 0.046);
  c.fillStyle = "#0b2a45";
  c.fillRect(-0.4, -0.24, 0.04, 0.01);
  c.beginPath();
  c.moveTo(-0.72, 0.2);
  for (let x = -0.72; x <= 0.72; x += 0.04)
    c.lineTo(x, 0.054 + 0.012 * Math.sin(x * 14 - t * 3.2));
  c.lineTo(0.72, 0.2);
  c.closePath();
  const g = c.createLinearGradient(0, 0.04, 0, 0.18);
  g.addColorStop(0, "rgba(96,196,255,0.8)");
  g.addColorStop(1, "rgba(20,70,130,0)");
  c.fillStyle = g;
  c.fill();
  c.strokeStyle = "rgba(238,250,255,0.9)";
  c.lineWidth = 0.007;
  c.beginPath();
  for (let x = -0.72; x <= 0.72; x += 0.04) {
    const y = 0.054 + 0.012 * Math.sin(x * 14 - t * 3.2);
    if (x === -0.72) c.moveTo(x, y);
    else c.lineTo(x, y);
  }
  c.stroke();
  c.fillStyle = "rgba(240,250,255,0.85)";
  for (let i = 0; i < 4; i++) {
    const p = (t * 1.4 + i * 0.25) % 1;
    c.beginPath();
    c.arc(
      0.5 + p * 0.07,
      0.05 - p * 0.05 + 0.012 * Math.sin(i * 3 + t * 5),
      0.011 * (1 - p),
      0,
      TAU,
    );
    c.fill();
  }
}

function drawPlane(c: Ctx, t: number) {
  // far wing and far stabiliser sit behind the fuselage
  c.fillStyle = "#86a9d2";
  c.beginPath();
  c.moveTo(0.08, -0.03);
  c.lineTo(-0.1, -0.03);
  c.lineTo(-0.25, -0.18);
  c.lineTo(-0.16, -0.18);
  c.closePath();
  c.fill();
  c.beginPath();
  c.moveTo(-0.38, -0.03);
  c.lineTo(-0.5, -0.1);
  c.lineTo(-0.44, -0.1);
  c.lineTo(-0.33, -0.03);
  c.closePath();
  c.fill();
  // fuselage
  c.fillStyle = "#ffffff";
  c.beginPath();
  c.ellipse(-0.02, 0, 0.5, 0.062, 0, 0, TAU);
  c.fill();
  c.save();
  c.beginPath();
  c.ellipse(-0.02, 0, 0.5, 0.062, 0, 0, TAU);
  c.clip();
  c.fillStyle = "#C8481C";
  c.fillRect(-0.6, 0.03, 1.2, 0.05);
  c.restore();
  // cockpit and windows
  c.fillStyle = "#4b86c4";
  c.beginPath();
  c.moveTo(0.4, -0.03);
  c.lineTo(0.47, -0.012);
  c.lineTo(0.4, -0.012);
  c.closePath();
  c.fill();
  for (let x = -0.32; x <= 0.3; x += 0.052) {
    c.beginPath();
    c.arc(x, -0.014, 0.0085, 0, TAU);
    c.fill();
  }
  // tail fin and near stabiliser
  c.fillStyle = "#E8764A";
  c.beginPath();
  c.moveTo(-0.3, -0.05);
  c.lineTo(-0.46, -0.2);
  c.lineTo(-0.55, -0.2);
  c.lineTo(-0.48, -0.03);
  c.closePath();
  c.fill();
  c.fillStyle = "#cfe0f4";
  c.beginPath();
  c.moveTo(-0.4, 0.0);
  c.lineTo(-0.53, 0.075);
  c.lineTo(-0.46, 0.075);
  c.lineTo(-0.34, 0.012);
  c.closePath();
  c.fill();
  // near wing and engine
  c.fillStyle = "#dbe8f8";
  c.strokeStyle = "rgba(20,60,110,0.35)";
  c.lineWidth = 0.004;
  c.beginPath();
  c.moveTo(0.1, 0.03);
  c.lineTo(-0.1, 0.03);
  c.lineTo(-0.28, 0.21);
  c.lineTo(-0.18, 0.21);
  c.closePath();
  c.fill();
  c.stroke();
  c.fillStyle = "#9db9da";
  c.beginPath();
  c.ellipse(-0.04, 0.125, 0.055, 0.026, 0, 0, TAU);
  c.fill();
  c.fillStyle = "#C8481C";
  c.fillRect(0.0, 0.1, 0.014, 0.05);
  // wingtip strobe
  if (Math.sin(t * 7) > 0.55) {
    const g = c.createRadialGradient(-0.23, 0.205, 0, -0.23, 0.205, 0.07);
    g.addColorStop(0, "rgba(255,255,255,0.95)");
    g.addColorStop(0.3, "rgba(255,90,60,0.7)");
    g.addColorStop(1, "rgba(255,60,40,0)");
    c.fillStyle = g;
    c.beginPath();
    c.arc(-0.23, 0.205, 0.07, 0, TAU);
    c.fill();
  }
}

function drawTruck(c: Ctx, t: number) {
  // headlight beam
  const beam = c.createLinearGradient(0.46, 0, 1.05, 0);
  beam.addColorStop(0, "rgba(255,236,190,0.42)");
  beam.addColorStop(1, "rgba(255,236,190,0)");
  c.fillStyle = beam;
  c.beginPath();
  c.moveTo(0.46, -0.01);
  c.lineTo(1.05, -0.11);
  c.lineTo(1.05, 0.1);
  c.lineTo(0.46, 0.02);
  c.closePath();
  c.fill();
  c.translate(0, Math.sin(t * 14) * 0.004);
  // container trailer
  c.fillStyle = "#C8481C";
  c.fillRect(-0.5, -0.17, 0.66, 0.2);
  c.strokeStyle = "rgba(0,0,0,0.24)";
  c.lineWidth = 0.006;
  c.beginPath();
  for (let x = -0.47; x < 0.16; x += 0.033) {
    c.moveTo(x, -0.162);
    c.lineTo(x, 0.022);
  }
  c.stroke();
  c.fillStyle = "rgba(255,255,255,0.2)";
  c.fillRect(-0.5, -0.17, 0.66, 0.018);
  // chassis
  c.fillStyle = "#0e2238";
  c.fillRect(-0.5, 0.03, 0.96, 0.035);
  // cab
  c.fillStyle = "#f3f6fa";
  c.beginPath();
  c.moveTo(0.18, 0.04);
  c.lineTo(0.18, -0.13);
  c.lineTo(0.34, -0.13);
  c.lineTo(0.455, -0.03);
  c.lineTo(0.465, 0.04);
  c.closePath();
  c.fill();
  c.fillStyle = "#6fb0e6";
  c.beginPath();
  c.moveTo(0.215, -0.105);
  c.lineTo(0.215, -0.035);
  c.lineTo(0.415, -0.035);
  c.lineTo(0.335, -0.105);
  c.closePath();
  c.fill();
  c.fillStyle = "#E8764A";
  c.fillRect(0.18, 0.0, 0.285, 0.026);
  c.fillStyle = "#fff6d6";
  c.beginPath();
  c.arc(0.455, 0.006, 0.014, 0, TAU);
  c.fill();
  // wheels
  for (const x of [-0.38, -0.28, -0.18, 0.25, 0.385]) {
    c.fillStyle = "#0b1522";
    c.beginPath();
    c.arc(x, 0.075, 0.045, 0, TAU);
    c.fill();
    c.fillStyle = "#cfd8e3";
    c.beginPath();
    c.arc(x, 0.075, 0.018, 0, TAU);
    c.fill();
    c.strokeStyle = "#0b1522";
    c.lineWidth = 0.007;
    c.beginPath();
    c.moveTo(x + Math.cos(t * 22) * 0.017, 0.075 + Math.sin(t * 22) * 0.017);
    c.lineTo(x - Math.cos(t * 22) * 0.017, 0.075 - Math.sin(t * 22) * 0.017);
    c.stroke();
  }
}

export const TradeGlobe = forwardRef<GlobeHandle, Props>(function TradeGlobe(
  { className, onScene, onInteract },
  ref,
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const cb = useRef({ onScene, onInteract });
  cb.current = { onScene, onInteract };
  const api = useRef<GlobeHandle | null>(null);
  useImperativeHandle(
    ref,
    () => ({ goTo: (i: number) => api.current?.goTo(i) }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const hero = canvas.parentElement;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    const mouse = { x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 };
    const G = { cx: 0, cy: 0, R: 1 };

    // camera / scene controller state
    let lonC = SCENE_LON[0];
    let tiltC = SCENE_TILT[0];
    let tiltUser = 0;
    let tiltUserTarget = 0;
    let scene = 0;
    let facing = -1;
    let clock = 0;
    let holdUntil = DWELL + 1.5;
    let glide: {
      t0: number;
      dur: number;
      l0: number;
      l1: number;
      a0: number;
      a1: number;
    } | null = null;
    let vel = 0;
    let dragging = false;

    const px = new Float32Array(N_LAND);
    const py = new Float32Array(N_LAND);
    const pz = new Float32Array(N_LAND);
    const bk = new Uint8Array(N_LAND);
    const opx = new Float32Array(OCEAN.n);
    const opy = new Float32Array(OCEAN.n);
    const opz = new Float32Array(OCEAN.n);
    const obk = new Uint8Array(OCEAN.n);
    const ax = new Float32Array(ARC_N + 1);
    const ay = new Float32Array(ARC_N + 1);
    const av = new Uint8Array(ARC_N + 1);
    const tmp = new Float32Array(3);
    const TRAIL = 30;
    const tx = new Float32Array(TRAIL);
    const ty = new Float32Array(TRAIL);
    const tz = new Float32Array(TRAIL);

    const layout = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const startGlide = (idx: number, forward: boolean, hold: number) => {
      const target = SCENE_LON[idx];
      const delta = forward ? posMod(target - lonC) : wrapPI(target - lonC);
      const dur = clamp(1.5 + Math.abs(delta) * 0.85, 1.8, 3.6);
      glide = {
        t0: clock,
        dur,
        l0: lonC,
        l1: lonC + delta,
        a0: tiltC,
        a1: SCENE_TILT[idx],
      };
      scene = idx;
      holdUntil = clock + dur + hold;
      vel = 0;
    };
    const step = (dt: number) => {
      if (dragging) {
        glide = null;
        holdUntil = clock + 4;
      } else if (glide) {
        const p = clamp((clock - glide.t0) / glide.dur, 0, 1);
        const e = easeInOut(p);
        lonC = glide.l0 + (glide.l1 - glide.l0) * e;
        tiltC = glide.a0 + (glide.a1 - glide.a0) * e;
        if (p >= 1) glide = null;
      } else {
        if (Math.abs(vel) > 0.004) {
          lonC += vel * dt;
          vel *= Math.exp(-dt * 2.4);
          holdUntil = Math.max(holdUntil, clock + 3);
          scene = nearestScene(lonC);
        } else vel = 0;
        lonC += dt * 0.012;
        tiltC += (SCENE_TILT[scene] - tiltC) * Math.min(1, dt * 1.6);
        if (clock >= holdUntil)
          startGlide((scene + 1) % GLOBE_SCENES.length, true, DWELL);
      }
      tiltUser += (tiltUserTarget - tiltUser) * Math.min(1, dt * 7);
      if (!dragging) tiltUserTarget *= Math.exp(-dt * 1.3);
      const f = nearestScene(lonC);
      if (f !== facing) {
        facing = f;
        cb.current.onScene?.(f);
      }
    };

    const render = (time: number) => {
      const intro = reduce ? 1 : Math.min(1, time / 1.8);
      const ease = 1 - Math.pow(1 - intro, 3);
      const wide = w >= 1024;
      const tablet = w >= 640 && w < 1024;

      const R0 = wide
        ? Math.min(h * 0.72, w * 0.315)
        : tablet
          ? Math.min(w * 0.54, h * 0.37, 390)
          : Math.min(w * 0.68, h * 0.31, 280);
      const R = R0 * (0.96 + 0.04 * ease);
      const cx = wide ? w * 0.75 : w * 0.5;
      const cy = wide ? h * 0.54 : tablet ? h * 0.65 : h * 0.69;
      G.cx = cx;
      G.cy = cy;
      G.R = R;
      const rot = -(
        lonC -
        (1 - ease) * (1 - ease) * 1.8 +
        (mouse.sx - 0.5) * -0.2
      );
      const tilt = clamp(
        tiltC + tiltUser + (mouse.sy - 0.5) * 0.1,
        -0.95,
        0.95,
      );
      const cosR = Math.cos(rot);
      const sinR = Math.sin(rot);
      const cosT = Math.cos(tilt);
      const sinT = Math.sin(tilt);
      let X = 0;
      let Y = 0;
      let Z = 0;
      const proj = (
        x: number,
        y: number,
        z: number,
        s: number,
        spin: boolean,
      ) => {
        const x1 = spin ? x * cosR + z * sinR : x;
        const z1 = spin ? -x * sinR + z * cosR : z;
        const y2 = y * cosT - z1 * sinT;
        Z = y * sinT + z1 * cosT;
        X = cx + x1 * s;
        Y = cy - y2 * s;
      };
      const u = R / 380;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (const s of STARS) {
        const tw = reduce ? 0.6 : 0.45 + 0.4 * Math.sin(time * 1.3 + s.p);
        ctx.fillStyle = `rgba(210,228,255,${(tw * 0.55).toFixed(3)})`;
        ctx.fillRect(s.x * w, s.y * h, s.r, s.r);
      }

      ctx.globalAlpha = ease;

      const halo = ctx.createRadialGradient(cx, cy, R * 0.82, cx, cy, R * 1.55);
      halo.addColorStop(0, "rgba(65,155,255,0.30)");
      halo.addColorStop(0.45, "rgba(36,117,210,0.18)");
      halo.addColorStop(0.75, "rgba(32,100,190,0.07)");
      halo.addColorStop(1, "rgba(8,25,43,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.55, 0, Math.PI * 2);
      ctx.fill();

      const ring = (front: boolean) => {
        ctx.lineWidth = 1;
        ctx.strokeStyle = front
          ? "rgba(160,205,255,0.22)"
          : "rgba(160,205,255,0.1)";
        ctx.beginPath();
        let pen = false;
        for (let k = 0; k <= 160; k++) {
          proj(RING[k * 3], RING[k * 3 + 1], RING[k * 3 + 2], R, false);
          if (Z > 0 === front) {
            if (pen) ctx.lineTo(X, Y);
            else ctx.moveTo(X, Y);
            pen = true;
          } else pen = false;
        }
        ctx.stroke();
      };
      ring(false);

      const body = ctx.createRadialGradient(
        cx - R * 0.38,
        cy - R * 0.43,
        R * 0.04,
        cx + R * 0.08,
        cy + R * 0.08,
        R * 1.2,
      );
      body.addColorStop(0, "#23588b");
      body.addColorStop(0.28, "#174775");
      body.addColorStop(0.62, "#0d3155");
      body.addColorStop(0.86, "#092441");
      body.addColorStop(1, "#06172a");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 0.8;
      ctx.strokeStyle = "rgba(140,190,255,0.09)";
      ctx.beginPath();
      for (const g of GRID) {
        let pen = false;
        for (let k = 0; k < g.length; k += 3) {
          proj(g[k], g[k + 1], g[k + 2], R, true);
          if (Z > 0) {
            if (pen) ctx.lineTo(X, Y);
            else ctx.moveTo(X, Y);
            pen = true;
          } else pen = false;
        }
      }
      ctx.stroke();

      for (let i = 0; i < OCEAN.n; i++) {
        const x = OCEAN.v[i * 3];
        const y = OCEAN.v[i * 3 + 1];
        const z = OCEAN.v[i * 3 + 2];
        const x1 = x * cosR + z * sinR;
        const z1 = -x * sinR + z * cosR;
        const y2 = y * cosT - z1 * sinT;
        const z2 = y * sinT + z1 * cosT;
        if (z2 <= 0.08) {
          obk[i] = 255;
          continue;
        }
        const ph = OCEAN.ph[i];
        const b =
          (0.5 + 0.5 * Math.sin(time * 1.35 - ph * 2.2)) *
          smooth(0.08, 0.4, z2);
        opx[i] = cx + x1 * R;
        opy[i] = cy - y2 * R + Math.sin(time * 1.7 + ph * 1.3) * 0.9 * u;
        opz[i] = z2;
        obk[i] = b < 0.4 ? 255 : b < 0.6 ? 0 : b < 0.78 ? 1 : 2;
      }
      ctx.lineWidth = Math.max(0.8, 1 * u);
      ctx.lineCap = "round";
      const GA = [0.14, 0.26, 0.46];
      for (let k = 0; k < 3; k++) {
        ctx.strokeStyle = `rgba(130,208,255,${GA[k]})`;
        ctx.beginPath();
        for (let i = 0; i < OCEAN.n; i++) {
          if (obk[i] !== k) continue;
          const L = R * 0.0105 * (0.5 + opz[i]);
          const gx = opx[i];
          const gy = opy[i];
          ctx.moveTo(gx - L, gy);
          ctx.quadraticCurveTo(gx - L / 2, gy - L * 0.45, gx, gy);
          ctx.quadraticCurveTo(gx + L / 2, gy + L * 0.45, gx + L, gy);
        }
        ctx.stroke();
      }

      for (let i = 0; i < N_LAND; i++) {
        const v = LAND[i];
        const x1 = v[0] * cosR + v[2] * sinR;
        const z1 = -v[0] * sinR + v[2] * cosR;
        const y2 = v[1] * cosT - z1 * sinT;
        const z2 = v[1] * sinT + z1 * cosT;
        if (z2 <= 0.02) {
          bk[i] = 255;
          continue;
        }
        px[i] = cx + x1 * R;
        py[i] = cy - y2 * R;
        pz[i] = z2;
        const lit = Math.max(0, (x1 * LX + y2 * LY + z2 * LZ) / L_LEN);
        const b = Math.min(0.999, Math.pow(z2, 0.45) * (0.58 + 0.72 * lit));
        bk[i] = Math.floor(b * BUCKETS);
      }
      for (let k = 0; k < BUCKETS; k++) {
        ctx.fillStyle = STYLE[k];
        ctx.beginPath();
        for (let i = 0; i < N_LAND; i++) {
          if (bk[i] !== k) continue;
          const s = (1.05 + 1.15 * pz[i]) * u;
          ctx.rect(px[i] - s / 2, py[i] - s / 2, s, s);
        }
        ctx.fill();
      }

      ctx.lineCap = "round";
      for (const v of VEHICLES) {
        const lanes = v.kind === "plane" ? 0 : 1;
        const r = v.route;
        const stepN = Math.max(1, Math.floor(r.n / 60));
        ctx.lineWidth = 1.1 * u;
        ctx.setLineDash(v.kind === "plane" ? [1.5 * u, 6 * u] : [4 * u, 6 * u]);
        ctx.lineDashOffset = reduce ? 0 : -time * 9 * u * (v.dir > 0 ? 1 : -1);
        ctx.strokeStyle =
          v.kind === "ship"
            ? "rgba(140,215,255,0.34)"
            : v.kind === "truck"
              ? "rgba(255,200,150,0.34)"
              : "rgba(220,235,255,0.2)";
        ctx.beginPath();
        let pen = false;
        for (let i = 0; i < r.n; i += stepN) {
          const f = r.cum[i] / (r.len || 1);
          const lift =
            v.kind === "plane"
              ? PLANE_LIFT * R * Math.pow(Math.sin(Math.PI * f), 0.6)
              : 0;
          proj(r.pts[i * 3], r.pts[i * 3 + 1], r.pts[i * 3 + 2], R, true);
          if (Z > 0.02) {
            if (pen) ctx.lineTo(X, Y - lift);
            else ctx.moveTo(X, Y - lift);
            pen = true;
          } else pen = false;
        }
        void lanes;
        ctx.stroke();
      }
      ctx.setLineDash([]);

      const startAt = reduce ? 0 : 1.3;
      ctx.globalCompositeOperation = "lighter";
      for (let r = 0; r < ARCS.length; r++) {
        const arc = ARCS[r];
        for (let k = 0; k <= ARC_N; k++) {
          proj(arc[k * 3], arc[k * 3 + 1], arc[k * 3 + 2], R, true);
          ax[k] = X;
          ay[k] = Y;
          const dx = X - cx;
          const dy = Y - cy;
          av[k] = Z > 0 || dx * dx + dy * dy > R * R ? 1 : 0;
        }
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(232,118,74,0.2)";
        ctx.beginPath();
        let pen = false;
        for (let k = 0; k <= ARC_N; k++) {
          if (av[k]) {
            if (pen) ctx.lineTo(ax[k], ay[k]);
            else ctx.moveTo(ax[k], ay[k]);
            pen = true;
          } else pen = false;
        }
        ctx.stroke();

        const period = 5.5 + (r % 3);
        const head =
          ((((time - startAt - r * 0.8) / period) % 1.45) + 1.45) % 1.45;
        if (time < startAt + r * 0.8 && !reduce) continue;
        const lo = Math.max(0, head - 0.4);
        const hi = Math.min(1, head);
        const i0 = Math.floor(lo * ARC_N);
        const i1 = Math.floor(hi * ARC_N);
        ctx.lineCap = "round";
        for (let k = i0; k < i1; k++) {
          if (!av[k] || !av[k + 1]) continue;
          const f = hi > lo ? (k / ARC_N - lo) / (hi - lo) : 0;
          ctx.strokeStyle = `rgba(255,175,125,${(0.12 + 0.55 * f).toFixed(3)})`;
          ctx.lineWidth = 1 + 1.4 * f;
          ctx.beginPath();
          ctx.moveTo(ax[k], ay[k]);
          ctx.lineTo(ax[k + 1], ay[k + 1]);
          ctx.stroke();
        }
        if (head <= 1) {
          const hk = Math.min(ARC_N, Math.round(head * ARC_N));
          if (av[hk]) {
            const g = ctx.createRadialGradient(
              ax[hk],
              ay[hk],
              0,
              ax[hk],
              ay[hk],
              11,
            );
            g.addColorStop(0, "rgba(255,225,200,0.8)");
            g.addColorStop(0.3, "rgba(255,150,100,0.35)");
            g.addColorStop(1, "rgba(232,118,74,0)");
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(ax[hk], ay[hk], 11, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      for (let n = 0; n < NODES.length; n++) {
        const v = NODES[n];
        proj(v[0], v[1], v[2], R, true);
        if (Z < 0.05) continue;
        const ph = reduce ? 0.4 : (time * 0.55 + n * 0.37) % 1;
        ctx.strokeStyle = `rgba(255,150,100,${(0.5 * (1 - ph)).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(X, Y, 3 + 16 * ph, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "rgba(255,214,190,0.95)";
        ctx.beginPath();
        ctx.arc(X, Y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";

      const at = (r: Route, f: number, lift: number) => {
        sampleRoute(r, f, tmp);
        proj(tmp[0], tmp[1], tmp[2], R, true);
        Y -= lift;
      };
      const liftOf = (v: Vehicle, f: number) =>
        v.kind === "plane"
          ? PLANE_LIFT * R * Math.pow(Math.sin(Math.PI * clamp(f, 0, 1)), 0.6)
          : 0;

      for (const v of VEHICLES) {
        const cyc = v.dur + PAUSE;
        const phase = (((time + v.f0 * v.dur) % cyc) + cyc) % cyc;
        if (phase > v.dur) continue;
        const f = phase / v.dur;
        const fade = Math.min(1, f / 0.08, (1 - f) / 0.08);
        const r = v.route;

        at(r, f, 0);
        const sx = X;
        const sy = Y;
        const sz = Z;
        const vis = smooth(0.06, 0.34, sz) * fade;
        if (vis <= 0.01) continue;
        const lift = liftOf(v, f);
        const alt01 =
          v.kind === "plane" ? Math.pow(Math.sin(Math.PI * f), 0.6) : 0;
        const L =
          v.size * R * (0.62 + 0.38 * Math.pow(sz, 0.6)) * (1 + 0.28 * alt01);
        const wob = reduce ? 0 : 1;

        const f1 = Math.min(1, f + 0.006);
        const f0 = Math.max(0, f1 - 0.006);
        at(r, f0, liftOf(v, f0));
        const hx0 = X;
        const hy0 = Y;
        at(r, f1, liftOf(v, f1));
        const hdx = X - hx0;
        const hdy = Y - hy0;
        if (Math.abs(hdx) > 0.05 * u) v.dir = hdx < 0 ? -1 : 1;
        const ang = clamp(Math.atan2(hdy, Math.abs(hdx) + 1e-6), -0.62, 0.62);

        ctx.globalAlpha = ease * vis;

        const trailLen = v.kind === "ship" ? 22 : v.kind === "plane" ? 28 : 10;
        const dRad =
          v.kind === "ship" ? 0.0105 : v.kind === "plane" ? 0.034 : 0.012;
        const back0 = v.kind === "plane" ? 0.4 * v.size : 0.46 * v.size;
        let nT = 0;
        for (let i = 0; i < trailLen; i++) {
          const ff = f - (back0 + i * dRad) / (r.len || 1);
          if (ff < 0) break;
          at(r, ff, liftOf(v, ff));
          tx[i] = X;
          ty[i] = Y;
          tz[i] = Z;
          nT++;
        }

        if (v.kind === "ship") {
          for (let k = 0; k < 2; k++) {
            const p = reduce ? 0.4 + k * 0.4 : (time * 0.55 + k * 0.5) % 1;
            const rx = L * (0.38 + 0.55 * p);
            ctx.strokeStyle = `rgba(190,236,255,${(0.42 * (1 - p)).toFixed(3)})`;
            ctx.lineWidth = 1.2 * u;
            ctx.beginPath();
            ctx.ellipse(
              sx,
              sy + L * 0.07,
              rx,
              rx * (0.16 + 0.2 * sz),
              0,
              0,
              TAU,
            );
            ctx.stroke();
          }
          for (let i = 1; i < nT; i++) {
            const a = 1 - i / nT;
            const dx = tx[i - 1] - tx[i];
            const dy = ty[i - 1] - ty[i];
            const m = Math.hypot(dx, dy) || 1;
            const nx = -dy / m;
            const ny = dx / m;
            const spread = L * (0.035 + 0.013 * i);
            ctx.strokeStyle = `rgba(228,247,255,${(0.6 * a * a).toFixed(3)})`;
            ctx.lineWidth = (3.4 * a + 0.5) * u;
            ctx.beginPath();
            ctx.moveTo(tx[i - 1], ty[i - 1] + L * 0.07);
            ctx.lineTo(tx[i], ty[i] + L * 0.07);
            ctx.stroke();
            ctx.strokeStyle = `rgba(200,236,255,${(0.34 * a).toFixed(3)})`;
            ctx.lineWidth = (1.1 * a + 0.4) * u;
            ctx.beginPath();
            ctx.moveTo(
              tx[i - 1] + nx * spread * 0.92,
              ty[i - 1] + ny * spread * 0.92 * 0.35 + L * 0.07,
            );
            ctx.lineTo(
              tx[i] + nx * spread,
              ty[i] + ny * spread * 0.35 + L * 0.07,
            );
            ctx.moveTo(
              tx[i - 1] - nx * spread * 0.92,
              ty[i - 1] - ny * spread * 0.92 * 0.35 + L * 0.07,
            );
            ctx.lineTo(
              tx[i] - nx * spread,
              ty[i] - ny * spread * 0.35 + L * 0.07,
            );
            ctx.stroke();
          }
        } else if (v.kind === "plane") {
          ctx.fillStyle = "rgba(2,10,24,0.34)";
          ctx.beginPath();
          ctx.ellipse(sx, sy, L * 0.3, L * 0.07, 0, 0, TAU);
          ctx.fill();
          ctx.lineCap = "round";
          for (let i = 1; i < nT; i++) {
            const a = 1 - i / nT;
            ctx.strokeStyle = `rgba(235,246,255,${(0.2 * a).toFixed(3)})`;
            ctx.lineWidth = (6 * a + 1) * u;
            ctx.beginPath();
            ctx.moveTo(tx[i - 1], ty[i - 1]);
            ctx.lineTo(tx[i], ty[i]);
            ctx.stroke();
            ctx.strokeStyle = `rgba(255,255,255,${(0.75 * a).toFixed(3)})`;
            ctx.lineWidth = (2.2 * a + 0.4) * u;
            ctx.beginPath();
            ctx.moveTo(tx[i - 1], ty[i - 1]);
            ctx.lineTo(tx[i], ty[i]);
            ctx.stroke();
          }
        } else {
          for (let i = 0; i < nT; i++) {
            const a = 1 - i / nT;
            const drift = reduce ? 0 : Math.sin(time * 3 + i * 1.7) * 0.8 * u;
            ctx.fillStyle = `rgba(214,196,168,${(0.3 * a * a).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(
              tx[i],
              ty[i] + L * 0.1 - i * 0.7 * u + drift,
              (1.6 + i * 0.9) * u,
              0,
              TAU,
            );
            ctx.fill();
          }
        }

        const bobY =
          v.kind === "ship"
            ? Math.sin(time * 2.3 + v.f0 * 9) * L * 0.012 * wob
            : 0;
        const bobA =
          v.kind === "ship"
            ? Math.sin(time * 1.7 + v.f0 * 7) * 0.035 * wob
            : v.kind === "plane"
              ? Math.sin(time * 1.2 + v.f0 * 5) * 0.025 * wob
              : 0;
        ctx.save();
        ctx.translate(sx, sy - lift + bobY);
        ctx.rotate(v.dir * (ang + bobA));
        ctx.scale(v.dir * L, L);
        ctx.shadowColor = "rgba(0,8,22,0.5)";
        ctx.shadowBlur = 7 * u;
        ctx.shadowOffsetY = 3 * u;
        if (v.kind === "ship") drawShip(ctx, time);
        else if (v.kind === "plane") drawPlane(ctx, time);
        else drawTruck(ctx, time);
        ctx.restore();
        ctx.globalAlpha = ease;
      }

      ring(true);
      const th = reduce ? 0.9 : time * 0.32 + 0.9;
      {
        const incl = 1.15;
        const roll = -0.32;
        const x = Math.cos(th) * 1.34;
        const y = Math.sin(th) * 1.34;
        const y2 = y * Math.cos(incl);
        const z2 = y * Math.sin(incl);
        proj(
          x * Math.cos(roll) - y2 * Math.sin(roll),
          x * Math.sin(roll) + y2 * Math.cos(roll),
          z2,
          R,
          false,
        );
        if (Z > 0) {
          const g = ctx.createRadialGradient(X, Y, 0, X, Y, 11);
          g.addColorStop(0, "rgba(255,255,255,0.95)");
          g.addColorStop(0.35, "rgba(160,205,255,0.4)");
          g.addColorStop(1, "rgba(160,205,255,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(X, Y, 11, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const rim = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      rim.addColorStop(0, "rgba(160,215,255,0.72)");
      rim.addColorStop(0.28, "rgba(105,175,245,0.32)");
      rim.addColorStop(0.65, "rgba(90,155,225,0.12)");
      rim.addColorStop(1, "rgba(80,140,220,0.42)");
      ctx.save();
      ctx.shadowColor = "rgba(65,155,255,0.22)";
      ctx.shadowBlur = 16 * u;
      ctx.strokeStyle = rim;
      ctx.lineWidth = Math.max(1.2, 1.5 * u);
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    layout();
    const ro = new ResizeObserver(() => {
      layout();
      if (reduce) render(3);
    });
    ro.observe(canvas);

    if (reduce) {
      api.current = {
        goTo: (i) => {
          const idx = clamp(Math.round(i), 0, GLOBE_SCENES.length - 1);
          lonC = SCENE_LON[idx];
          tiltC = SCENE_TILT[idx];
          scene = idx;
          facing = idx;
          cb.current.onScene?.(idx);
          render(3);
        },
      };
      render(3);
      return () => {
        api.current = null;
        ro.disconnect();
      };
    }

    api.current = {
      goTo: (i) => {
        const idx = clamp(Math.round(i), 0, GLOBE_SCENES.length - 1);
        startGlide(idx, false, DWELL + 3);
      },
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
    };
    const interactive = (t: EventTarget | null) =>
      !!(t as Element | null)?.closest?.(
        "a,button,input,textarea,select,label,header,nav,[data-nodrag]",
      );
    const onGlobe = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return (
        Math.hypot(e.clientX - rect.left - G.cx, e.clientY - rect.top - G.cy) <
        G.R * 1.06
      );
    };
    let dragId = -1;
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    const setCursor = (v: string) => {
      if (hero) hero.style.cursor = v;
    };
    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      dragId = -1;
      scene = nearestScene(lonC);
      holdUntil = clock + 4.5;
      document.body.style.userSelect = "";
      setCursor("");
    };
    const onDown = (e: PointerEvent) => {
      if (!visible || (e.pointerType === "mouse" && e.button !== 0)) return;
      if (interactive(e.target) || !onGlobe(e)) return;
      dragging = true;
      dragId = e.pointerId;
      lastX = e.clientX;
      lastY = e.clientY;
      lastT = e.timeStamp;
      vel = 0;
      glide = null;
      document.body.style.userSelect = "none";
      setCursor("grabbing");
      cb.current.onInteract?.();
    };
    const onDragMove = (e: PointerEvent) => {
      onMove(e);
      if (dragging && e.pointerId === dragId) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const dt = Math.max(0.008, (e.timeStamp - lastT) / 1000);
        lonC -= dx / G.R;
        vel = vel * 0.55 + (-dx / G.R / dt) * 0.45;
        tiltUserTarget = clamp(tiltUserTarget + (dy / G.R) * 0.9, -0.55, 0.55);
        tiltUser = tiltUserTarget;
        lastX = e.clientX;
        lastY = e.clientY;
        lastT = e.timeStamp;
      } else if (!dragging && e.pointerType === "mouse") {
        setCursor(
          !interactive(e.target) && visible && onGlobe(e) ? "grab" : "",
        );
      }
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerId === dragId) endDrag();
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onDragMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    if (hero) hero.style.touchAction = "pan-y";

    const t0 = performance.now();
    let last = t0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock = (now - t0) / 1000;
      mouse.sx += (mouse.x - mouse.sx) * Math.min(1, dt * 2.5);
      mouse.sy += (mouse.y - mouse.sy) * Math.min(1, dt * 2.5);
      step(dt);
      render(clock);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      api.current = null;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onDragMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.body.style.userSelect = "";
      if (hero) {
        hero.style.cursor = "";
        hero.style.touchAction = "";
      }
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
});
