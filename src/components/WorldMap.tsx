import {
  MAP_COLS,
  MAP_LAT_BOTTOM,
  MAP_LAT_TOP,
  MAP_ROWS,
  worldDots,
} from "@/content/worldDots";
import type { Market } from "@/content/site";

const STEP = 6;
export const MAP_W = (MAP_COLS - 1) * STEP + STEP;
export const MAP_H = (MAP_ROWS - 1) * STEP + STEP;
const d = worldDots.map(([c, r]) => `M${c * STEP} ${r * STEP}h0.01`).join("");
const project = (lon: number, lat: number) => ({
  x: ((lon + 180) / 360) * (MAP_COLS - 1) * STEP,
  y:
    ((MAP_LAT_TOP - lat) / (MAP_LAT_TOP - MAP_LAT_BOTTOM)) *
    (MAP_ROWS - 1) *
    STEP,
});

export function WorldMap({
  markets = [],
  base = null,
  sweep = false,
  dotClass = "text-white/25",
  className,
}: {
  markets?: Market[];
  base?: Market | null;
  sweep?: boolean;
  dotClass?: string;
  className?: string;
}) {
  const placed = markets.filter(
    (m) => m.lon !== undefined && m.lat !== undefined,
  );
  const b =
    base && base.lon !== undefined && base.lat !== undefined
      ? project(base.lon, base.lat)
      : null;
  return (
    <svg
      viewBox={`-6 -6 ${MAP_W + 12} ${MAP_H + 12}`}
      className={className}
      role="img"
      aria-label={
        placed.length
          ? "World map showing confirmed markets"
          : "Dot-matrix world map"
      }
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        className={dotClass}
      />
      {sweep && (
        <>
          <defs>
            <linearGradient id="sw" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="swm">
              <rect
                y="-6"
                width={MAP_W * 0.28}
                height={MAP_H + 12}
                fill="url(#sw)"
              >
                <animate
                  attributeName="x"
                  from={-MAP_W * 0.3}
                  to={MAP_W}
                  dur="9s"
                  repeatCount="indefinite"
                />
              </rect>
            </mask>
          </defs>
          <path
            d={d}
            fill="none"
            stroke="#E8764A"
            strokeWidth="3.8"
            strokeLinecap="round"
            mask="url(#swm)"
          />
        </>
      )}
      {b &&
        placed.map((m, i) => {
          const p = project(m.lon!, m.lat!);
          const mx = (b.x + p.x) / 2,
            my = Math.min(b.y, p.y) - Math.abs(p.x - b.x) * 0.22 - 20;
          return (
            <path
              key={`a${i}`}
              d={`M${b.x} ${b.y} Q${mx} ${my} ${p.x} ${p.y}`}
              fill="none"
              stroke="#E8764A"
              strokeWidth="1.6"
              strokeDasharray="5 5"
            />
          );
        })}
      {b && (
        <circle
          cx={b.x}
          cy={b.y}
          r="7"
          fill="#fff"
          stroke="#C8481C"
          strokeWidth="3"
        >
          <title>{base!.name}</title>
        </circle>
      )}
      {placed.map((m, i) => {
        const p = project(m.lon!, m.lat!);
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="12" fill="#C8481C" opacity="0.25" />
            <circle cx={p.x} cy={p.y} r="5.5" fill="#E8764A">
              <title>{m.name}</title>
            </circle>
          </g>
        );
      })}
    </svg>
  );
}
