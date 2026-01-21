import { NextResponse } from "next/server";
import getAllPosts from "@/utils/getAllPosts";

function escapeXml(text: string): string {
	if (!text) return "";
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

async function getDictionary(locale: string) {
	try {
		return (await import(`../../i18n/resources/${locale}.json`)).default;
	} catch {
		return (await import(`../../i18n/resources/zh.json`)).default;
	}
}

async function generateAtomXml(locale: string): Promise<string> {
	const baseUrl = "https://rene.wang";
	const dictionary = await getDictionary(locale);
	const { title, description, author } = dictionary.metadata;
	const now = new Date().toISOString();

	const posts = getAllPosts({
		locale,
		enableSort: true,
		enableContent: true,
	});

	const entries = posts
		.slice(0, 50)
		.map((post) => {
			const postTitle = escapeXml(
				post.frontmatter.title || post.defaultTitle
			);
			const postUrl = `${baseUrl}/p/${post.id}`;
			const updated = post.frontmatter.createAt
				? new Date(post.frontmatter.createAt).toISOString()
				: now;
			const summary = escapeXml(
				post.frontmatter.summary ||
					post.markdownBody?.slice(0, 200) ||
					""
			);
			const category = post.category || "";

			return `
  <entry>
    <title>${postTitle}</title>
    <link href="${postUrl}" rel="alternate" type="text/html"/>
    <id>${postUrl}</id>
    <updated>${updated}</updated>
    <summary>${summary}</summary>
    ${category ? `<category term="${escapeXml(category)}"/>` : ""}
    <author>
      <name>${escapeXml(author.name)}</name>
      <email>${escapeXml(author.email)}</email>
    </author>
  </entry>`;
		})
		.join("");

	return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(title)}</title>
  <subtitle>${escapeXml(description)}</subtitle>
  <link href="${baseUrl}" rel="alternate" type="text/html"/>
  <link href="${baseUrl}/feed.xml" rel="self" type="application/atom+xml"/>
  <id>${baseUrl}/</id>
  <updated>${now}</updated>
  <author>
    <name>${escapeXml(author.name)}</name>
    <email>${escapeXml(author.email)}</email>
  </author>
  <generator>Next.js</generator>
  <rights>All rights reserved ${new Date().getFullYear()}, ${escapeXml(
		author.name
	)}</rights>
  ${entries}
</feed>`;
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const locale = searchParams.get("locale") || "zh";

	const atomXml = await generateAtomXml(locale);

	return new NextResponse(atomXml, {
		status: 200,
		headers: {
			"Content-Type": "application/atom+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	});
}
