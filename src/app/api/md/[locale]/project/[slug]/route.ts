import { NextResponse } from "next/server";
import matter from "gray-matter";
import { getProjectBySlug } from "@/utils/getAllPosts";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ locale: string; slug: string }> }
) {
	const { slug } = await params;
	const project = getProjectBySlug(slug);
	if (!project) {
		return new NextResponse("Not found", {
			status: 404,
			headers: { "Content-Type": "text/plain; charset=utf-8" },
		});
	}

	const body = matter.stringify(project.content, project.frontmatter);
	const tokens = Math.ceil(body.length / 4);

	return new NextResponse(body, {
		status: 200,
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			Vary: "Accept",
			"x-markdown-tokens": String(tokens),
			"Cache-Control": "public, max-age=3600, s-maxage=3600",
		},
	});
}
