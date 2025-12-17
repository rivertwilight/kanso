import React from "react";
import { getPostBySlug, getAllPostSlugs } from "@/utils/getAllPosts";
import { paths, giscus as giscusConfig } from "../../../../site.config";
import { setRequestLocale } from "next-intl/server";
import { routing } from "../../../../i18n/routing";
import ArticleClient from "./client";

interface IPostProps {
  title: string;
  date: string;
  author: string;
  cover?: string;
}

interface ICurrentPage {
  title: string;
  path: string;
  description: string;
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();

  return slugs.map(({ slug, locale }) => ({
    locale: locale,
    slug: slug,
  }));
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const post = getPostBySlug(slug, locale);

  if (!post) {
    return <div>Post not found</div>;
  }

  const { frontmatter, content } = post;

  const currentPage = {
    title: frontmatter.title || slug,
    path: "/" + paths.blog + slug,
    description: frontmatter.summary || content.slice(0, 100),
    image: frontmatter.cover || "",
    keywords: frontmatter.keywords || [],
  };

  return (
    <ArticleClient
      postContent={content}
      postProps={frontmatter}
      currentPage={currentPage}
      id={slug}
      locale={locale}
    />
  );
}
