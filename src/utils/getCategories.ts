import fs from "fs";
import path from "path";
import { globSync } from "glob";

const POSTS_DIR = path.join(process.cwd(), "posts");

export interface ICategory {
	slug: string;
	config: {
		name?: string;
		description?: string;
	};
}

/**
 * Get all categories for a locale by reading category.config.js files
 */
function getCategories(locale: string): ICategory[] {
	const pattern = `${POSTS_DIR}/${locale}/**/category.config.js`;
	const configFiles = globSync(pattern, { nodir: true });

	const categories: ICategory[] = [];

	configFiles.forEach((filePath) => {
		// Get the parent folder name as the category slug
		const parentFolder = path.basename(path.dirname(filePath));

		// Read and parse the config file
		const content = fs.readFileSync(filePath, "utf-8");
		const configMatch = content.match(/module\.exports\s*=\s*({[\s\S]*?});?$/);

		let config: ICategory["config"] = {};
		if (configMatch) {
			try {
				// Parse the object literal
				config = eval(`(${configMatch[1]})`);
			} catch (e) {
				console.warn(`Failed to parse config at ${filePath}`);
			}
		}

		categories.push({
			slug: config.slug || parentFolder,
			config,
		});
	});

	return categories;
}

export default getCategories;
