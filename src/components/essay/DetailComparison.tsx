"use client";

import React, { useState } from "react";

export function ComparisonOption({ children }: { children: React.ReactNode }) {
	return <div className="h-full [&>*]:h-full">{children}</div>;
}

interface DetailComparisonProps {
	children: React.ReactNode;
	answer: "A" | "B";
	explanation: string;
}

export default function DetailComparison({
	children,
	answer,
	explanation,
}: DetailComparisonProps) {
	const [revealed, setRevealed] = useState(false);

	const options = React.Children.toArray(children);
	const optionA = options[0];
	const optionB = options[1];

	const getOptionStyle = (label: "A" | "B"): React.CSSProperties => {
		if (!revealed) return {};
		if (label === answer) {
			return { backgroundColor: "var(--eink-paper-warm)" };
		}
		return { opacity: 0.45 };
	};

	return (
		<div className="my-8">
			<div
				className="border-2 overflow-hidden flex flex-col md:flex-row"
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
					className="h-px md:h-auto md:w-px shrink-0"
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

			{!revealed ? (
				<div className="mt-4 flex justify-center">
					<button
						onClick={() => setRevealed(true)}
						className="text-sm cursor-pointer transition-colors duration-150"
						style={{
							padding: "8px 20px",
							border: "1.5px solid var(--eink-border)",
							background: "transparent",
							color: "var(--eink-ink-secondary)",
							fontFamily: "inherit",
						}}
					>
						Reveal answer
					</button>
				</div>
			) : (
				<div
					className="mt-4 p-4 border border-dashed text-sm"
					style={{
						borderColor: "var(--eink-border)",
						backgroundColor: "var(--eink-paper-warm)",
					}}
				>
					<p
						className="font-semibold mb-1"
						style={{ color: "var(--eink-ink)" }}
					>
						The better option is {answer}.
					</p>
					<p style={{ color: "var(--eink-ink-secondary)" }}>
						{explanation}
					</p>
				</div>
			)}
		</div>
	);
}
