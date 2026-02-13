import fs from "fs";
import path from "path";
import { globSync } from "glob";
import matter from "gray-matter";
import type { IPost } from "@/types/index";
import parseDate from "./parseDateStr";

const CRAFTS_DIR = path.join(process.cwd(), "content", "crafts");
const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

interface IFileData {
	path: string;
	content: string;
}

/**
 * Get all MDX files from crafts directory (locale-based structure)
 */
function getPostFiles(locale?: string): IFileData[] {
	const pattern = locale
		? `${CRAFTS_DIR}/${locale}/*.mdx`
		: `${CRAFTS_DIR}/**/*.mdx`;

	const files = globSync(pattern, { nodir: true });

	return files.map((filePath) => ({
		path: filePath,
		content: fs.readFileSync(filePath, "utf-8"),
	}));
}

/**
 * Get all MDX files from projects directory (flat, no locale)
 */
function getProjectFiles(): IFileData[] {
	const pattern = `${PROJECTS_DIR}/*.mdx`;
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
}

export default function getAllPosts(options: GetAllPostsOption): IPost[] {
	const {
		locale,
		enableContent,
		enableSort,
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
			frontmatter: frontmatter as IPost["frontmatter"],
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

	// Filter out unlisted posts
	posts = posts.filter((post) => !post.frontmatter.unlist);

	if (enableSort) {
		return posts.sort((a, b) => {
			const dateA = new Date(a.frontmatter.updateAt || a.frontmatter.createAt);
			const dateB = new Date(b.frontmatter.updateAt || b.frontmatter.createAt);
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
		const filePath = path.join(CRAFTS_DIR, locale, `${slug}.mdx`);

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
	const locales = fs.readdirSync(CRAFTS_DIR).filter((dir) => {
		const dirPath = path.join(CRAFTS_DIR, dir);
		return fs.statSync(dirPath).isDirectory();
	});

	for (const loc of locales) {
		const filePath = path.join(CRAFTS_DIR, loc, `${slug}.mdx`);

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
		const relativePath = path.relative(CRAFTS_DIR, file.path);
		const parts = relativePath.split(path.sep);
		const fileLocale = parts[0];
		const slug = path.basename(file.path, ".mdx");

		return {
			slug,
			locale: fileLocale,
		};
	});
}

/**
 * Get all projects from the projects directory (flat, no locale)
 */
export function getAllProjects(options: { enableSort?: boolean; enableContent?: boolean } = {}): IPost[] {
	const { enableSort, enableContent } = options;
	const files = getProjectFiles();

	let projects: IPost[] = files.map((file) => {
		const slug = path.basename(file.path, ".mdx").trim();

		const document = matter(file.content);
		const { data: frontmatter, content: markdownBody } = document;

		if (frontmatter.createAt) {
			frontmatter.createAt = parseDate(frontmatter.createAt).toLocaleDateString();
		}

		const category = frontmatter.tag || "Uncategorized";

		return {
			defaultTitle: slug,
			frontmatter: frontmatter as IPost["frontmatter"],
			id: slug,
			slug,
			markdownBody: enableContent ? markdownBody : "",
			category,
		};
	}).filter(Boolean);

	// Filter out unlisted projects
	projects = projects.filter((p) => !p.frontmatter.unlist);

	if (enableSort) {
		// Sort by year (latest first), fallback to createAt
		return projects.sort((a, b) => {
			const yearA = a.frontmatter.year ?? 0;
			const yearB = b.frontmatter.year ?? 0;
			return yearB - yearA;
		});
	}

	return projects;
}

/**
 * Get a single project by slug.
 */
export function getProjectBySlug(slug: string): { frontmatter: any; content: string } | null {
	const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);

	if (!fs.existsSync(filePath)) {
		return null;
	}

	const content = fs.readFileSync(filePath, "utf-8");
	const document = matter(content);

	return {
		frontmatter: document.data,
		content: document.content,
	};
}

/**
 * Get all project slugs for static path generation
 */
export function getAllProjectSlugs(): string[] {
	const files = getProjectFiles();
	return files.map((file) => path.basename(file.path, ".mdx"));
}
