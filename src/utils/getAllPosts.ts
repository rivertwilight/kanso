import fs from "fs";
import path from "path";
import { globSync } from "glob";
import matter from "gray-matter";
import type { IPost } from "@/types/index";
import parseDate from "./parseDateStr";

const POSTS_DIR = path.join(process.cwd(), "posts");

interface IFile {
	name: string;
	type?: "config" | "doc" | "folder";
	value?: any;
	children?: IFile[];
	path?: string;
	root?: boolean;
	config?: any;
	content?: string;
}

interface IFileData {
	path: string;
	content: string;
}

/**
 * Get all MDX files from posts directory
 */
function getPostFiles(locale?: string): IFileData[] {
	const pattern = locale
		? `${POSTS_DIR}/${locale}/**/*.mdx`
		: `${POSTS_DIR}/**/*.mdx`;

	const files = globSync(pattern, { nodir: true });

	return files.map((filePath) => ({
		path: filePath,
		content: fs.readFileSync(filePath, "utf-8"),
	}));
}

/**
 * Get all category config files
 */
function getCategoryConfigs(locale?: string): { path: string; config: any }[] {
	const pattern = locale
		? `${POSTS_DIR}/${locale}/**/category.config.js`
		: `${POSTS_DIR}/**/category.config.js`;

	const files = globSync(pattern, { nodir: true });

	return files.map((filePath) => {
		// Read JS config file as text and extract the module.exports object
		const content = fs.readFileSync(filePath, "utf-8");
		const configMatch = content.match(/module\.exports\s*=\s*({[\s\S]*?});?$/);

		let config = {};
		if (configMatch) {
			try {
				// Parse the object literal
				config = eval(`(${configMatch[1]})`);
			} catch (e) {
				console.warn(`Failed to parse config at ${filePath}`);
			}
		}

		return {
			path: filePath,
			config,
		};
	});
}

/**
 * Build a tree structure from flat file paths
 */
function buildFileTree(files: IFileData[], configs: { path: string; config: any }[], locale: string): IFile {
	const tree: IFile = {
		name: locale,
		type: "folder",
		root: true,
		children: [],
	};

	// Group files by category (folder)
	const categories = new Map<string, { posts: IFileData[]; config: any }>();

	files.forEach((file) => {
		const relativePath = path.relative(POSTS_DIR, file.path);
		const parts = relativePath.split(path.sep);

		// parts = [locale, category, filename.mdx]
		if (parts.length >= 3 && parts[0] === locale) {
			const category = parts[1];

			if (!categories.has(category)) {
				// Find config for this category
				const configPath = path.join(POSTS_DIR, locale, category, "category.config.js");
				const config = configs.find((c) => c.path === configPath)?.config || {};

				categories.set(category, { posts: [], config });
			}

			categories.get(category)!.posts.push(file);
		}
	});

	// Build tree from categories
	categories.forEach((data, categoryName) => {
		const categoryNode: IFile = {
			name: categoryName,
			type: "folder",
			config: data.config,
			children: data.posts.map((file) => ({
				name: path.basename(file.path),
				type: "doc",
				path: file.path,
				content: file.content,
			})),
		};

		tree.children!.push(categoryNode);
	});

	return tree;
}

const flatPost = (allPosts: any[]): IPost[] => {
	return allPosts
		.map((item) => {
			const classfiedPosts = item.children.map((post: any) =>
				Object.assign(
					{
						category: item.name,
					},
					post
				)
			);
			return classfiedPosts;
		})
		.flat();
};

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
}

export { flatPost };

export default function getAllPosts(options: GetAllPostsOption) {
	const {
		locale,
		enableContent,
		enableFlat,
		enableSort,
		pocessRes = {
			markdownBody: (content: string) => content,
			id: (content: string) => content,
		},
	} = options;

	const files = getPostFiles(locale);
	const configs = getCategoryConfigs(locale);
	const tree = buildFileTree(files, configs, locale || "en-US");

	const validlization = (items: IFile[]): any[] => {
		return items
			.filter((item) => item.type !== "config")
			.map((item) => {
				if (item.type === "doc") {
					const slug = path.basename(item.path!, ".mdx").trim();
					const id = pocessRes.id ? pocessRes.id(slug) : slug;

					const fileContent = (item as any).content || fs.readFileSync(item.path!, "utf-8");
					const document = matter(fileContent);
					const { data: frontmatter, content: markdownBody } = document;

					if (frontmatter.date) {
						frontmatter.date = parseDate(frontmatter.date).toLocaleDateString();
					}

					return {
						defaultTitle: slug,
						frontmatter,
						id,
						markdownBody: enableContent
							? pocessRes.markdownBody
								? pocessRes.markdownBody(markdownBody)
								: markdownBody
							: "",
						locale: locale || "en-US",
					};
				} else if (item.type === "folder") {
					return {
						...item,
						children: validlization(item.children || []),
					};
				}
			})
			.filter(Boolean);
	};

	const validlizedTree = validlization(tree.children || []);

	if (enableFlat) {
		const flattened = flatPost(validlizedTree);
		if (enableSort) {
			return flattened.sort((a, b) => {
				const dateA = new Date(a.frontmatter.date);
				const dateB = new Date(b.frontmatter.date);
				return dateB.getTime() - dateA.getTime();
			});
		}
		return flattened;
	}

	return validlizedTree;
}

/**
 * Get a single post by slug and locale
 */
export function getPostBySlug(slug: string, locale: string): { frontmatter: any; content: string } | null {
	const pattern = `${POSTS_DIR}/${locale}/**/${slug}.mdx`;
	const files = globSync(pattern, { nodir: true });

	if (files.length === 0) {
		return null;
	}

	const content = fs.readFileSync(files[0], "utf-8");
	const document = matter(content);

	return {
		frontmatter: document.data,
		content: document.content,
	};
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
