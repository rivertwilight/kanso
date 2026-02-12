"use client";

import type { IPost } from "@/types/index";
import BookCover from "./BookCover";

interface BookGridProps {
	books: IPost[];
	locale: string;
}

export default function BookGrid({ books, locale }: BookGridProps) {
	if (books.length === 0) {
		return (
			<div className="flex items-center justify-center min-h-[60vh]">
				<p
					className="text-center"
					style={{ color: "var(--eink-ink-muted)" }}
				>
					No book reviews yet
				</p>
			</div>
		);
	}

	return (
		<div
			className="grid grid-cols-3 md:grid-cols-4 gap-6"
			style={{
				gridAutoRows: "auto",
				alignItems: "end",
			}}
		>
			{books.map((book) => (
				<BookCover key={book.id} book={book} locale={locale} showYearBadge />
			))}
		</div>
	);
}
