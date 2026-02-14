"use client";

import { useEffect, useRef, useState, ReactNode, useMemo, useCallback } from "react";
import { useAtom } from "jotai";
import { readerSettingsAtom } from "@/system/atoms/readerSettings";
import { tocVisibleAtom } from "./atoms";
import AppToolbar from "@/system/components/AppToolbar";
import "katex/dist/katex.min.css";

interface TocHeading {
	id: string;
	text: string;
	level: number;
}

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

function formatTimeAgo(dateString: string, locale: string): string | null {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();
	const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

	if (diffInDays < 30) return null;

	const diffInMonths =
		(now.getFullYear() - date.getFullYear()) * 12 +
		(now.getMonth() - date.getMonth());
	const diffInYears = Math.floor(diffInMonths / 12);

	if (diffInYears >= 1) {
		return locale === "zh" ? `${diffInYears}年前` : `${diffInYears}y ago`;
	}
	return locale === "zh" ? `${diffInMonths}个月前` : `${diffInMonths}m ago`;
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
	const articleRef = useRef<HTMLElement>(null);
	const [settings] = useAtom(readerSettingsAtom);
	const [tocVisible, setTocVisible] = useAtom(tocVisibleAtom);
	const [headings, setHeadings] = useState<TocHeading[]>([]);

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
		setTocVisible(false);
	}, [id]);

	// Extract headings from the article DOM after render
	useEffect(() => {
		if (!articleRef.current) return;
		const els = articleRef.current.querySelectorAll("h1, h2, h3, h4");
		const extracted: TocHeading[] = Array.from(els).map((el, i) => {
			// Ensure the heading has an id for scrolling
			if (!el.id) {
				el.id = `heading-${i}`;
			}
			return {
				id: el.id,
				text: el.textContent || "",
				level: parseInt(el.tagName[1], 10),
			};
		});
		setHeadings(extracted);
	}, [postContent]);

	const handleTocItemClick = useCallback((headingId: string) => {
		const el = document.getElementById(headingId);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "start" });
			setTocVisible(false);
		}
	}, [setTocVisible]);

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
					<div className="w-full h-4"></div>
					<div
						style={{
							paddingLeft: readerStyles.paddingLeft,
							paddingRight: readerStyles.paddingRight,
						}}
					>
						<article
							ref={articleRef}
							className="font-serif text-(--eink-ink)"
							itemScope
							itemType="http://schema.org/Article"
						>
							<h1
								className="text-3xl font-bold mb-4 mt-6 font-sans tracking-wide"
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
									{formatTimeAgo(
										postProps.createAt,
										locale
									) &&
										` (${formatTimeAgo(
											postProps.createAt,
											locale
										)})`}
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
						<div className="h-32" />
					</div>
				</div>
			</div>

			{/* Table of Contents Panel */}
			{tocVisible && headings.length > 0 && (
				<>
					<div
						className="fixed inset-0 z-[200]"
						onClick={() => setTocVisible(false)}
					/>
					<div
						className="fixed bottom-0 left-0 right-0 z-[201] flex flex-col overflow-y-auto"
						style={{
							backgroundColor: "var(--eink-paper)",
							borderTop: "2px solid var(--eink-ink)",
							maxHeight: "60vh",
						}}
					>
						<div
							className="text-sm font-sans font-medium px-4 py-3 border-b"
							style={{
								color: "var(--eink-ink)",
								borderColor: "var(--eink-divider)",
							}}
						>
							{locale === "zh" ? "目录" : "Table of Contents"}
						</div>
						<nav className="py-2">
							{headings.map((heading) => (
								<button
									key={heading.id}
									onClick={() => handleTocItemClick(heading.id)}
									className="block w-full text-left px-4 py-2 text-sm font-sans hover:bg-(--eink-paper-warm) truncate"
									style={{
										color: "var(--eink-ink-secondary)",
										paddingLeft: `${(heading.level - 1) * 16 + 16}px`,
									}}
								>
									{heading.text}
								</button>
							))}
						</nav>
					</div>
				</>
			)}
		</>
	);
}
