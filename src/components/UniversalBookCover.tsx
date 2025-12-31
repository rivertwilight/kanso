"use client";

interface UniversalBookCoverProps {
  title: string;
  author?: string;
  size?: "small" | "large";
}

export default function UniversalBookCover({
  title,
  author,
  size = "small",
}: UniversalBookCoverProps) {
  const fontSize = size === "large" ? "text-lg" : "text-sm";
  const authorSize = size === "large" ? "text-sm" : "text-xs";
  const padding = size === "large" ? "p-6" : "p-4";

  return (
    <div
      className={`absolute inset-0 flex flex-col justify-between ${padding}`}
      style={{
        background: "linear-gradient(135deg, var(--eink-paper-secondary) 0%, var(--eink-paper) 100%)",
      }}
    >
      {/* Top decorative border */}
      <div
        className="w-full border-t-2 border-b"
        style={{
          borderColor: "var(--eink-ink-muted)",
          height: "1px",
        }}
      />

      {/* Title */}
      <div className="flex-1 flex items-center justify-center">
        <h3
          className={`text-center font-serif ${fontSize} font-semibold leading-relaxed line-clamp-6`}
          style={{ color: "var(--eink-ink)" }}
        >
          {title}
        </h3>
      </div>

      {/* Author and bottom decoration */}
      <div className="space-y-2">
        {author && (
          <p
            className={`text-center font-sans ${authorSize} italic`}
            style={{ color: "var(--eink-ink-secondary)" }}
          >
            {author}
          </p>
        )}
        <div
          className="w-full border-t-2 border-b"
          style={{
            borderColor: "var(--eink-ink-muted)",
            height: "1px",
          }}
        />
      </div>
    </div>
  );
}
