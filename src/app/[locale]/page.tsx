import { Suspense } from "react";
import getAllPosts from "@/utils/getAllPosts";
import getCategories from "@/utils/getCategories";
import { setRequestLocale } from "next-intl/server";
import LauncherApp from "@/apps/launcher";

interface PageProps {
	params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: PageProps) {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	// Get regular posts (exclude books)
	const allPosts = getAllPosts({
		pocessRes: {
			markdownBody: (content) =>
				`${content.substring(0, 200)}${
					content.length >= 200 ? "..." : ""
				}`,
			id: (text) => text,
		},
		enableFlat: true,
		enableSort: true,
		excludeBooks: true,
	}).filter((post: any) => !post.frontmatter.hidden);

	// Get book reviews
	const projects = getAllPosts({
		filterByType: "book",
		enableSort: true,
		// locale: locale,
	}).filter((post: any) => !post.frontmatter.hidden);

	const allCategories = getCategories(locale);

	return (
		<Suspense fallback={<div />}>
			<LauncherApp
				allPosts={allPosts}
				falttedPosts={allPosts}
				allCategories={allCategories}
				projects={projects}
				locale={locale}
			/>
		</Suspense>
	);
}
