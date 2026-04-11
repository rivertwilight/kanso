"use client";

import React, { useState } from "react";

export function ComparisonOption({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
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

	const getCardStyle = (label: "A" | "B"): React.CSSProperties => {
		if (!revealed) return {};
		if (label === answer) {
			return {
				borderColor: "var(--eink-ink)",
				backgroundColor: "var(--eink-paper-warm)",
			};
		}
		return { opacity: 0.45 };
	};

	return (
		<div className="my-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{(["A", "B"] as const).map((label) => (
					<div
						key={label}
						className="border-2 p-4 text-left transition-all duration-200"
						style={{
							borderColor: "var(--eink-border)",
							...getCardStyle(label),
						}}
					>
						<div className="mb-3">
							<span
								className="font-semibold text-sm"
								style={{ color: "var(--eink-ink-secondary)" }}
							>
								{label}
							</span>
						</div>
						<div>{label === "A" ? optionA : optionB}</div>
					</div>
				))}
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
