type DonutChartSegment = {
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  title?: string;
  segments: DonutChartSegment[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  totalLabel?: string;
};

export default function DonutChart({
  title,
  segments,
  size = 140,
  strokeWidth = 16,
  className = "",
  totalLabel = "Total",
}: DonutChartProps) {
  const safeSegments = segments.map((segment) => ({
    ...segment,
    value: Math.max(0, segment.value),
  }));

  const total = safeSegments.reduce((sum, segment) => sum + segment.value, 0);
  const radius = (120 - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeLength = 0;

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`.trim()}>
      {title && <h3 className="mb-4">{title}</h3>}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          role="img"
          aria-label={title ?? "Donut chart"}
        >
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {safeSegments.reverse().map((segment) => {
            const strokeLength =
              total > 0 ? (segment.value / total) * circumference : 0;
            const strokeDashoffset = -cumulativeLength;
            cumulativeLength += strokeLength;

            return (
              <circle
                key={segment.label}
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${strokeLength} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            );
          })}
          <text
            x="60"
            y="56"
            textAnchor="middle"
            className="fill-gray-800 text-sm font-semibold"
          >
            {total}
          </text>
          <text
            x="60"
            y="72"
            textAnchor="middle"
            className="fill-gray-500 text-[10px]"
          >
            {totalLabel}
          </text>
        </svg>

        <div className="flex flex-col gap-2 text-sm">
          {safeSegments.reverse().map((segment) => {
            const percentage =
              total > 0 ? Math.round((segment.value / total) * 100) : 0;
            return (
              <div key={segment.label} className="flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span>
                  {segment.label}: {segment.value} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
