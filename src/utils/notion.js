const { Client } = require("@notionhq/client");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const axios = require("axios");

// Notion Developer Guide
// https://developers.notion.com/reference/block#bulleted-list-item

dotenv.config();

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
	console.error(
		"Please set NOTION_API_KEY and NOTION_DATABASE_ID environment variables"
	);
	process.exit(1);
}

const notion = new Client({
	auth: NOTION_API_KEY,
});

async function downloadImage(url, localPath) {
	try {
		const directory = path.dirname(localPath);

		// Check if directory exists, if not, create it
		if (!fs.existsSync(directory)) {
			fs.mkdirSync(directory, { recursive: true });
		}

		// Check if the image file already exists
		if (fs.existsSync(localPath)) {
			console.log(`Image already exists: ${localPath}`);
			return;
		}

		const response = await axios({
			method: "GET",
			url: url,
			responseType: "stream",
		});

		await new Promise((resolve, reject) => {
			response.data
				.pipe(fs.createWriteStream(localPath))
				.on("finish", resolve)
				.on("error", reject);
		});

		console.log(`Downloaded image to ${localPath}`);
	} catch (error) {
		console.error(`Error downloading image: ${error.message}`);
	}
}

function richTextToMarkdown(richText) {
	return richText
		.map((text) => {
			// console.log("===>", text);

			if (text.type === "equation") {
				return `$$ ${text.plain_text} $$`;
			} else if (text.type === "text") {
				const { annotations } = text;

				let res = text.plain_text;

				if (text.href) {
					res = `[${res}](${text.href})`;
				}

				if (annotations.bold) {
					res = `**${res}**`;
				}

				if (annotations.italic) {
					res = `*${res}*`;
				}

				if (annotations.strikethrough) {
					res = `~~${res}~~`;
				}

				return res;
			}
		})
		.join("");
}

async function notionBlocksToMarkdown(blocks, indent = 0) {
	let numberdListCount = 0;

	const markdownPromises = blocks.map(async (block) => {
		let childrenContent = null;
		if (block.has_children) {
			console.log("has children");
			childrenContent = await getPageContent(block.id, indent + 1);
		}
		const spaces = "  ".repeat(indent);

		if (block.type !== "numbered_list_item") {
			numberdListCount = 0;
		}

		switch (block.type) {
			case "quote":
				return `> ${richTextToMarkdown(block.quote.rich_text)}\n`;
			case "bulleted_list_item":
				// console.log(
				// 	`${block.bulleted_list_item.rich_text[0].plain_text}`,
				// 	block
				// );
				return `${spaces}- ${richTextToMarkdown(
					block.bulleted_list_item.rich_text
				)}\n${childrenContent || ""}`;
			case "numbered_list_item":
				numberdListCount += 1;
				return `${
					numberdListCount === 1 ? "\n" : ""
				}${spaces}${numberdListCount}. ${richTextToMarkdown(
					block.numbered_list_item.rich_text
				)}\n${childrenContent || ""}`;
			case "divider":
				return `\n---\n`;
			case "paragraph":
				return `\n${richTextToMarkdown(block.paragraph.rich_text)}\n`;
			case "heading_3":
				return `\n### ${richTextToMarkdown(
					block.heading_3.rich_text
				)}\n`;
			case "heading_2":
				return `\n## ${richTextToMarkdown(
					block.heading_2.rich_text
				)}\n`;
			case "heading_1":
				return `\n# ${richTextToMarkdown(block.heading_1.rich_text)}\n`;
			case "code":
				return `\n\`\`\`${block.code.language}\n${richTextToMarkdown(
					block.code.rich_text
				)}\n\`\`\`\n`;
			case "equation":
				return `\n$$\n${block.equation.expression}\n$$\n`;
			case "to_do":
				return `\n- [${
					block.to_do.checked ? "x" : " "
				}] ${richTextToMarkdown(block.to_do.rich_text)}\n`;
			case "table":
				const table_rows = await notion.blocks.children.list({
					block_id: block.id,
				});

				let table_content = "";

				table_rows.results.forEach((row, j) => {
					row.table_row.cells.forEach((cell, i) => {
						console.log("CELL", cell);

						let cell_content =
							cell.length > 0 ? cell[0].plain_text : "";

						table_content += `${
							i === 0 ? "|" : ""
						} ${cell_content} | ${
							i === row.table_row.cells.length - 1 ? "\n" : ""
						}`;
					});

					if (j === 0) {
						table_content += `|${Array(block.table.table_width)
							.fill(" --- |")
							.join("")}\n`;
					}
				});

				// console.log("====> ROWS", table_rows);

				return table_content;
			case "image":
				// console.log(block);
				let imageURL =
					block.image.type === "external"
						? block.image.external.url
						: block.image.file.url;
				const imageName = `${block.id}_${path.basename(
					new URL(imageURL).pathname
				)}`;
				const localImagePath = `/image/post/${imageName}`; // Updated path
				const localFilesystemPath = `./public/image/post/${imageName}`; // Path for filesystem operations

				await downloadImage(imageURL, localFilesystemPath);

				return `\n![](${localImagePath})\n`;
			case "video":
				// TODO Parse Notion's video block
				return `\n![Video](${block.video.url})\n`;
			default:
				return "";
		}
	});

	const resolvedMarkdowns = await Promise.all(markdownPromises);
	return resolvedMarkdowns.join("");
}

