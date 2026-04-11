import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import createMDX from "@next/mdx";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const withMDX = createMDX({
	options: {
		remarkPlugins: [
			"remark-math",
			"remark-gfm",
			"remark-frontmatter",
			["remark-mdx-frontmatter", { name: "frontmatter" }],
		],
		rehypePlugins: ["rehype-katex"],
	},
});

const nextConfig: NextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*",
			},
		],
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "Content-Security-Policy",
						value: "frame-src https://giscus.app https://player.bilibili.com;",
					},
				],
			},
		];
	},
	async redirects() {
		return [
			// Locale migration redirects
			{
				source: "/zh-CN",
				destination: "/zh",
				permanent: true,
			},
			{
				source: "/zh-CN/:path*",
				destination: "/zh/:path*",
				permanent: true,
			},
			{
				source: "/en-US",
				destination: "/en",
				permanent: true,
			},
			{
				source: "/en-US/:path*",
				destination: "/en/:path*",
				permanent: true,
			},
			// /p/:slug → /essay/:slug migration
			{
				source: "/p/:slug",
				destination: "/essay/:slug",
				permanent: true,
			},
			// Social links
			{
				source: "/s/twitter",
				destination: "https://twitter.com/renedotwang",
				permanent: true,
			},
			{
				source: "/s/pixiv",
				destination: "https://www.pixiv.net/en/users/35572742",
				permanent: true,
			},
			{
				source: "/rss",
				destination: "https://rene.wang/rss/feed.xml",
				permanent: false,
			},
		];
	},
};

export default withMDX(withNextIntl(nextConfig));
