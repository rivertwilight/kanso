"use client";

import { useMemo } from "react";
import { sortByDate } from "@/utils/sortPosts";
import Link from "next/link";
import { useTranslations } from "next-intl";
import AppToolbar from "@/system/components/AppToolbar";

const groupByYear = (posts: any[]) => {
  return posts.reduce((acc, post) => {
    const year = new Date(post.frontmatter.createAt).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, any[]>);
};

interface CatalogAppProps {
  allPosts: any[];
  flattedPosts: any[];
  locale: string;
}

export default function CatalogApp({
  allPosts,
  flattedPosts,
  locale,
}: CatalogAppProps) {
  const t = useTranslations("archivePage");

  const sortedPosts = useMemo(() => sortByDate(flattedPosts), [flattedPosts]);
  const postsByYear = useMemo(() => groupByYear(sortedPosts), [sortedPosts]);
  const sortedYears = useMemo(
    () => Object.keys(postsByYear).sort((a, b) => Number(b) - Number(a)),
    [postsByYear]
  );

  const locales = [
    { localeString: "简体中文", routeName: "zh" },
    { localeString: "English", routeName: "en" },
  ];

  const localeLinks = locales
    .map((l) => {
      if (l.routeName === locale) {
        return <span key={l.routeName}>{l.localeString}</span>;
      }
      return (
        <Link href={`/${l.routeName}/archive`} key={l.routeName}>
          {l.localeString}
        </Link>
      );
    })
    .reduce(
      (prev, curr, idx) => (idx === 0 ? [curr] : [...prev, " | ", curr]),
      [] as React.ReactNode[]
    );

  return (
    <>
      <AppToolbar
        type="standard"
        title="Archive"
        onMenuClick={() => console.log("Menu clicked")}
      />
      <div className="px-4 md:px-6 pb-8">
        <div className="font-serif text-(--eink-ink)">
          <h1 className="text-3xl font-bold mb-4 mt-6 font-sans tracking-tight">{t("title")}</h1>
        {sortedYears.map((year) => (
          <div key={year}>
            <h2 className="text-2xl font-bold mb-3 mt-5 font-sans tracking-tight border-b border-(--eink-divider) pb-2">{year}</h2>
            <ul className="list-disc pl-6 mb-4 space-y-1">
              {postsByYear[year].map((post: any) => (
                <li key={post.id}>
                  <Link href={"/essay/" + post.id} className="underline underline-offset-2 decoration-(--eink-ink-tertiary) hover:decoration-(--eink-ink)">
                    {post.frontmatter.title || post.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        </div>
      </div>
    </>
  );
}
