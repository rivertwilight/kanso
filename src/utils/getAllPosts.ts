import fs from "fs";
import path from "path";
import { globSync } from "glob";
import matter from "gray-matter";
import type { IPost } from "@/types/index";
import parseDate from "./parseDateStr";

const POSTS_DIR = path.join(process.cwd(), "posts");

interface IFileData {
	path: string;
	content: string;
}

/**
 * Get all MDX files from posts directory (flat structure)
 */
function getPostFiles(locale?: string): IFileData[] {
	const pattern = locale
		? `${POSTS_DIR}/${locale}/*.mdx`
		: `${POSTS_DIR}/**/*.mdx`;

	const files = globSync(pattern, { nodir: true });

	return files.map((filePath) => ({
		path: filePath,
		content: fs.readFileSync(filePath, "utf-8"),
	}));
}

export interface GetAllPostsOption {
	pocessRes?: {
		/**文档内容处理函数 */
		markdownBody?: (content: string) => string;
		id?: (id: string) => string;
	};
	enableSort?: boolean;
	/**
	 * If true, it will return a flatten array with posts in it.
	 */
	enableFlat?: boolean;
	/**
	 * Whether include the article content in the result.
	 */
	enableContent?: boolean;
	locale?: string;
	/**
	 * Filter posts by type. If specified, only returns posts matching this type.
	 * Common types: 'post' (default), 'book' (book reviews)
	 */
	filterByType?: string;
	/**
	 * If true, excludes posts with type='book' from the results.
	 * This is useful for getting only regular posts.
	 */
	excludeBooks?: boolean;
}

export default function getAllPosts(options: GetAllPostsOption): IPost[] {
	const {
		locale,
		enableContent,
		enableSort,
		filterByType,
		excludeBooks = false,
		pocessRes = {
			markdownBody: (content: string) => content,
			id: (content: string) => content,
		},
	} = options;

	const files = getPostFiles(locale);

	let posts: IPost[] = files.map((file) => {
		const slug = path.basename(file.path, ".mdx").trim();
		const id = pocessRes.id ? pocessRes.id(slug) : slug;

		const document = matter(file.content);
		const { data: frontmatter, content: markdownBody } = document;

		if (frontmatter.createAt) {
			frontmatter.createAt = parseDate(frontmatter.createAt).toLocaleDateString();
		}

		// Get category from frontmatter tag
		const category = frontmatter.tag || "Uncategorized";

		return {
			defaultTitle: slug,
			frontmatter,
			id,
			slug,
			markdownBody: enableContent
				? pocessRes.markdownBody
					? pocessRes.markdownBody(markdownBody)
					: markdownBody
				: "",
			locale: locale || "en",
			category,
		};
	}).filter(Boolean);

	// Filter by type if specified
	if (filterByType) {
		posts = posts.filter((post) => post.frontmatter.type === filterByType);
	}

	// Exclude books if requested (for regular post lists)
	if (excludeBooks) {
		posts = posts.filter((post) => post.frontmatter.type !== "book");
	}

	if (enableSort) {
		return posts.sort((a, b) => {
			const dateA = new Date(a.frontmatter.createAt);
			const dateB = new Date(b.frontmatter.createAt);
			return dateB.getTime() - dateA.getTime();
		});
	}

	return posts;
}

/**
 * Get a single post by slug and optional locale.
 * If no locale is provided, scans all locale directories to find a matching slug.
 */
export function getPostBySlug(slug: string, locale?: string): { frontmatter: any; content: string; locale: string } | null {
	if (locale) {
		const filePath = path.join(POSTS_DIR, locale, `${slug}.mdx`);

		if (!fs.existsSync(filePath)) {
			return null;
		}

		const content = fs.readFileSync(filePath, "utf-8");
		const document = matter(content);

		return {
			frontmatter: document.data,
			content: document.content,
			locale,
		};
	}

	// No locale provided - scan all locale directories
	const locales = fs.readdirSync(POSTS_DIR).filter((dir) => {
		const dirPath = path.join(POSTS_DIR, dir);
		return fs.statSync(dirPath).isDirectory();
	});

	for (const loc of locales) {
		const filePath = path.join(POSTS_DIR, loc, `${slug}.mdx`);

		if (fs.existsSync(filePath)) {
			const content = fs.readFileSync(filePath, "utf-8");
			const document = matter(content);

			return {
				frontmatter: document.data,
				content: document.content,
				locale: loc,
			};
		}
	}

	return null;
}

/**
 * Get all post slugs for static path generation
 */
export function getAllPostSlugs(locale?: string): { slug: string; locale: string }[] {
	const files = getPostFiles(locale);

	return files.map((file) => {
		const relativePath = path.relative(POSTS_DIR, file.path);
		const parts = relativePath.split(path.sep);
		const fileLocale = parts[0];
		const slug = path.basename(file.path, ".mdx");

		return {
			slug,
			locale: fileLocale,
		};
	});
}
