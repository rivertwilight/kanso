import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
	async redirects() {
		return [
			{
				source: "/s/twitter",
				destination: "https://twitter.com/rea1DonandTrump",
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

export default withNextIntl(nextConfig);
