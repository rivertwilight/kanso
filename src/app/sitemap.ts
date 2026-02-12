import { MetadataRoute } from "next";
import getAllPosts from "@/utils/getAllPosts";
import { getAllProjects } from "@/utils/getAllPosts";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://rene.wang";

	// Root page
	const rootPages: MetadataRoute.Sitemap = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 1,
		},
	];

	// Post pages (deduplicated by slug, no locale prefix)
	const posts = getAllPosts({ enableSort: true });
	const seenSlugs = new Set<string>();
	const postPages: MetadataRoute.Sitemap = posts
		.filter((post) => {
			if (seenSlugs.has(post.id)) return false;
			seenSlugs.add(post.id);
			return true;
		})
		.map((post) => ({
			url: `${baseUrl}/essay/${post.id}`,
			lastModified: post.frontmatter.createAt ? new Date(post.frontmatter.createAt) : new Date(),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		}));

	// Project pages
	const projects = getAllProjects();
	const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
		url: `${baseUrl}/project/${project.id}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: 0.6,
	}));

	return [...rootPages, ...postPages, ...projectPages];
}
