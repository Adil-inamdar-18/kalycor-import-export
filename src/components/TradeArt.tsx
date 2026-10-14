"use client";
import { useId } from "react";
import { easeInOut, motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";

/**
 * One line-drawn trade journey driven by a single 0..1 progress value (auto-plays once in the hero).
 * 0.00 empty quay -> 0.14 crane + waves drawn -> 0.12-0.42 containers stack on the ship
 * -> 0.38-0.50 last box is lowered by the crane -> 0.50-0.95 plane flies the route while the ship sails
 * -> 0.92-1.00 the destination pin lands. Final frame (progress = 1) is a complete still composition.
 */
const BOX = ["#C8481C", "#E8764A", "#2C8596", "#1F5489", "#F7F8FA", "#9E3512"];
const COLS = 6;
const ROWS = 3;
const X0 = 160;
const BW = 24;
const BH = 14;
const DECK = 374;
const ARC = "M140 230 Q300 40 470 296";
const P0 = [140, 230];
const P1 = [300, 40];
const P2 = [470, 296];
const STARS = [[56, 58], [118, 112], [212, 66], [352, 58], [424, 118], [492, 72], [308, 150], [88, 168], [250, 28], [452, 36]];

function bez(t: number) {
  const u = 1 - t;
  const x = u * u * P0[0] + 2 * u * t * P1[0] + t * t * P2[0];
  const y = u * u * P0[1] + 2 * u * t * P1[1] + t * t * P2[1];
  const dx = 2 * u * (P1[0] - P0[0]) + 2 * t * (P2[0] - P1[0]);
  const dy = 2 * u * (P1[1] - P0[1]) + 2 * t * (P2[1] - P1[1]);
  return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI };
}

function CrateShape({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <>
      <rect x={x} y={y} width={BW - 2} height={BH - 1.5} rx="1" fill={color} />
      <path d={`M${x + 5} ${y + 2}v${BH - 5.5}M${x + 10} ${y + 2}v${BH - 5.5}M${x + 15} ${y + 2}v${BH - 5.5}`} stroke="rgba(0,0,0,0.22)" strokeWidth="1" />
    </>
  );
}

function Crate({ progress, start, x, y, color }: { progress: MotionValue<number>; start: number; x: number; y: number; color: string }) {
  const v = useTransform(progress, [start, start + 0.05], [0, 1]);
  const dy = useTransform(v, [0, 1], [-18, 0]);
  return (
    <motion.g style={{ opacity: v, y: dy }}>
      <CrateShape x={x} y={y} color={color} />
    </motion.g>
  );
}

const crates = Array.from({ length: ROWS * COLS - 1 }, (_, k) => {
  const row = Math.floor(k / COLS);
  const col = k % COLS;
  return { k, x: X0 + col * BW, y: DECK - (row + 1) * BH, color: BOX[(col + row * 2) % BOX.length] };
});

