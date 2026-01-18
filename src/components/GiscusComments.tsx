"use client";

import Giscus from "@giscus/react";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { colorSchemeAtom } from "@/system/atoms/colorScheme";

interface GiscusCommentsProps {
  locale: string;
}

export default function GiscusComments({ locale }: GiscusCommentsProps) {
  const colorScheme = useAtomValue(colorSchemeAtom);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Use custom e-ink theme CSS files
  const theme = origin
    ? `${origin}/giscus-eink${colorScheme === "dark" ? "-dark" : ""}.css`
    : colorScheme === "dark"
      ? "transparent_dark"
      : "light";

  return (
    <div className="mt-8 py-8">
      <Giscus
        repo="ygeeker/kanso"
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""}
        category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General"}
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || ""}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang={locale === "zh" ? "zh-CN" : "en"}
        loading="lazy"
      />
    </div>
  );
}
