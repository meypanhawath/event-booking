"use client";

import type { Dispatch, SetStateAction } from "react";
import { useCallback, useMemo, useState } from "react";
import type { Ticket } from "@/lib/types/event";

type SectionId = "diamond" | "platinum" | "gold" | "silver" | "stage";
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
  { id: "silver" as const, r1: 178, r2: 215, label: "Silver" },
  { id: "gold" as const, r1: 140, r2: 178, label: "Gold" },
  { id: "platinum" as const, r1: 100, r2: 140, label: "Platinum" },
];

const FILLS: Record<SectionId, string> = {
  diamond: "#52525b",
  platinum: "#71717a",
  gold: "#52525b",
  silver: "#3f3f46",
  stage: "#d4d4d8",
};

const HOVERED: Record<SectionId, string> = {
  diamond: "#6d28d9",
  platinum: "#7c3aed",
  gold: "#6d28d9",
  silver: "#5b21b6",
  stage: "#e4e4e7",
};

const SELECTED: Record<SectionId, string> = {
  diamond: "#4c1d95",
  platinum: "#3b1a7a",
  gold: "#341870",
  silver: "#2d1466",
  stage: "#7c3aed",
};

type SectionMeta = {
  label: string;
  price: string;
  desc: string;
  ticketId?: number;
};

const SECTION_INFO: Record<SectionId, SectionMeta> = {
  diamond: {
    label: "Diamond",
    price: "$400",
    desc: "Front-of-stage circle · limited to 40 tickets",
  },
  platinum: { label: "Platinum", price: "$325", desc: "92 tickets · seated together" },
  gold: {
    label: "Gold",
    price: "$300",
    desc: "156 tickets · best mid-range view",
  },
  silver: { label: "Silver", price: "$200", desc: "248 tickets · great atmosphere" },
  stage: {
    label: "Stage",
    price: "-",
    desc: "Performance area - not a seating section",
  },
};

const ZONE_ORDER: SectionId[] = ["diamond", "platinum", "gold", "silver"];

const getSectionIdFromType = (type: string): SectionId | null => {
  const normalizedType = type.trim().toLowerCase();

  if (normalizedType.includes("diamond")) return "diamond";
  if (normalizedType.includes("platinum")) return "platinum";
  if (normalizedType.includes("gold") || normalizedType.includes("premium")) return "gold";
  if (normalizedType.includes("silver") || normalizedType.includes("standard")) return "silver";

  return null;
};

const buildSectionInfoFromTickets = (
  tickets: Ticket[],
): Record<SectionId, SectionMeta> => {
  const sectionInfo = { ...SECTION_INFO };
  const usedSections = new Set<SectionId>();
  const sortedTickets = [...tickets].sort((a, b) => b.price - a.price);

  sortedTickets.forEach((ticket) => {
    const mappedByType = getSectionIdFromType(ticket.type);

    const targetSection =
      mappedByType && !usedSections.has(mappedByType)
        ? mappedByType
        : ZONE_ORDER.find((sectionId) => !usedSections.has(sectionId));

    if (!targetSection) {
      return;
    }

    usedSections.add(targetSection);
    sectionInfo[targetSection] = {
      label: ticket.type,
      price: `$${ticket.price}`,
      desc: `${ticket.available} tickets · seated together`,
      ticketId: ticket.id,
    };
  });

  return sectionInfo;
};

const SEP_COLOR = "#18181b";

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

function InfoBar({
  selected,
  sectionInfo,
}: {
  selected: SelectedSection;
  sectionInfo: Record<SectionId, SectionMeta>;
}) {
  if (!selected) {
    return <p className="min-h-6" aria-hidden="true" />;
  }

  const { label, price, desc } = sectionInfo[selected];

  if (selected === "stage") {
    return (
      <div className="min-h-6 text-center text-sm">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-muted-foreground">{desc}</p>
      </div>
    );
  }

  return (
    <p className="min-h-6 text-center text-sm">
      <span className="font-semibold text-foreground">{label}</span>
      <span className="mx-2 font-semibold text-brand-main">{price}</span>
      <span className="text-muted-foreground">{desc}</span>
    </p>
  );
}

function BuyButton({
  selected,
  sectionInfo,
}: {
  selected: SelectedSection;
  sectionInfo: Record<SectionId, SectionMeta>;
}) {
  if (!selected || selected === "stage") {
    return null;
  }

  const { label, price } = sectionInfo[selected];

  return (
    <button
      type="button"
      className="mt-4 rounded-2xl bg-brand-main px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-main/30 transition-all duration-200 hover:bg-brand-main/90"
    >
      Buy {label} Tickets · {price} / person
    </button>
  );
}

