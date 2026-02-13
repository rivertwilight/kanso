import { Metadata } from "next";
import { getPostBySlug, getAllPostSlugs } from "@/utils/getAllPosts";
import { setRequestLocale, getTranslations } from "next-intl/server";
import BookReaderApp from "@/apps/book-reader";
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
	const post = getPostBySlug(slug);

	if (!post) {
		return {
			title: "Post not found",
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

	const ogImage = frontmatter.cover
		? frontmatter.cover.startsWith("http")
			? frontmatter.cover
			: `${SITE_ROOT}${frontmatter.cover}`
		: undefined;

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
			...(ogImage && {
				images: [{ url: ogImage }],
			}),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			creator: "@" + AUTHOR_NAME,
			...(ogImage && {
				images: [ogImage],
			}),
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

	const post = getPostBySlug(slug);

	if (!post) {
		return <div>Post not found</div>;
	}

	const { frontmatter, content } = post;
	const seo = frontmatter.seo;

	// Extract SEO fields for JSON-LD
	const title = extractSeoField(seo, "title") || frontmatter.title || slug;
	const description =
		extractSeoField(seo, "description") ||
		frontmatter.summary ||
		content.slice(0, 160);

	// Build JSON-LD structured data for SEO
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: title,
		description: description,
		datePublished: frontmatter.createAt
			? new Date(frontmatter.createAt).toISOString()
			: undefined,
		dateModified: frontmatter.updatedAt
			? new Date(frontmatter.updatedAt).toISOString()
			: frontmatter.createAt
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
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": `${SITE_ROOT}/${locale}/essay/${slug}`,
		},
		...(frontmatter.cover && {
			image: {
				"@type": "ImageObject",
				url: frontmatter.cover.startsWith("http")
					? frontmatter.cover
					: `${SITE_ROOT}${frontmatter.cover}`,
			},
		}),
		...(frontmatter.keywords && {
			keywords: Array.isArray(frontmatter.keywords)
				? frontmatter.keywords.join(", ")
				: frontmatter.keywords,
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
			<BookReaderApp
				postContent={mdxContent}
				postProps={frontmatter}
				id={slug}
				locale={locale}
			/>
		</>
	);
}
