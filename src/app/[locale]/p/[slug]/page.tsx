import { Metadata } from "next";
import { getPostBySlug, getAllPostSlugs } from "@/utils/getAllPosts";
import { setRequestLocale } from "next-intl/server";
import ArticleClient from "./client";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Helper to extract SEO fields from the seo array format
function extractSeoField(seo: any[] | undefined, field: string): any {
  if (!seo || !Array.isArray(seo)) return undefined;
  const item = seo.find((obj) => obj && typeof obj === "object" && field in obj);
  return item?.[field];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug, locale);

  if (!post) {
    return {
      title: "Post not found",
    };
  }

  const { frontmatter, content } = post;
  const seo = frontmatter.seo;

  // Extract SEO fields if available, otherwise use fallbacks
  const title = extractSeoField(seo, "title") || frontmatter.title || slug;
  const description = extractSeoField(seo, "description") || frontmatter.summary || content.slice(0, 160);
  const keywords = extractSeoField(seo, "keywords") || frontmatter.keywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      images: frontmatter.cover ? [frontmatter.cover] : undefined,
    },
  };
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

  return (
    <ArticleClient
      postContent={content}
      postProps={frontmatter}
      id={slug}
      locale={locale}
    />
  );
}
