"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";

type SectionId = "vip" | "a" | "b" | "c" | "stage";
type SelectedSection = SectionId | null;

const toRad = (deg: number) => (deg * Math.PI) / 180;

const polarXY = (cx: number, cy: number, r: number, deg: number) => [
  cx + r * Math.cos(toRad(deg)),
  cy + r * Math.sin(toRad(deg)),
];

const f = (n: number) => n.toFixed(2);

function annularArc(
  cx: number,
  cy: number,
  r1: number,
  r2: number,
  d1: number,
  d2: number,
) {
  const diff = (((d2 - d1) % 360) + 360) % 360;
  const lg = diff > 180 ? 1 : 0;
  const [x1, y1] = polarXY(cx, cy, r2, d1);
  const [x2, y2] = polarXY(cx, cy, r2, d2);
  const [x3, y3] = polarXY(cx, cy, r1, d2);
  const [x4, y4] = polarXY(cx, cy, r1, d1);

  return [
    `M${f(x1)},${f(y1)}`,
    `A${r2},${r2},0,${lg},1,${f(x2)},${f(y2)}`,
    `L${f(x3)},${f(y3)}`,
    `A${r1},${r1},0,${lg},0,${f(x4)},${f(y4)}`,
    "Z",
  ].join(" ");
}

const CX = 250;
const CY = 262;
const STAGE_D1 = -150;
const STAGE_D2 = -30;
const RING_D1 = -30;
const RING_D2 = 210;

const RINGS = [
  { id: "c" as const, r1: 178, r2: 215, label: "C" },
  { id: "b" as const, r1: 140, r2: 178, label: "B" },
  { id: "a" as const, r1: 100, r2: 140, label: "A" },
];

const FILLS: Record<SectionId, string> = {
  vip: "#252525",
  a: "#141414",
  b: "#161616",
  c: "#1b1b1b",
  stage: "#b8b8b8",
};

const HOVERED: Record<SectionId, string> = {
  vip: "#302840",
  a: "#272032",
  b: "#232030",
  c: "#1f1f2e",
  stage: "#cccccc",
};

const SELECTED: Record<SectionId, string> = {
  vip: "#4c1d95",
  a: "#3b1a7a",
  b: "#341870",
  c: "#2d1466",
  stage: "#7c3aed",
};

const SECTION_INFO: Record<
  SectionId,
  { label: string; price: string; desc: string }
> = {
  vip: {
    label: "VIP+",
    price: "$400",
    desc: "Front-of-stage circle · limited to 40 tickets",
  },
  a: { label: "Ring A", price: "$325", desc: "92 tickets · seated together" },
  b: {
    label: "Ring B",
    price: "$300",
    desc: "156 tickets · best mid-range view",
  },
  c: { label: "Ring C", price: "$200", desc: "248 tickets · great atmosphere" },
  stage: {
    label: "Stage",
    price: "-",
    desc: "Performance area - not a seating section",
  },
};

const SEP_COLOR = "#050505";

type SectionProps = {
  id: SectionId;
  d?: string;
  hovered: SelectedSection;
  setHovered: Dispatch<SetStateAction<SelectedSection>>;
  selected: SelectedSection;
  setSelected: Dispatch<SetStateAction<SelectedSection>>;
  isCircle?: boolean;
  cx?: number;
  cy?: number;
  r?: number;
};

function Section({
  id,
  d,
  hovered,
  setHovered,
  selected,
  setSelected,
  isCircle,
  cx,
  cy,
  r,
}: SectionProps) {
  const isHovered = hovered === id;
  const isSelected = selected === id;
  const fill = isSelected ? SELECTED[id] : isHovered ? HOVERED[id] : FILLS[id];

  const handlers = {
    onMouseEnter: () => setHovered(id),
    onMouseLeave: () => setHovered(null),
    onClick: () => setSelected((prev) => (prev === id ? null : id)),
  };

  const sharedProps = {
    fill,
    stroke: SEP_COLOR,
    strokeWidth: 5,
    strokeLinejoin: "round" as const,
    style: { cursor: "pointer", transition: "fill 0.15s ease" },
    ...handlers,
  };

  if (isCircle && cx && cy && r) {
    return <circle cx={cx} cy={cy} r={r} {...sharedProps} />;
  }

  if (!d) {
    return null;
  }

  return <path d={d} {...sharedProps} />;
}

