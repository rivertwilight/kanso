import React, { useEffect } from "react";
import styled from "styled-components";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import {
	jsx,
	javascript,
	bash,
	sass,
	scss,
	typescript,
} from "react-syntax-highlighter/dist/cjs/languages/prism";

const StyledFigure = styled.figure`
	max-height: 90vh;
	overflow: auto;
	/* width: 100%;*/

	// Full width on mobile devices
	@media (max-width: 768px) {
		width: 100vw;
		position: relative;
		left: 50%;
		right: 50%;
		margin-left: -50vw;
		margin-right: -50vw;

		& pre {
			border-radius: 0 !important;
		}
	}
`;

const CodeBlock = ({ node, inline, children }) => {
	useEffect(() => {
		SyntaxHighlighter.registerLanguage("jsx", jsx);
		SyntaxHighlighter.registerLanguage("javascript", javascript);
		SyntaxHighlighter.registerLanguage("js", javascript);
		SyntaxHighlighter.registerLanguage("typescript", typescript);
		SyntaxHighlighter.registerLanguage("ts", typescript);
		SyntaxHighlighter.registerLanguage("bash", bash);
		SyntaxHighlighter.registerLanguage("sass", sass);
		SyntaxHighlighter.registerLanguage("scss", scss);
	}, []);

	// Extracting the language
	const className = node.properties?.className || [];
	const match = className.find((className) =>
		className.startsWith("language-")
	);
	const language = match ? match.replace("language-", "") : null;

	if (inline) {
		return <code>{children}</code>;
	}

	return (
		<StyledFigure>
			<SyntaxHighlighter language={language} style={atomDark}>
				{children}
			</SyntaxHighlighter>
		</StyledFigure>
	);
};

export default CodeBlock;
