import { createElement } from "react";
import { renderToString } from "react-dom/server";
import fs from "fs";
import { Feed } from "feed";
import ReactMarkdown from "react-markdown";
import siteConfig from "src/site.config";
import getAllPosts from "./getAllPosts";
import parseDate from "./parseDateStr";

export default async function generateRssFeed() {
	const siteURL = siteConfig.root;
	const date = new Date();
	const author = siteConfig.author;

	const feed = new Feed({
		title: siteConfig.title["zh-CN"],
		description: siteConfig.description,
		id: siteURL,
		link: siteURL,
		image: `${siteURL}/favicon.ico`,
		favicon: `${siteURL}/favicon.ico`,
		copyright: `All rights reserved ${date.getFullYear()}, RiverTwilight`,
		updated: date,
		generator: "Feed for rene.wang",
		feedLinks: {
			rss2: `${siteURL}/rss/feed.xml`, // xml format
			json: `${siteURL}/rss/feed.json`, // json fromat
		},
		author,
	});

	const allPosts = getAllPosts({
		enableContent: true,
		enableFlat: true,
		locale: "zh-CN",
	});

	fs.mkdirSync(`./public/rss`, {
		recursive: true,
	});

	allPosts.forEach((post: any) => {
		feed.addItem({
			title: post.frontmatter.title,
			id: post.id,
			link: `${siteConfig.root}/p/${post.id}`,
			content: renderToString(
				createElement(ReactMarkdown, {
					children: post.markdownBody,
				})
			),
			author: [author],
			contributor: [author],
			date: parseDate(post.frontmatter.date),
		});
	});

	fs.mkdirSync(`./public/rss`, {
		recursive: true,
	});

	fs.writeFileSync("./public/rss/feed.xml", feed.rss2(), "utf8");
}
