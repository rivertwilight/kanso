"use client";

import { useEffect, useRef, ReactNode, useMemo } from "react";
import { useAtom } from "jotai";
import { readerSettingsAtom } from "@/system/atoms/readerSettings";
import ImageBlock from "@/components/ImageBlock";
import AppToolbar from "@/system/components/AppToolbar";
import "katex/dist/katex.min.css";

function formatStandardDate(dateString: string, locale: string): string {
	const date = new Date(dateString);

	if (locale === "zh") {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		return `${year} 年 ${month} 月 ${day} 日`;
	} else {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "short",
			day: "numeric",
		};
		return date.toLocaleDateString("en", options);
	}
}

function formatRelativeDate(dateString: string, locale: string): string {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	// For dates within the last 30 days, show human-friendly strings
	if (diffInDays >= 0 && diffInDays < 30) {
		if (diffInDays === 0) {
			return locale === "zh" ? "今天" : "Today";
		} else if (diffInDays === 1) {
			return locale === "zh" ? "昨天" : "Yesterday";
		} else if (diffInDays < 7) {
			return locale === "zh"
				? `${diffInDays} 天前`
				: `${diffInDays} days ago`;
		} else if (diffInDays < 14) {
			return locale === "zh" ? "1 周前" : "1 week ago";
		} else if (diffInDays < 21) {
			return locale === "zh" ? "2 周前" : "2 weeks ago";
		} else if (diffInDays < 30) {
			return locale === "zh" ? "3 周前" : "3 weeks ago";
		}
	}

	// For older dates, fall back to standard format
	return formatStandardDate(dateString, locale);
}

// Font family mapping
const fontFamilyMap: Record<string, string> = {
	bookerly: "'Bookerly', 'Noto Serif SC', Georgia, serif",
	"amazon-ember": "'Amazon Ember', 'Noto Sans SC', sans-serif",
	"noto-serif": "'Noto Serif SC', Georgia, serif",
	system: "system-ui, -apple-system, sans-serif",
};

interface BookReaderAppProps {
	id: string;
	postProps: any;
	postContent: ReactNode;
	locale: string;
}

export default function BookReaderApp({
	id,
	postProps,
	postContent,
	locale,
}: BookReaderAppProps) {
	const topRef = useRef<HTMLDivElement>(null);
	const [settings] = useAtom(readerSettingsAtom);

	// Reset scroll position when navigating to article
	useEffect(() => {
		// Find the scrollable parent container (KindleBezel content area)
		const findScrollableParent = (
			element: HTMLElement | null
		): HTMLElement | null => {
			if (!element) return null;
			const parent = element.parentElement;
			if (!parent) return null;

			const style = window.getComputedStyle(parent);
			if (style.overflowY === "auto" || style.overflowY === "scroll") {
				return parent;
			}
			return findScrollableParent(parent);
		};

		if (topRef.current) {
			const scrollableParent = findScrollableParent(topRef.current);
			if (scrollableParent) {
				scrollableParent.scrollTop = 0;
			}
		}
		// Also reset window scroll for mobile view
		window.scrollTo(0, 0);
	}, [id]);

	// Compute reader styles based on settings
	const readerStyles = useMemo(
		() => ({
			fontSize: `${settings.fontSize}px`,
			fontFamily:
				fontFamilyMap[settings.fontFamily] || fontFamilyMap.bookerly,
			lineHeight: settings.lineHeight,
			paddingLeft: `${settings.marginHorizontal}px`,
			paddingRight: `${settings.marginHorizontal}px`,
		}),
		[settings]
	);

	if (!postProps) return null;

	return (
		<>
			<AppToolbar
				type="reader"
				title={postProps?.title || ""}
				onMenuClick={() => console.log("Menu clicked")}
			/>
			<div ref={topRef}>
				<div className="overflow-hidden p-0">
					<div className="mt-1.5 -mx-2.5 [&_img]:object-cover [&_img]:w-full [&_img]:max-h-[40vh]">
						{typeof postProps.cover == "string" && (
							<>
								<ImageBlock alt="Cover" src={postProps.cover} />
								<meta
									itemProp="thumbnailUrl"
									content={postProps.cover}
								/>
							</>
						)}
					</div>
					<div
						style={{
							paddingLeft: readerStyles.paddingLeft,
							paddingRight: readerStyles.paddingRight,
						}}
					>
						<article
							className="font-serif text-(--eink-ink)"
							itemScope
							itemType="http://schema.org/Article"
						>
							<h1
								className="text-3xl font-bold mb-4 mt-6 font-sans tracking-tight"
								itemProp="headline"
							>
								{postProps.title}
							</h1>
							<div className="text-(--eink-ink-muted) text-sm mb-4">
								<time
									itemProp="datePublished"
									dateTime={postProps.createAt}
								>
									{formatStandardDate(
										postProps.createAt,
										locale
									)}
								</time>
								{postProps.updateAt && (
									<>
										{" · "}
										<span>
											{locale === "zh"
												? "更新于"
												: "Updated at"}{" "}
										</span>
										<time
											itemProp="dateModified"
											dateTime={postProps.updateAt}
										>
											{formatRelativeDate(
												postProps.updateAt,
												locale
											)}
										</time>
									</>
								)}
							</div>

							<section
								itemProp="articleBody"
								style={{
									fontSize: readerStyles.fontSize,
									fontFamily: readerStyles.fontFamily,
									lineHeight: readerStyles.lineHeight,
								}}
							>
								{postContent}
							</section>
						</article>
					</div>
				</div>
			</div>
		</>
	);
}
