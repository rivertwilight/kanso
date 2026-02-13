"use client";

import { useEffect, useRef, useState } from "react";
import BookCover from "./BookCover";
import type { IPost } from "@/types/index";

interface ProjectScrollerProps {
	projects: IPost[];
	locale: string;
}

/**
 * ProjectScroller component that dynamically sizes items
 * so the last visible item is always "half" visible,
 * indicating to users that content can be scrolled.
 */
export default function ProjectScroller({
	projects,
	locale,
}: ProjectScrollerProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [itemWidth, setItemWidth] = useState(96); // Default 96px (w-24)

	useEffect(() => {
		const calculateItemWidth = () => {
			if (!containerRef.current) return;

			const containerWidth = containerRef.current.offsetWidth;
			const gap = 12; // 0.75rem (gap-3) in pixels
			const fullItems = 3; // Number of fully visible items
			const partialItemRatio = 0.5; // How much of the last item to show (0.5 = half)

			// Calculate to show exactly 'fullItems' complete items + partial item
			const totalVisibleItems = fullItems + partialItemRatio;
			const totalGaps = gap * (totalVisibleItems - 1);
			const calculatedWidth = (containerWidth - totalGaps) / totalVisibleItems;

			// Ensure minimum width of 80px and maximum of 140px for good UX
			const finalWidth = Math.max(80, Math.min(140, calculatedWidth));

			setItemWidth(finalWidth);
		};

		// Calculate on mount
		calculateItemWidth();

		// Recalculate on resize
		const resizeObserver = new ResizeObserver(calculateItemWidth);
		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	// Calculate fixed height based on 2:3 aspect ratio (book cover standard)
	const itemHeight = itemWidth * 1.5;

	return (
		<div
			ref={containerRef}
			className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin items-end"
		>
			{projects.map((project, index) => (
				<div
					key={index}
					className="shrink-0"
					style={{
						width: `${itemWidth}px`,
						height: `${itemHeight}px`,
					}}
				>
					<BookCover book={project} locale={locale} />
				</div>
			))}
		</div>
	);
}