function InfoBar({ selected }: { selected: SelectedSection }) {
  if (!selected) {
    return (
      <p className="min-h-6 text-center text-sm text-gray-500">
        Click a section to see details
      </p>
    );
  }

  const { label, price, desc } = SECTION_INFO[selected];

  return (
    <p className="min-h-6 text-center text-sm">
      <span className="font-semibold text-white">{label}</span>
      <span className="mx-2 font-semibold text-purple-400">{price}</span>
      <span className="text-gray-400">{desc}</span>
    </p>
  );
}

function BuyButton({ selected }: { selected: SelectedSection }) {
  if (!selected || selected === "stage") {
    return null;
  }

  const { label, price } = SECTION_INFO[selected];

  return (
    <button className="mt-4 rounded-2xl bg-linear-to-r from-purple-700 to-violet-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-purple-900/40 transition-all duration-200 hover:from-purple-600 hover:to-violet-500">
      Buy {label} Tickets · {price} / person
    </button>
  );
}

export default function VenueMap({ eventTitle }: { eventTitle: string }) {
  const [hovered, setHovered] = useState<SelectedSection>(null);
  const [selected, setSelected] = useState<SelectedSection>(null);

  const ringLabels = RINGS.map(({ id, r1, r2, label }) => {
    const midR = (r1 + r2) / 2;
    const [lx, ly] = polarXY(CX, CY, midR, 90);
    return { id, lx, ly, label };
  });

  const [stx, sty] = polarXY(CX, CY, 158, -90);

  const toggleLegend = useCallback((id: SectionId) => {
    setSelected((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-[#0e1017] p-4 sm:p-5">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black tracking-tight text-white">
          Select Your Section
        </h2>
        <p className="mt-1 text-sm text-gray-500">{eventTitle}</p>
      </div>

      <div className="w-full max-w-120">
        <svg
          viewBox="0 0 500 520"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive venue seating map"
        >
          <circle cx={CX} cy={CY} r={228} fill="#090909" />
          <circle cx={CX} cy={CY} r={220} fill="#0f0f0f" />

          {[214, 208, 200].map((r) => (
            <circle
              key={r}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="#0a0a0a"
              strokeWidth={1.5}
            />
          ))}

          {RINGS.map(({ id, r1, r2 }) => (
            <Section
              key={id}
              id={id}
              d={annularArc(CX, CY, r1, r2, RING_D1, RING_D2)}
              hovered={hovered}
              setHovered={setHovered}
              selected={selected}
              setSelected={setSelected}
            />
          ))}

          <Section
            id="stage"
            d={annularArc(CX, CY, 100, 215, STAGE_D1, STAGE_D2)}
            hovered={hovered}
            setHovered={setHovered}
            selected={selected}
            setSelected={setSelected}
          />

          <text
            x={f(stx)}
            y={f(sty)}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={13}
            fontWeight={600}
            fill="#2a2a2a"
            style={{
              pointerEvents: "none",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            STAGE
          </text>

          <Section
            id="vip"
            isCircle
            cx={CX}
            cy={CY}
            r={100}
            hovered={hovered}
            setHovered={setHovered}
            selected={selected}
            setSelected={setSelected}
          />

          {[96, 90, 84].map((r) => (
            <circle
              key={r}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="#1c1c1c"
              strokeWidth={1}
            />
          ))}

          <text
            x={CX}
            y={CY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={17}
            fontWeight={500}
            fill="#c0c0c0"
            style={{
              pointerEvents: "none",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            VIP+
          </text>

          {ringLabels.map(({ id, lx, ly, label }) => (
            <text
              key={id}
              x={f(lx)}
              y={f(ly)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={13}
              fontWeight={500}
              fill={selected === id ? "#a78bfa" : "#555555"}
              style={{
                pointerEvents: "none",
                fontFamily: "system-ui, sans-serif",
                transition: "fill 0.15s",
              }}
            >
              {label}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-4 w-full max-w-120">
        <InfoBar selected={selected} />
        <div className="flex justify-center">
          <BuyButton selected={selected} />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-5">
        {[
          { id: "vip" as const, label: "VIP+", color: "#4c1d95" },
          { id: "a" as const, label: "Ring A", color: "#3b1a7a" },
          { id: "b" as const, label: "Ring B", color: "#341870" },
          { id: "c" as const, label: "Ring C", color: "#2d1466" },
          { id: "stage" as const, label: "Stage", color: "#b8b8b8" },
        ].map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => toggleLegend(id)}
            className="group flex items-center gap-1.5"
          >
            <span
              className="h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125"
              style={{ background: color }}
            />
            <span
              className={`text-xs transition-colors ${
                selected === id
                  ? "text-purple-300"
                  : "text-gray-500 group-hover:text-gray-300"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