async function getPageContent(pageId, indent = 0) {
	let allBlocks = [];
	let hasMore = true;
	let startCursor = undefined;

	while (hasMore) {
		const content = await notion.blocks.children.list({
			block_id: pageId,
			start_cursor: startCursor,
			page_size: 100, // Maximum page size allowed by Notion API
		});

		allBlocks = [...allBlocks, ...content.results];
		hasMore = content.has_more;
		startCursor = content.next_cursor;
	}

	return notionBlocksToMarkdown(allBlocks, indent);
}

async function getBlogPosts() {
	const results = await notion.databases.query({
		database_id: NOTION_DATABASE_ID,
	});

	const posts = await Promise.all(
		results.results.map(async (post) => {
			// console.log(Object.keys(post.properties));
			if (post.properties.Published.checkbox) {
				let date = post.properties.Date.created_time;
				console.log(post.properties.Date);
				if (post.properties["Publish Date"].date) {
					date = post.properties["Publish Date"].date.start;
				}

				return {
					id: post.id,
					title: post.properties.Name.title[0]?.plain_text,
					slug: post.properties.Slug.rich_text[0]?.plain_text,
					summary: post.properties.Summary.rich_text[0]?.plain_text,
					cover: post.properties.Cover.files[0]?.external.url,
					date,
					locale: post.properties.Locale.multi_select,
					tags: post.properties.Tags.multi_select,
					keywords: post.properties.Keywords.multi_select,
				};
			}
		})
	);

	console.log(posts);

	return posts.filter((post) => post);
}

(async function main() {
	const posts = await getBlogPosts();

	for (const post of posts) {
		const postContent = await getPageContent(post.id);
		const metadata = [
			`title: ${post.title}`,
			`createAt: ${post.date}`,
			`summary: ${
				post.summary || postContent.slice(0, 50).replaceAll("\n", " ")
			}`,
		];

		if (post.cover) {
			metadata.push(`cover: ${post.cover}`);
		}

		if (post.keywords && post.keywords.length > 0) {
			metadata.push(`keywords:\n${post.keywords.map(k => `  - ${k.name}`).join("\n")}`);
		}

		const frontMatterStr = metadata.join("\n");
		const rawMarkdown = `---\n${frontMatterStr}\n---\n\n${postContent}`;

		const fileName = `${post.slug
			.replace(/[^a-zA-Z0-9]/g, "-")
			.toLowerCase()}.md`;

		for (const locale of post.locale) {
			for (const tag of post.tags) {
				const directoryPath = path.join(
					`./content/crafts/${locale.name}/${tag.name}`
				);

				if (!fs.existsSync(directoryPath)) {
					fs.mkdirSync(directoryPath, { recursive: true });
				}

				await fs.promises.writeFile(
					path.join(directoryPath, fileName),
					rawMarkdown
				);

				console.log(`Synced post: ${fileName}`);
			}
		}
	}
})();
