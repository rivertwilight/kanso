import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const ESSAY_RE = /^\/(?:(en|zh)\/)?essay\/([^/]+)\/?$/;
const PROJECT_RE = /^\/(?:(en|zh)\/)?project\/([^/]+)\/?$/;

function wantsMarkdown(accept: string): boolean {
	return accept
		.split(",")
		.some((part) => part.trim().startsWith("text/markdown"));
}

export default function proxy(req: NextRequest) {
	const accept = req.headers.get("accept") || "";
	if (wantsMarkdown(accept)) {
		const { pathname } = req.nextUrl;
		const essay = pathname.match(ESSAY_RE);
		if (essay) {
			const url = req.nextUrl.clone();
			url.pathname = `/api/md/${essay[1] || "en"}/essay/${essay[2]}`;
			return NextResponse.rewrite(url);
		}
		const project = pathname.match(PROJECT_RE);
		if (project) {
			const url = req.nextUrl.clone();
			url.pathname = `/api/md/${project[1] || "en"}/project/${project[2]}`;
			return NextResponse.rewrite(url);
		}
	}
	return intlMiddleware(req);
}

export const config = {
	matcher: [
		// Match all pathnames except for
		// - … if they start with `/api`, `/_next` or `/_vercel`
		// - … the ones containing a dot (e.g. `favicon.ico`)
		"/((?!api|_next|_vercel|.*\\..*).*)",
	],
};
