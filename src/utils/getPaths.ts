import getAllPosts from "@/utils/getAllPosts";

export default function getPaths(locale: string) {
	const allPosts = getAllPosts({
		enableFlat: true,
		locale,
	});

	const paths = allPosts.map((post: any) => {
		return {
			params: {
				slug: post.id,
			},
			locale: post.locale,
		};
	});

	return paths;
}
