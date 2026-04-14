"use client";

import React, { useState } from "react";

export function ComparisonOption({ children }: { children: React.ReactNode }) {
	return <div className="h-full [&>*]:h-full">{children}</div>;
}

interface DetailComparisonProps {
	children: React.ReactNode;
	answer: "A" | "B";
	explanation?: React.ReactNode;
	direction?: "horizontal" | "vertical";
}

export default function DetailComparison({
	children,
	answer,
	explanation,
	direction = "horizontal",
}: DetailComparisonProps) {
	const [revealed, setRevealed] = useState(false);

	const options = React.Children.toArray(children);
	const optionA = options[0];
	const optionB = options[1];

	const isVertical = direction === "vertical";

	const getOptionStyle = (label: "A" | "B"): React.CSSProperties => {
		if (!revealed) return {};
		if (label === answer) {
			return { backgroundColor: "var(--eink-paper-warm)" };
		}
		return { opacity: 0.45 };
	};

	return (
		<div className="mt-3 mb-8">
			<div
				className={`border-2 overflow-hidden flex ${
					isVertical
						? "flex-col"
						: "flex-col md:flex-row"
				}`}
				style={{ borderColor: "var(--eink-border)" }}
			>
				{/* Option A */}
				<div
					className="relative flex-1 transition-all duration-200"
					style={getOptionStyle("A")}
				>
					<span
						className="absolute top-2 right-2 font-semibold text-xs leading-none z-10"
						style={{ color: "var(--eink-ink-tertiary)" }}
					>
						A
					</span>
					<div className="h-full">{optionA}</div>
				</div>

				{/* Divider */}
				<div
					className={
						isVertical
							? "h-px shrink-0"
							: "h-px md:h-auto md:w-px shrink-0"
					}
					style={{ backgroundColor: "var(--eink-border)" }}
				/>

				{/* Option B */}
				<div
					className="relative flex-1 transition-all duration-200"
					style={getOptionStyle("B")}
				>
					<span
						className="absolute top-2 right-2 font-semibold text-xs leading-none z-10"
						style={{ color: "var(--eink-ink-tertiary)" }}
					>
						B
					</span>
					<div className="h-full">{optionB}</div>
				</div>
			</div>

			<details
				className="mt-4 border border-dashed"
				style={{
					borderColor: "var(--eink-border)",
					backgroundColor: "var(--eink-paper-warm)",
				}}
				onToggle={(e) =>
					setRevealed(
						(e.target as HTMLDetailsElement).open
					)
				}
			>
				<summary
					className="cursor-pointer select-none text-sm px-4 py-3 flex items-center justify-between"
					style={{ color: "var(--eink-ink-secondary)" }}
				>
					<span>Reveal answer</span>
					<svg
						width="14"
						height="14"
						viewBox="0 0 16 16"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="reveal-chevron"
						style={{ flexShrink: 0, transition: "transform 0.15s" }}
					>
						<path d="M6 4l4 4-4 4" />
					</svg>
				</summary>
				<div className="px-4 pb-4">
					<p
						className="font-semibold mb-3"
						style={{ color: "var(--eink-ink)" }}
					>
						The better option is {answer}.
					</p>
					{explanation && (
						<div
							className="[&>p]:mb-3 [&>p:last-child]:mb-0 [&>ul]:mb-3 [&>ol]:mb-3 [&>a]:underline"
							style={{ color: "var(--eink-ink)" }}
						>
							{explanation}
						</div>
					)}
				</div>
			</details>
		</div>
	);
}
