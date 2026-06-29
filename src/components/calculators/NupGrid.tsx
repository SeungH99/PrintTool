/** A cols×rows schematic grid scaled to the sheet aspect, shared by the n-up
 * calculator and the imposition tool. Cell count is capped so a high-yield
 * layout can't blow up the DOM; the true per-sheet count is shown numerically. */
export function NupGrid({ cols, rows, aspect }: { cols: number; rows: number; aspect: number }) {
  if (cols < 1 || rows < 1) return null;
  const maxW = 248;
  const maxH = 168;
  let w = maxW;
  let h = maxW / aspect;
  if (h > maxH) {
    h = maxH;
    w = maxH * aspect;
  }
  const capCols = Math.min(cols, 20);
  const capRows = Math.min(rows, 14);
  return (
    <div className="flex h-[176px] w-full items-center justify-center">
      <div
        className="grid gap-[2px] rounded-[2px] border border-hairline bg-canvas p-[3px]"
        style={{
          width: `${w}px`,
          height: `${h}px`,
          gridTemplateColumns: `repeat(${capCols}, 1fr)`,
          gridTemplateRows: `repeat(${capRows}, 1fr)`,
        }}
        aria-hidden="true"
      >
        {Array.from({ length: capCols * capRows }).map((_, i) => (
          <div key={i} className="rounded-[1px] border border-hairline bg-elevated" />
        ))}
      </div>
    </div>
  );
}
