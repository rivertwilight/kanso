"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidBlockProps {
	children: string;
}

const MermaidBlock: React.FC<MermaidBlockProps> = ({ children }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [svg, setSvg] = useState<string>("");
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		// Initialize mermaid
		mermaid.initialize({
			startOnLoad: false,
			theme: "default",
			securityLevel: "loose",
			fontFamily: "ui-sans-serif, system-ui, sans-serif",
		});

		// Render the diagram
		const renderDiagram = async () => {
			try {
				const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
				const { svg } = await mermaid.render(id, children.trim());
				setSvg(svg);
				setError(null);
			} catch (err) {
				console.error("Mermaid rendering error:", err);
				setError(err instanceof Error ? err.message : "Failed to render diagram");
			}
		};

		renderDiagram();
	}, [children]);

	if (error) {
		return (
			<div className="my-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
				<p className="text-red-800 dark:text-red-200 font-semibold mb-2">
					Mermaid Rendering Error
				</p>
				<pre className="text-sm text-red-700 dark:text-red-300 overflow-x-auto">
					{error}
				</pre>
			</div>
		);
	}

	return (
		<div
			ref={containerRef}
			className="my-6 flex justify-center items-center p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto"
			dangerouslySetInnerHTML={{ __html: svg }}
		/>
	);
};

export default MermaidBlock;
