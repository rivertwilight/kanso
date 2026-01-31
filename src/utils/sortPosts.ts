import type { IPost } from "../types";

function getSortDate(post: IPost): number {
	const dateStr = post.frontmatter.updateAt || post.frontmatter.createAt;
	return new Date(dateStr).getTime();
}

function sortByDate(flattenPosts: IPost[]): IPost[] {
	return flattenPosts
		.filter((post) => "createAt" in post.frontmatter)
		.sort((a, b) => getSortDate(b) - getSortDate(a));
}

export { sortByDate };
