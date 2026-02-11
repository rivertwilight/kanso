"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { IPost } from "@/types/index";
import UniversalBookCover from "@/components/UniversalBookCover";

interface BookCoverProps {
	book: IPost;
	locale: string;
}

export default function BookCover({ book, locale }: BookCoverProps) {
	const [imageError, setImageError] = useState(false);
	const title = book.frontmatter.title || book.defaultTitle;
	const cover = book.frontmatter.cover;
	const author = book.frontmatter.metadata?.author;
	const slug = book.slug;
	const showPlaceholder = !cover || imageError;

	return (
		<Link href={`/${locale}/project/${slug}`} className="block w-full">
			{showPlaceholder ? (
				<div
					className="w-full relative overflow-hidden border"
					style={{
						aspectRatio: "2/3",
						borderColor: "var(--eink-ink-muted)",
						backgroundColor: "var(--eink-paper-secondary)",
					}}
				>
					<UniversalBookCover
						title={title}
						author={author}
						size="small"
					/>
				</div>
			) : (
				<div
					className="w-full relative border"
					style={{
						borderColor: "var(--eink-ink-muted)",
					}}
				>
					<Image
						src={cover!}
						alt={title}
						width={300}
						height={450}
						className="w-full h-auto"
						sizes="(max-width: 768px) 50vw, 25vw"
						onError={() => setImageError(true)}
					/>
				</div>
			)}
		</Link>
	);
}