export function TradeArt({ progress, className }: { progress: MotionValue<number>; className?: string }) {
  const reduce = useReducedMotion();
  const uid = useId().replace(/:/g, "");

  const waves = useTransform(progress, [0, 0.16], [0, 1]);
  const craneDraw = useTransform(progress, [0, 0.14], [0, 1]);
  const hull = useTransform(progress, [0.04, 0.16], [0, 1]);
  const port = useTransform(progress, [0.3, 0.5], [0, 1]);
  const carryY = useTransform(progress, [0, 0.38, 0.5], [-72, -72, 0]);
  const cableEnd = useTransform(carryY, (v) => 332 + v);
  const cableOpacity = useTransform(progress, [0.46, 0.5], [1, 0]);
  const t = useTransform(progress, [0.5, 0.95], [0, 1], { ease: easeInOut });
  const planeTf = useTransform(t, (v) => {
    const p = bez(v);
    return `translate(${p.x}px, ${p.y}px) rotate(${p.a}deg)`;
  });
  const planeOpacity = useTransform(t, [0, 0.04, 0.95, 1], [0, 1, 1, 0]);
  const shipX = useTransform(progress, [0.52, 0.95], [0, 80], { ease: easeInOut });
  const pin = useTransform(progress, [0.92, 1], [0, 1]);

  return (
    <svg viewBox="0 0 520 520" className={className} role="img" aria-label="A container ship loading at port while a plane flies the route to the destination">
      <defs>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8764A" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#E8764A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-fade`} gradientUnits="userSpaceOnUse" x1="-260" y1="0" x2="10" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="100%" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id={`${uid}-ground`} maskUnits="userSpaceOnUse" x="-600" y="300" width="2600" height="400">
          <rect x="-600" y="300" width="2600" height="400" fill={`url(#${uid}-fade)`} />
        </mask>
        <mask id={`${uid}-arc`} maskUnits="userSpaceOnUse" x="0" y="0" width="520" height="520">
          <motion.path d={ARC} fill="none" stroke="#fff" strokeWidth="10" style={{ pathLength: t }} />
        </mask>
      </defs>

      {/* sky */}
      {STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="#fff" opacity="0.45" />
      ))}
      <motion.ellipse cx="430" cy="392" rx="210" ry="130" fill={`url(#${uid}-glow)`} style={{ opacity: port }} />

      {/* destination port */}
      <motion.g style={{ opacity: port }}>
        <rect x="424" y="400" width="1200" height="120" fill="#1B3550" />
        {[0, 1, 2].flatMap((r) =>
          [0, 1, 2].map((c) => (r + c < 4 ? <CrateShape key={`${r}${c}`} x={434 + c * 24} y={386 - r * BH} color={BOX[(c * 2 + r + 1) % BOX.length]} /> : null)),
        )}
        <line x1="424" y1="400" x2="1624" y2="400" stroke="#9FB4C8" strokeWidth="2" />
      </motion.g>

      {/* sea */}
      <g mask={`url(#${uid}-ground)`}>
        <rect x="-600" y="400" width="2600" height="240" fill="#0A2038" />
        {[414, 432, 452, 474, 496].map((y) => (
          <motion.path key={y} d={`M-600 ${y} Q-340 ${y - 5} -80 ${y} T440 ${y} T960 ${y} T1480 ${y}`} fill="none" stroke="#1F5489" strokeWidth="1.5" style={{ pathLength: waves }} />
        ))}
      </g>

      {/* ship */}
      <motion.g style={{ x: shipX }}>
        <motion.g animate={reduce ? undefined : { y: [0, -2.5, 0] }} transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}>
          <motion.g style={{ opacity: hull }}>
            <path d="M128 374 H328 L308 406 H148 Z" fill="#0B1E33" stroke="#9FB4C8" strokeWidth="2" strokeLinejoin="round" />
            <path d="M144 396 H312 L308 406 H148 Z" fill="#C8481C" />
            <rect x="134" y="346" width="22" height="28" fill="#E9EEF3" />
            <path d="M137 354 H153 M137 361 H153" stroke="#0B1E33" strokeWidth="1.5" />
            <rect x="140" y="334" width="8" height="12" fill="#C8481C" />
          </motion.g>
          {crates.map((c) => (
            <Crate key={c.k} progress={progress} start={0.12 + (c.k * 0.3) / crates.length} x={c.x} y={c.y} color={c.color} />
          ))}
          <motion.g style={{ y: carryY }}>
            <CrateShape x={X0 + 5 * BW} y={DECK - 3 * BH} color={BOX[(5 + 2 * 2) % BOX.length]} />
          </motion.g>
        </motion.g>
      </motion.g>
      <rect x="-600" y="400" width="2600" height="10" fill="#0A2038" opacity="0.88" mask={`url(#${uid}-ground)`} />

      {/* quay + crane */}
      <g mask={`url(#${uid}-ground)`}>
        <rect x="-600" y="400" width="725" height="240" fill="#1B3550" />
        <line x1="-600" y1="400" x2="125" y2="400" stroke="#9FB4C8" strokeWidth="2" />
      </g>
      <g fill="none" stroke="#C9D6E3" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <motion.path d="M34 400 V236 M104 400 V236 M34 340 L104 280 M104 340 L34 280" style={{ pathLength: craneDraw }} />
        <motion.path d="M24 236 H310 M40 236 L70 196 L100 236 M70 196 L310 236 M70 196 L24 236" style={{ pathLength: craneDraw }} />
      </g>
      <rect x="284" y="232" width="16" height="8" fill="#08192B" stroke="#C9D6E3" strokeWidth="2" />
      <motion.line x1="292" y1="240" x2="292" y2={cableEnd} stroke="#C9D6E3" strokeWidth="1.5" style={{ opacity: cableOpacity }} />

      {/* route + plane */}
      <path d={ARC} fill="none" stroke="#E8764A" strokeWidth="3" strokeLinecap="round" strokeDasharray="0.1 9" mask={`url(#${uid}-arc)`} />
      <motion.g style={{ transform: planeTf, opacity: planeOpacity }}>
        <path d="M16 0 C12 -2.5 -18 -2.5 -22 0 C-18 2.5 12 2.5 16 0Z M5 -1.5 L-7 -18 L-12 -18 L-6 -1.5Z M5 1.5 L-7 18 L-12 18 L-6 1.5Z M-16 -1.2 L-22 -7 L-25 -7 L-21 -1.2Z M-16 1.2 L-22 7 L-25 7 L-21 1.2Z" fill="#F7F8FA" />
      </motion.g>

      {/* destination pin */}
      <g transform="translate(472 338)">
        <motion.g style={{ scale: pin, opacity: pin, originX: "50%", originY: "100%", transformBox: "fill-box" }}>
          <path d="M0 0 C-10 -14 -14 -20 -14 -28 A14 14 0 1 1 14 -28 C14 -20 10 -14 0 0Z" fill="#E8764A" />
          <circle cx="0" cy="-28" r="5" fill="#08192B" />
        </motion.g>
        {!reduce && (
          <motion.ellipse cx="0" cy="0" rx="6" ry="2.5" fill="none" stroke="#E8764A" strokeWidth="1.5" initial={{ opacity: 0 }} animate={{ rx: [6, 30], ry: [2.5, 11], opacity: [0.7, 0] }} transition={{ duration: 2.2, delay: 6.6, repeat: Infinity, ease: "easeOut" }} />
        )}
      </g>
    </svg>
  );
}