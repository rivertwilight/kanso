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
		const lang = language
			? LANG_ALIASES[language] || language
			: "text";

		getHighlighter().then((highlighter) => {
			if (cancelled) return;

			// Check if the language is loaded, fall back to "text"
			const loadedLangs = highlighter.getLoadedLanguages();
			const resolvedLang = loadedLangs.includes(lang) ? lang : "text";

			const html = highlighter.codeToHtml(trimmedCode, {
				lang: resolvedLang,
				theme: "css-variables",
			});
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
