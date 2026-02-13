"use client";

import { useEffect, useRef, ReactNode, useMemo } from "react";
import { useAtom } from "jotai";
import { readerSettingsAtom } from "@/system/atoms/readerSettings";
import AppToolbar from "@/system/components/AppToolbar";
import BookDetailHeader from "./components/BookDetailHeader";
import "katex/dist/katex.min.css";

// Font family mapping
const fontFamilyMap: Record<string, string> = {
  bookerly: "'Bookerly', 'Noto Serif SC', Georgia, serif",
  "amazon-ember": "'Amazon Ember', 'Noto Sans SC', sans-serif",
  "noto-serif": "'Noto Serif SC', Georgia, serif",
  system: "system-ui, -apple-system, sans-serif",
};

interface BookReviewAppProps {
  id: string;
  bookProps: any;
  reviewContent: ReactNode;
  locale: string;
}

export default function BookReviewApp({
  id,
  bookProps,
  reviewContent,
  locale,
}: BookReviewAppProps) {
  const topRef = useRef<HTMLDivElement>(null);
  const [settings] = useAtom(readerSettingsAtom);

  // Reset scroll position when navigating to review
  useEffect(() => {
    // Find the scrollable parent container (KindleBezel content area)
    const findScrollableParent = (
      element: HTMLElement | null
    ): HTMLElement | null => {
      if (!element) return null;
      const parent = element.parentElement;
      if (!parent) return null;

      const style = window.getComputedStyle(parent);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        return parent;
      }
      return findScrollableParent(parent);
    };

    if (topRef.current) {
      const scrollableParent = findScrollableParent(topRef.current);
      if (scrollableParent) {
        scrollableParent.scrollTop = 0;
      }
    }
    // Also reset window scroll for mobile view
    window.scrollTo(0, 0);
  }, [id]);

  // Compute reader styles based on settings
  const readerStyles = useMemo(() => ({
    fontSize: `${settings.fontSize}px`,
    fontFamily: fontFamilyMap[settings.fontFamily] || fontFamilyMap.bookerly,
    lineHeight: settings.lineHeight,
    paddingLeft: `${settings.marginHorizontal}px`,
    paddingRight: `${settings.marginHorizontal}px`,
  }), [settings]);

  if (!bookProps) return null;

  return (
    <>
      <AppToolbar
        type="reader"
        title={bookProps?.title || ""}
        onMenuClick={() => console.log("Menu clicked")}
      />
      <div ref={topRef}>
        <div className="overflow-hidden p-0">
          <div style={{ paddingLeft: readerStyles.paddingLeft, paddingRight: readerStyles.paddingRight }}>
            <div className="font-serif text-(--eink-ink)" itemScope itemType="http://schema.org/Review">
              <BookDetailHeader
                title={bookProps.title}
                cover={bookProps.cover}
                metadata={bookProps.metadata}
                createAt={bookProps.createAt}
                locale={locale}
              />

              <section
                itemProp="reviewBody"
                style={{
                  fontSize: readerStyles.fontSize,
                  fontFamily: readerStyles.fontFamily,
                  lineHeight: readerStyles.lineHeight,
                }}
              >
                {reviewContent}
              </section>
            </div>

            {/* <GiscusComments locale={locale} /> */}
          </div>
        </div>
      </div>
    </>
  );
}
