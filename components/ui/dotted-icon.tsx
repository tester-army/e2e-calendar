// The e2e dotted icons this app uses, vendored from the design system's dot grids.
const ICONS = {
  "chevron-down": [".......", ".......", "X.....X", ".X...X.", "..X.X..", "...X...", "......."],
  "chevron-up": [".......", "...X...", "..X.X..", ".X...X.", "X.....X", ".......", "......."],
  "chevron-right": ["..X....", "...X...", "....X..", ".....X.", "....X..", "...X...", "..X...."],
  "chevron-left": ["....X..", "...X...", "..X....", ".X.....", "..X....", "...X...", "....X.."],
  check: [".......", "......X", ".....X.", "X...X..", ".X.X...", "..X....", "......."],
} as const;

export type DottedIconName = keyof typeof ICONS;

/** One path of 2x2 squares on a 3px pitch, so a grid of n dots is 3n - 1 px wide. */
function dottedIconPath(rows: readonly string[]) {
  return rows
    .flatMap((row, y) => [...row].map((cell, x) => (cell === "X" ? `M${x * 3} ${y * 3}h2v2h-2z` : "")))
    .join("");
}

/** Draws in `currentColor` at its native size; never resize it with CSS. */
export function DottedIcon({ name, className }: { name: DottedIconName; className?: string }) {
  const rows = ICONS[name];
  const size = rows.length * 3 - 1;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden
      className={className ? `shrink-0 ${className}` : "shrink-0"}
    >
      <path d={dottedIconPath(rows)} />
    </svg>
  );
}
