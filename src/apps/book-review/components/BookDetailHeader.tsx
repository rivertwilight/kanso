"use client";

import { useState } from "react";
import Image from "next/image";
import UniversalBookCover from "@/components/UniversalBookCover";

interface BookMetadata {
  author?: string;
  publisher?: string;
  year?: number;
  pages?: number;
  language?: string;
}

interface BookDetailHeaderProps {
  title: string;
  cover?: string;
  metadata?: BookMetadata;
  createAt?: string;
  locale: string;
}

function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);

  if (locale === "zh") {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year} 年 ${month} 月 ${day} 日`;
  } else {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en", options);
  }
}

export default function BookDetailHeader({
  title,
  cover,
  metadata,
  createAt,
  locale,
}: BookDetailHeaderProps) {
  const [imageError, setImageError] = useState(false);
  const showPlaceholder = !cover || imageError;

  return (
    <div className="border-b pb-6 mb-6" style={{ borderColor: "var(--eink-ink-muted)" }}>
      <div className="flex gap-6">
        {/* Book Cover */}
        <div className="flex-shrink-0">
          <div
            className="relative border"
            style={{
              width: "160px",
              aspectRatio: "2/3",
              borderColor: "var(--eink-ink-muted)",
              backgroundColor: "var(--eink-paper-secondary)",
            }}
          >
            {cover && !imageError && (
              <Image
                src={cover}
                alt={title}
                fill
                className="object-cover"
                sizes="160px"
                onError={() => setImageError(true)}
              />
            )}
            {showPlaceholder && (
              <UniversalBookCover
                title={title}
                author={metadata?.author}
                size="large"
              />
            )}
          </div>
        </div>

        {/* Book Details */}
        <div className="flex-1 min-w-0">
          <h1
            className="text-2xl font-serif mb-4"
            style={{ color: "var(--eink-ink)" }}
          >
            {title}
          </h1>

          {metadata && (
            <div className="space-y-2 text-sm mb-4">
              {metadata.author && (
                <div className="flex">
                  <span
                    className="w-24 flex-shrink-0 font-sans"
                    style={{ color: "var(--eink-ink-secondary)" }}
                  >
                    Author
                  </span>
                  <span
                    className="font-sans"
                    style={{ color: "var(--eink-ink)" }}
                  >
                    {metadata.author}
                  </span>
                </div>
              )}
              {metadata.publisher && (
                <div className="flex">
                  <span
                    className="w-24 flex-shrink-0 font-sans"
                    style={{ color: "var(--eink-ink-secondary)" }}
                  >
                    Publisher
                  </span>
                  <span
                    className="font-sans"
                    style={{ color: "var(--eink-ink)" }}
                  >
                    {metadata.publisher}
                  </span>
                </div>
              )}
              {metadata.year && (
                <div className="flex">
                  <span
                    className="w-24 flex-shrink-0 font-sans"
                    style={{ color: "var(--eink-ink-secondary)" }}
                  >
                    Year
                  </span>
                  <span
                    className="font-sans"
                    style={{ color: "var(--eink-ink)" }}
                  >
                    {metadata.year}
                  </span>
                </div>
              )}
              {metadata.pages && (
                <div className="flex">
                  <span
                    className="w-24 flex-shrink-0 font-sans"
                    style={{ color: "var(--eink-ink-secondary)" }}
                  >
                    Pages
                  </span>
                  <span
                    className="font-sans"
                    style={{ color: "var(--eink-ink)" }}
                  >
                    {metadata.pages}
                  </span>
                </div>
              )}
              {metadata.language && (
                <div className="flex">
                  <span
                    className="w-24 flex-shrink-0 font-sans"
                    style={{ color: "var(--eink-ink-secondary)" }}
                  >
                    Language
                  </span>
                  <span
                    className="font-sans"
                    style={{ color: "var(--eink-ink)" }}
                  >
                    {metadata.language}
                  </span>
                </div>
              )}
            </div>
          )}

          {createAt && (
            <div
              className="text-sm font-sans"
              style={{ color: "var(--eink-ink-muted)" }}
            >
              Reviewed on {formatDate(createAt, locale)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
