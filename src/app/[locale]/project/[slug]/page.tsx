import { Metadata } from "next";
import { getProjectBySlug, getAllProjectSlugs } from "@/utils/getAllPosts";
import { setRequestLocale, getTranslations } from "next-intl/server";

import BookReviewApp from "@/apps/book-review";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "@/components/mdxComponents";

const SITE_ROOT = "https://rene.wang";
const AUTHOR_NAME = "Rene Wang";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Helper to extract SEO fields from the seo object
function extractSeoField(seo: any, field: string): any {
  if (!seo || typeof seo !== "object") return undefined;
  return seo[field];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getProjectBySlug(slug);

  if (!post) {
    return {
      title: "Project not found",
    };
  }

  const { frontmatter, content } = post;
  const seo = frontmatter.seo;

  // Extract SEO fields if available, otherwise use fallbacks
  const title = extractSeoField(seo, "title") || frontmatter.title || slug;
  const description =
    extractSeoField(seo, "description") ||
    frontmatter.summary ||
    content.slice(0, 160);
  const keywords = extractSeoField(seo, "keywords") || frontmatter.keywords;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: frontmatter.createAt
        ? new Date(frontmatter.createAt).toISOString()
        : undefined,
      authors: [AUTHOR_NAME],
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@" + AUTHOR_NAME,
    },
  };
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();

  const locales = ["en", "zh"];
  return slugs.flatMap((slug) =>
    locales.map((locale) => ({ locale, slug }))
  );
}

export default async function BookReviewPage({ params }: PageProps) {
  const { locale, slug } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const post = getProjectBySlug(slug);

  if (!post) {
    return <div>Project not found</div>;
  }

  const { frontmatter, content } = post;

  const seo = frontmatter.seo;

  // Extract SEO fields for JSON-LD
  const title = extractSeoField(seo, "title") || frontmatter.title || slug;
  const description =
    extractSeoField(seo, "description") ||
    frontmatter.summary ||
    content.slice(0, 160);

  // Build JSON-LD structured data for SEO (Review schema)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Book",
      name: frontmatter.title,
    },
    reviewBody: description,
    datePublished: frontmatter.createAt
      ? new Date(frontmatter.createAt).toISOString()
      : undefined,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_ROOT,
    },
    publisher: {
      "@type": "Organization",
      name: AUTHOR_NAME,
      url: SITE_ROOT,
    },
    ...(frontmatter.cover && {
      image: {
        "@type": "ImageObject",
        url: frontmatter.cover.startsWith("http")
          ? frontmatter.cover
          : `${SITE_ROOT}${frontmatter.cover}`,
      },
    }),
    inLanguage: locale,
  };

  // Compile MDX content with plugins and custom components
  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkMath, remarkGfm],
        rehypePlugins: [rehypeKatex],
      },
    },
    components: mdxComponents,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BookReviewApp
        reviewContent={mdxContent}
        bookProps={frontmatter}
        id={slug}
        locale={locale}
      />
    </>
  );
}
