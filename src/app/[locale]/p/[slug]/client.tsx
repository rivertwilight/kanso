"use client";

import React, { useEffect, useRef, ReactNode } from "react";
import ImageBlock from "@/components/ImageBlock";
import { Typography } from "@/components/ui";
import "katex/dist/katex.min.css";
import Giscus from "@giscus/react";

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

const ArticlePage = ({
  id,
  postProps,
  postContent,
  locale,
}: {
  id: string;
  postProps: any;
  postContent: ReactNode;
  locale: string;
}) => {
  const topRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when navigating to article
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

  if (!postProps) return null;

  return (
    <div ref={topRef}>
      <div className="overflow-hidden p-0 lg:px-3">
        <div className="mt-1.5 -mx-2.5 [&_img]:object-cover [&_img]:w-full [&_img]:max-h-[40vh]">
          {typeof postProps.cover == "string" && (
            <>
              <ImageBlock alt="Cover" src={postProps.cover} />
              <meta itemProp="thumbnailUrl" content={postProps.cover} />
            </>
          )}
        </div>
        <Typography itemScope itemType="http://schema.org/Article">
          <h1 itemProp="headline">{postProps.title}</h1>
          <div className="text-[var(--eink-ink-muted)] text-sm mb-4">
            <time itemProp="datePublished" dateTime={postProps.date}>
              {formatDate(postProps.date, locale)}
            </time>
          </div>

          <section itemProp="articleBody" className="font-['Bookerly','Noto_Serif_SC']">{postContent}</section>
        </Typography>
      </div>
      {/* {giscusConfig.enabled && (
        <div className="px-3">
          <Giscus
            repo={giscusConfig.config.repo}
            repoId={giscusConfig.config.repoId}
            category={giscusConfig.config.category}
            categoryId={giscusConfig.config.categoryId}
            mapping="pathname"
            strict="0"
            reactions-enabled="1"
            emit-metadata="0"
            input-position="bottom"
            // theme={
            // 	colorScheme === "dark"
            // 		? "noborder_dark"
            // 		: "noborder_light"
            // }
            lang={giscusConfig.config.lang}
            loading="lazy"
          ></Giscus>
        </div>
      )} */}
    </div>
  );
};

export default ArticlePage;
