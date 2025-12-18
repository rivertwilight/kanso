import { MetadataRoute } from "next";
import getAllPosts, { getAllPostSlugs } from "@/utils/getAllPosts";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://rene.wang";
	const locales = ["en", "zh"];

	// Static pages
	const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
		{
			url: `${baseUrl}/${locale}`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 1,
		},
		{
			url: `${baseUrl}/${locale}/archive`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/${locale}/settings`,
			lastModified: new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.3,
		},
	]);

	// Dynamic post pages
	const postPages: MetadataRoute.Sitemap = locales.flatMap((locale) => {
		const posts = getAllPosts({ locale, enableSort: true });

		return posts.map((post) => ({
			url: `${baseUrl}/${locale}/p/${post.id}`,
			lastModified: post.frontmatter.date ? new Date(post.frontmatter.date) : new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		}));
	});

	return [...staticPages, ...postPages];
}

