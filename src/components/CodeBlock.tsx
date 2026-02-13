"use client";

import React, { useEffect, useState } from "react";
import MermaidBlock from "./MermaidBlock";

let highlighterPromise: Promise<any> | null = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = import("shiki").then(
			({ createHighlighter, createCssVariablesTheme }) => {
				const cssVarsTheme = createCssVariablesTheme({
					name: "css-variables",
					variablePrefix: "--shiki-",
					variableDefaults: {},
					fontStyle: true,
				});
				return createHighlighter({
					themes: [cssVarsTheme],
					langs: [
						"javascript",
						"typescript",
						"jsx",
						"tsx",
						"bash",
						"python",
						"java",
						"go",
						"rust",
						"cpp",
						"c",
						"css",
						"scss",
						"sass",
						"json",
						"yaml",
						"markdown",
						"sql",
						"graphql",
						"php",
						"ruby",
						"swift",
						"kotlin",
						"html",
					],
				});
			}
		);
	}
	return highlighterPromise;
}

// Map common aliases to canonical language names
const LANG_ALIASES: Record<string, string> = {
	js: "javascript",
	ts: "typescript",
	py: "python",
	rb: "ruby",
	rs: "rust",
	"c++": "cpp",
	sh: "bash",
	shell: "bash",
	yml: "yaml",
	md: "markdown",
	gql: "graphql",
	kt: "kotlin",
};

// Parse diff markers from code lines and return stripped code + marker map
function parseDiffMarkers(code: string): {
	strippedCode: string;
	markers: ("add" | "remove" | "context")[];
} {
	const lines = code.split("\n");
	const markers: ("add" | "remove" | "context")[] = [];
	const strippedLines = lines.map((line) => {
		if (line.startsWith("+")) {
			markers.push("add");
			return line.slice(1);
		}
		if (line.startsWith("-")) {
			markers.push("remove");
			return line.slice(1);
		}
		// Context line (leading space or empty)
		markers.push("context");
		return line.startsWith(" ") ? line.slice(1) : line;
	});
	return { strippedCode: strippedLines.join("\n"), markers };
}

// Apply diff line classes to Shiki HTML output using pre-computed markers
function applyDiffClasses(
	html: string,
	markers: ("add" | "remove" | "context")[]
): string {
	let lineIndex = 0;
	return html.replace(/<span class="line">/g, () => {
		const marker = markers[lineIndex++];
		if (marker === "add") return `<span class="line diff-add">`;
		if (marker === "remove") return `<span class="line diff-remove">`;
		return `<span class="line">`;
	});
}

interface CodeBlockProps {
	node?: any;
	inline?: boolean;
	className?: string;
	children?: React.ReactNode;
	[key: string]: any;
}

const CodeBlock = ({
	node,
	inline,
	className,
	children,
	...props
}: CodeBlockProps) => {
	const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null);

	// Extract language from className or node properties
	let language: string | null = null;

	if (typeof className === "string" && className.startsWith("language-")) {
		language = className.replace("language-", "");
	} else if (node?.properties?.className) {
		const nodeClassName = node.properties.className;
		const match = Array.isArray(nodeClassName)
			? nodeClassName.find((cn: string) => cn.startsWith("language-"))
			: typeof nodeClassName === "string" &&
				  nodeClassName.startsWith("language-")
				? nodeClassName
				: null;
		language = match ? match.replace("language-", "") : null;
	}

	// Check if this is inline code
	const isInline =
		inline ||
		(!language &&
			typeof children === "string" &&
			!children.includes("\n"));

	// Build code string
	const codeString =
		typeof children === "string"
			? children
			: Array.isArray(children)
				? children.join("")
				: String(children || "");

	const trimmedCode = codeString.replace(/\n$/, "");

	useEffect(() => {
		if (isInline) return;
		if (language === "mermaid") return;

		let cancelled = false;

		// Detect diff-{lang} pattern (e.g. diff-javascript, diff-tsx)
		const isDiff = language?.startsWith("diff-") ?? false;
		const baseLang = isDiff ? language!.slice(5) : language;
		const lang = baseLang
			? LANG_ALIASES[baseLang] || baseLang
			: "text";

		getHighlighter().then((highlighter) => {
			if (cancelled) return;

			const loadedLangs = highlighter.getLoadedLanguages();
			const resolvedLang = loadedLangs.includes(lang) ? lang : "text";

			let codeToHighlight = trimmedCode;
			let markers: ("add" | "remove" | "context")[] | null = null;

			if (isDiff) {
				const parsed = parseDiffMarkers(trimmedCode);
				codeToHighlight = parsed.strippedCode;
				markers = parsed.markers;
			}

			let html = highlighter.codeToHtml(codeToHighlight, {
				lang: resolvedLang,
				theme: "css-variables",
			});

			if (markers) {
				html = applyDiffClasses(html, markers);
			}

			setHighlightedHtml(html);
		});

		return () => {
			cancelled = true;
		};
	}, [trimmedCode, language, isInline]);

	if (isInline) {
		return (
			<code
				className="px-1.5 py-0.5 mx-0.5 text-sm bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 rounded font-mono border border-gray-200 dark:border-gray-700"
				{...props}
			>
				{children}
			</code>
		);
	}

	if (language === "mermaid") {
		return <MermaidBlock>{codeString}</MermaidBlock>;
	}

	if (highlightedHtml) {
		return <div className="mt-1 mb-6" dangerouslySetInnerHTML={{ __html: highlightedHtml }} />;
	}

	return (
		<div className="mt-1 mb-6">
			<pre className="shiki-fallback">
				<code>{trimmedCode}</code>
			</pre>
		</div>
	);
};

export default CodeBlock;
