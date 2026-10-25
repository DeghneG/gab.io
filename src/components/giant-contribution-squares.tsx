/**
 * 70s Retro Giant Contribution Squares Decoration
 * ──────────────────────────────────────────────
 * Appears in the outer margins of the GitHub Contributions section.
 * Laid out loosely on an invisible 136px grid (zoomed-in contribution graph).
 * All flat and static, aria-hidden, pointer-events-none.
 * Active strictly at 1024px and above (hidden below).
 * 
 * TWEAKABLE CONSTANTS:
 * - OUTLINE_OPACITY: Default 0.08 (drop to 0.06 if you want it quieter).
 * - FILL_OPACITY: Default 0.14 (set to 0 to remove all filled squares).
 * - BORDER_WIDTH: Default 3 (3px wine outline).
 * - SQUARES: The 11 squares array with sizes (56, 80, 112), grid positions, and colors.
 */

export const SQUARES_CONFIG = {
  outlineOpacity: 0.08, // 8% opacity for wine outlines (can tweak to 0.06)
  fillOpacity: 0.14,    // 14% opacity for filled accents (set to 0 to hide)
  borderWidth: 3,       // 3px retro outline
  wineColor: "#8C0027",
  mustardColor: "#F1A512",
  orangeColor: "#DD4111",
  tealColor: "#2BAF90",
};

interface SquareDef {
  id: string;
  side: "left" | "right";
  size: number;
  top: number;              // vertical distance in px from section top
  offsetFromCenter: number; // outer edge distance from screen center
  fillColor?: string;       // defined for filled squares; undefined for outline
}

// Squares clustered alongside the card (max bottom: 270px so none are ever clipped by section boundary)
export const SQUARES: SquareDef[] = [
  // ── LEFT MARGIN CLUSTER ─────────────────────────────
  {
    id: "l1",
    side: "left",
    size: 96,
    top: 24,
    offsetFromCenter: 736,
  },
  {
    id: "l2",
    side: "left",
    size: 72,
    top: 36,
    offsetFromCenter: 856,
    fillColor: SQUARES_CONFIG.mustardColor, // Filled Mustard
  },
  {
    id: "l3",
    side: "left",
    size: 56,
    top: 136,
    offsetFromCenter: 708,
  },
  {
    id: "l4",
    side: "left",
    size: 96,
    top: 124,
    offsetFromCenter: 980,
  },
  {
    id: "l5",
    side: "left",
    size: 64,
    top: 198,
    offsetFromCenter: 836,
    fillColor: SQUARES_CONFIG.tealColor, // Filled Teal
  },

  // ── RIGHT MARGIN CLUSTER ────────────────────────────
  {
    id: "r1",
    side: "right",
    size: 72,
    top: 24,
    offsetFromCenter: 720,
  },
  {
    id: "r2",
    side: "right",
    size: 96,
    top: 96,
    offsetFromCenter: 872,
    fillColor: SQUARES_CONFIG.mustardColor, // Filled Mustard
  },
  {
    id: "r3",
    side: "right",
    size: 56,
    top: 168,
    offsetFromCenter: 708,
    fillColor: SQUARES_CONFIG.orangeColor, // Filled Orange
  },
  {
    id: "r4",
    side: "right",
    size: 72,
    top: 184,
    offsetFromCenter: 960,
  },
];

export default function GiantContributionSquares() {
  const { outlineOpacity, fillOpacity, borderWidth, wineColor } = SQUARES_CONFIG;

  return (
    <div
      className="hidden lg:block absolute inset-0 pointer-events-none select-none z-0 overflow-x-clip"
      aria-hidden="true"
    >
      {SQUARES.map((sq) => {
        const isFilled = Boolean(sq.fillColor);
        return (
          <div
            key={sq.id}
            className="absolute rounded-[14px]"
            style={{
              width: sq.size,
              height: sq.size,
              top: sq.top,
              left: sq.side === "left" ? `calc(50% - ${sq.offsetFromCenter}px)` : undefined,
              right: sq.side === "right" ? `calc(50% - ${sq.offsetFromCenter}px)` : undefined,
              backgroundColor: isFilled ? sq.fillColor : "transparent",
              opacity: isFilled ? fillOpacity : outlineOpacity,
              border: isFilled ? "none" : `${borderWidth}px solid ${wineColor}`,
            }}
          />
        );
      })}
    </div>
  );
}
