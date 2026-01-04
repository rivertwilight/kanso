"use client";

import React, { useEffect } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import MermaidBlock from "./MermaidBlock";
import {
	jsx,
	javascript,
	bash,
	sass,
	scss,
	typescript,
	python,
	java,
	go,
	rust,
	cpp,
	c,
	css,
	json,
	yaml,
	markdown,
	sql,
	graphql,
	php,
	ruby,
	swift,
	kotlin,
} from "react-syntax-highlighter/dist/cjs/languages/prism";

interface CodeBlockProps {
	node?: any;
	inline?: boolean;
	className?: string;
	children?: React.ReactNode;
	[key: string]: any;
}

const CodeBlock = ({ node, inline, className, children, ...props }: CodeBlockProps) => {
	useEffect(() => {
		// Register all supported languages
		SyntaxHighlighter.registerLanguage("jsx", jsx);
		SyntaxHighlighter.registerLanguage("javascript", javascript);
		SyntaxHighlighter.registerLanguage("js", javascript);
		SyntaxHighlighter.registerLanguage("typescript", typescript);
		SyntaxHighlighter.registerLanguage("ts", typescript);
		SyntaxHighlighter.registerLanguage("bash", bash);
		SyntaxHighlighter.registerLanguage("sh", bash);
		SyntaxHighlighter.registerLanguage("shell", bash);
		SyntaxHighlighter.registerLanguage("sass", sass);
		SyntaxHighlighter.registerLanguage("scss", scss);
		SyntaxHighlighter.registerLanguage("python", python);
		SyntaxHighlighter.registerLanguage("py", python);
		SyntaxHighlighter.registerLanguage("java", java);
		SyntaxHighlighter.registerLanguage("go", go);
		SyntaxHighlighter.registerLanguage("rust", rust);
		SyntaxHighlighter.registerLanguage("rs", rust);
		SyntaxHighlighter.registerLanguage("cpp", cpp);
		SyntaxHighlighter.registerLanguage("c++", cpp);
		SyntaxHighlighter.registerLanguage("c", c);
		SyntaxHighlighter.registerLanguage("css", css);
		SyntaxHighlighter.registerLanguage("json", json);
		SyntaxHighlighter.registerLanguage("yaml", yaml);
		SyntaxHighlighter.registerLanguage("yml", yaml);
		SyntaxHighlighter.registerLanguage("markdown", markdown);
		SyntaxHighlighter.registerLanguage("md", markdown);
		SyntaxHighlighter.registerLanguage("sql", sql);
		SyntaxHighlighter.registerLanguage("graphql", graphql);
		SyntaxHighlighter.registerLanguage("gql", graphql);
		SyntaxHighlighter.registerLanguage("php", php);
		SyntaxHighlighter.registerLanguage("ruby", ruby);
		SyntaxHighlighter.registerLanguage("rb", ruby);
		SyntaxHighlighter.registerLanguage("swift", swift);
		SyntaxHighlighter.registerLanguage("kotlin", kotlin);
		SyntaxHighlighter.registerLanguage("kt", kotlin);
	}, []);

	// Extracting the language - support both MDX and react-markdown formats
	let language: string | null = null;
	
	// MDX format: className is passed directly as a prop
	if (typeof className === "string" && className.startsWith("language-")) {
		language = className.replace("language-", "");
	} 
	// React-markdown format: className is in node.properties
	else if (node?.properties?.className) {
		const nodeClassName = node.properties.className;
		const match = Array.isArray(nodeClassName) 
			? nodeClassName.find((cn: string) => cn.startsWith("language-"))
			: typeof nodeClassName === "string" && nodeClassName.startsWith("language-") 
				? nodeClassName 
				: null;
		language = match ? match.replace("language-", "") : null;
	}

	// Check if this is inline code
	const isInline = inline || (!language && typeof children === "string" && !children.includes("\n"));

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

	// Ensure children is a string for syntax highlighter
	const codeString = typeof children === "string"
		? children
		: Array.isArray(children)
			? children.join("")
			: String(children || "");

	// Check if this is a mermaid diagram
	if (language === "mermaid") {
		return <MermaidBlock>{codeString}</MermaidBlock>;
	}

	return (
		<div className="my-6 max-md:w-screen max-md:relative max-md:left-1/2 max-md:right-1/2 max-md:-ml-[50vw] max-md:-mr-[50vw]">
			<SyntaxHighlighter
				language={language || "text"}
				style={vscDarkPlus}
				showLineNumbers={true}
				wrapLongLines={true}
				customStyle={{
					margin: 0,
					borderRadius: '0.5rem',
					fontSize: '0.875rem',
					maxHeight: '90vh',
					padding: '1.25rem',
					boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
				}}
				codeTagProps={{
					style: {
						fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
						textShadow: 'none',
					}
				}}
			>
				{codeString.replace(/\n$/, "")}
			</SyntaxHighlighter>
		</div>
	);
};

export default CodeBlock;
