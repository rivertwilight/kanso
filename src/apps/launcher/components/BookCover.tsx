"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { IPost } from "@/types/index";
import UniversalBookCover from "@/components/UniversalBookCover";

interface BookCoverProps {
	book: IPost;
	locale: string;
	showYearBadge?: boolean;
}

function YearBadge({ year }: { year: number }) {
	return (
		<div className="absolute top-0 right-0 overflow-hidden w-16 h-16 z-10">
			<div
				className="absolute text-[10px] font-bold text-center w-22.5 py-0.5 rotate-45 origin-center"
				style={{
					top: "12px",
					right: "-22px",
					backgroundColor: "var(--eink-ink)",
					color: "var(--eink-paper)",
				}}
			>
				{year}
			</div>
		</div>
	);
}

export default function BookCover({
	book,
	locale,
	showYearBadge = false,
}: BookCoverProps) {
	const [imageError, setImageError] = useState(false);
	const title = book.frontmatter.title || book.defaultTitle;
	const cover = book.frontmatter.cover;
	// @ts-expect-error
	const author = book.frontmatter.author;
	const year = book.frontmatter?.year;
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
					{showYearBadge && year && <YearBadge year={year} />}
					<UniversalBookCover
						title={title}
						author={author}
						size="small"
					/>
				</div>
			) : (
				<div
					className="w-full relative overflow-hidden border"
					style={{
						aspectRatio: "2/3",
						borderColor: "var(--eink-ink-muted)",
					}}
				>
					{showYearBadge && year && <YearBadge year={year} />}
					<Image
						src={cover!}
						alt={title}
						width={300}
						height={450}
						className="w-full h-full object-cover"
						sizes="(max-width: 768px) 50vw, 25vw"
						onError={() => setImageError(true)}
					/>
				</div>
			)}
		</Link>
	);
}
