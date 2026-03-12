import {
	ListItem,
	ListItemIcon,
	ListItemText,
	EllipsisVerticalIcon,
} from "@/components/ui";
import type { IPost } from "@/types/index";
import Link from "next/link";

const MAX_POST_COUNT = 99;

function formatDate(dateStr: string, locale: string): string {
	const date = new Date(dateStr);
	const now = new Date();
	const isThisYear = date.getFullYear() === now.getFullYear();
	return date.toLocaleDateString(locale, {
		...(isThisYear ? {} : { year: "numeric" }),
		month: "long",
		day: "numeric",
	});
}

export default function PostList({
	falttedPosts,
	locale,
}: {
	falttedPosts: IPost[];
	locale: string;
}) {
	return (
		<>
			{falttedPosts.slice(0, MAX_POST_COUNT).map((post) => (
				<Link
					locale={locale}
					key={post.id}
					href={"/essay/" + post.id}
					style={{ textDecoration: "none" }}
				>
					<ListItem
						style={{
							cursor: "pointer",
						}}
					>
						<ListItemText
							primary={
								post.frontmatter
									? post.frontmatter.title
									: post.slug
							}
							secondary={
								post.frontmatter?.createAt
									? formatDate(
											post.frontmatter.createAt,
											locale
									  )
									: "1970/01/01"
							}
							allowWrap
						/>
						{/* <ListItemIcon
							onClick={(e) => {
								e.preventDefault();
							}}
						>
							<EllipsisVerticalIcon />
						</ListItemIcon> */}
					</ListItem>
				</Link>
			))}
		</>
	);
}
