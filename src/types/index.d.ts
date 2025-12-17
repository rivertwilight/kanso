export type IPost = {
	slug: string;
	defaultTitle: string;
	frontmatter: {
		title?: string;
		date: string;
		/** 目录 */
		categories?: string[];
	};
	id: number;
	markdownBody?: string;
	category?: string;
};

declare global {

	interface Window {
		scrollListener: any;
	}

	interface NodeRequire {
		/** A special feature supported by webpack's compiler that allows you to get all matching modules starting from some base directory.  */
		context: (
			directory: string,
			useSubdirectories: boolean,
			regExp: RegExp
		) => any
	}

}

export interface ICurrentPage {
	title: string;
	path: string;
	description?: string;
	image?: string;
	keywords?: string[];
}

export type TLocale = "zh-CN" | "en-US";

export interface ISiteConfig {
	title: string;
	keywords: string[];
	description: string;
	root: string;
	relatedLinks: {
		title: string;
		url: string;
	}[];
	author: {
		name: string;
		image?: string;
		github?: string;
		twitter?: string;
		intro: {
			title: string;
			content: string;
		}[];
	};
}

declare module "*.svg" {
	const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
}