export default function VenueMap({
  eventTitle,
  tickets = [],
  onBuyTicket,
}: {
  eventTitle: string;
  tickets?: Ticket[];
  onBuyTicket?: (ticket: Ticket) => void;
}) {
  const [hovered, setHovered] = useState<SelectedSection>(null);
  const [selected, setSelected] = useState<SelectedSection>(null);

  const sectionInfo = useMemo(
    () => buildSectionInfoFromTickets(tickets),
    [tickets],
  );

  const compactLabel = useCallback(
    (id: Exclude<SectionId, "stage">) => {
      const baseLabel = sectionInfo[id].label.replace(/^Section\s+/i, "");
      return baseLabel.length > 10 ? baseLabel.slice(0, 10) : baseLabel;
    },
    [sectionInfo],
  );

  const selectedTicket = useMemo(() => {
    if (!selected || selected === "stage") {
      return null;
    }

    const ticketId = sectionInfo[selected].ticketId;
    return tickets.find((ticket) => ticket.id === ticketId) ?? null;
  }, [sectionInfo, selected, tickets]);

  const ringLabels = RINGS.map(({ id, r1, r2, label }) => {
    const midR = (r1 + r2) / 2;
    const [lx, ly] = polarXY(CX, CY, midR, 90);
    return { id, lx, ly, label: compactLabel(id), fallbackLabel: label };
  });

  const [stx, sty] = polarXY(CX, CY, 158, -90);

  const toggleLegend = useCallback((id: SectionId) => {
    setSelected((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-black tracking-tight text-foreground">
          Select Your Section
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{eventTitle}</p>
      </div>

      <div className="mx-auto w-full max-w-120">
        <svg
          viewBox="0 0 500 520"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Interactive venue seating map"
        >
          <circle
            cx={CX}
            cy={CY}
            r={228}
            fill="#f4f4f5"
            className="dark:fill-[#090909]"
          />
          <circle
            cx={CX}
            cy={CY}
            r={220}
            fill="#e4e4e7"
            className="dark:fill-[#0f0f0f]"
          />

          {[214, 208, 200].map((r) => (
            <circle
              key={r}
              cx={CX}
              cy={CY}
              r={r}
              fill="none"
              stroke="#a1a1aa"
              className="dark:stroke-[#0a0a0a]"
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
            fill="currentColor"
            className="text-zinc-950 dark:text-zinc-900"
            style={{
              pointerEvents: "none",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            STAGE
          </text>

          <Section
            id="diamond"
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
              stroke="#a1a1aa"
              className="dark:stroke-[#1c1c1c] font-bold"
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
            fill="currentColor"
            className="text-zinc-200 dark:text-zinc-200 font-bold"
            style={{
              pointerEvents: "none",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            DIAMOND
          </text>

          {ringLabels.map(({ id, lx, ly, label, fallbackLabel }) => (
            <text
              key={id}
              x={f(lx)}
              y={f(ly)}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={13}
              fontWeight={500}
              fill="currentColor"
              className={
                selected === id
                  ? "text-zinc-200 dark:text-zinc-100 font-bold"
                  : "text-zinc-300 dark:text-zinc-300 font-bold1"
              }
              style={{
                pointerEvents: "none",
                fontFamily: "system-ui, sans-serif",
                transition: "fill 0.15s",
              }}
            >
              {label || fallbackLabel}
            </text>
          ))}
        </svg>
      </div>

      <div className="mx-auto mt-4 w-full max-w-120">
        <InfoBar selected={selected} sectionInfo={sectionInfo} />
        <div className="flex justify-center">
        {selected && selected !== "stage" && selectedTicket ? (
          <button
            type="button"
            onClick={() => onBuyTicket?.(selectedTicket)}
            className="mt-4 rounded-2xl bg-brand-main px-8 py-3 text-sm font-bold text-white shadow-lg shadow-brand-main/30 transition-all duration-200 hover:bg-brand-main/90"
          >
            Buy {selectedTicket.type} Tickets · ${selectedTicket.price} / person
          </button>
        ) : (
          <BuyButton selected={selected} sectionInfo={sectionInfo} />
        )}
      </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
        {[
          {
            id: "diamond" as const,
            label: sectionInfo.diamond.label,
            color: "#4c1d95",
          },
          { id: "platinum" as const, label: sectionInfo.platinum.label, color: "#3b1a7a" },
          { id: "gold" as const, label: sectionInfo.gold.label, color: "#341870" },
          { id: "silver" as const, label: sectionInfo.silver.label, color: "#2d1466" },
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
                  ? "text-brand-main"
                  : "text-muted-foreground group-hover:text-foreground"
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
