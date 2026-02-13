"use client";

import React from "react";
import { ArrowRight, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

/**
 * Kindle-style Section Components
 * Content sections with titles and grid layouts
 */

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
	children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({
	className = "",
	children,
	...props
}) => {
	return (
		<section
			className={`
        py-4 border-b last-of-type:border-b-0
        ${className}
      `}
			style={{ borderColor: "var(--eink-divider)" }}
			{...props}
		>
			{children}
		</section>
	);
};

interface SectionTitleProps {
	label?: string;
	children?: React.ReactNode;
	href?: string;
	showArrow?: boolean;
	className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
	label,
	children,
	href,
	showArrow = false,
	className = "",
}) => {
	const content = (
		<div className="flex items-center gap-1.5">
			<span
				className="uppercase tracking-wider text-sm font-sans font-semibold"
				style={{ color: "var(--eink-ink)" }}
			>
				{label || children}
			</span>
			{(href || showArrow) && (
				<ChevronRightIcon
					size={16}
					strokeWidth={2.5}
					style={{ color: "var(--eink-ink)" }}
				/>
			)}
		</div>
	);

	if (href) {
		return (
			<Link
				href={href}
				className={`block mb-3 hover:opacity-80 transition-opacity ${className}`}
			>
				{content}
			</Link>
		);
	}

	return <div className={`mb-3 ${className}`}>{content}</div>;
};

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export const Grid: React.FC<GridProps> = ({
	className = "",
	children,
	...props
}) => {
	// Kindle-style horizontal scroll grid that respects item natural sizes
	return (
		<div
			className={`
        flex gap-3 overflow-x-auto pb-2
        scrollbar-thin
        ${className}
      `}
			{...props}
		>
			{children}
		</div>
	);
};

interface GridItemProps {
	href?: string;
	src: string;
	alt?: string;
	className?: string;
}

export const GridItem: React.FC<GridItemProps> = ({
	href,
	src,
	alt = "grid item",
	className = "",
}) => {
	const [isPressed, setIsPressed] = React.useState(false);

	// Kindle-style invert on tap
	const pressedStyles = isPressed
		? {
				filter: "invert(1)",
		  }
		: {};

	const imageContent = (
		<div
			className={`
        relative
        shrink-0
        overflow-hidden
        transition-all duration-75
        select-none
        ${className}
      `}
			style={{
				border: "1px solid var(--eink-divider)",
				...pressedStyles,
			}}
			onMouseDown={() => setIsPressed(true)}
			onMouseUp={() => setIsPressed(false)}
			onMouseLeave={() => setIsPressed(false)}
			onTouchStart={() => setIsPressed(true)}
			onTouchEnd={() => setIsPressed(false)}
		>
			{/* Kindle-style: respect natural image aspect ratio with max height constraint */}
			<img
				src={src}
				alt={alt}
				className="block w-auto h-auto max-h-40"
				style={{
					maxWidth: "160px",
					objectFit: "contain",
				}}
			/>
		</div>
	);

	if (href) {
		// Check if it's an internal link (starts with /)
		const isInternalLink = href.startsWith("/");

		if (isInternalLink) {
			return <Link href={href}>{imageContent}</Link>;
		}

		return (
			<Link href={href} target="_blank" rel="noopener noreferrer">
				{imageContent}
			</Link>
		);
	}

	return imageContent;
};
