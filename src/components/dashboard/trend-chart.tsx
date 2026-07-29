import type { MonthlyTrendPoint } from "@/app/actions/reports";

/**
 * Grafik batang tren dokumen 6 bulan terakhir (SVG murni, tanpa dependensi &
 * tanpa JS klien). Tinggi batang proporsional terhadap nilai maksimum.
 */
export function TrendChart({ points }: { points: MonthlyTrendPoint[] }) {
  const max = Math.max(1, ...points.map((p) => p.count));
  const W = 520;
  const H = 160;
  const padBottom = 26;
  const padTop = 16;
  const gap = 16;
  const barW = (W - gap * (points.length + 1)) / points.length;
  const chartH = H - padBottom - padTop;

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-44 w-full min-w-[420px]"
        role="img"
        aria-label="Tren jumlah dokumen 6 bulan terakhir"
      >
        {points.map((p, i) => {
          const h = max > 0 ? (p.count / max) * chartH : 0;
          const x = gap + i * (barW + gap);
          const y = padTop + (chartH - h);
          return (
            <g key={p.ym}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(h, 1)}
                rx={4}
                className="fill-primary"
              />
              <text
                x={x + barW / 2}
                y={y - 5}
                textAnchor="middle"
                className="fill-foreground text-[11px] font-semibold"
              >
                {p.count}
              </text>
              <text
                x={x + barW / 2}
                y={H - 8}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
