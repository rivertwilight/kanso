import React, { ReactNode } from "react";

interface HeadingBlockProps {
	level?: number;
	children?: ReactNode;
	id?: string;
	[key: string]: any;
}

const headingStyles: Record<number, string> = {
	1: "text-3xl font-bold mb-4 mt-6 font-sans tracking-tight",
	2: "text-2xl font-bold mb-3 mt-5 font-sans tracking-tight border-b border-(--eink-divider) pb-2",
	3: "text-xl font-semibold mb-2 mt-4 font-sans",
	4: "text-lg font-semibold mb-2 mt-3 font-sans",
	5: "text-base font-semibold mb-1 mt-2 font-sans",
	6: "text-sm font-semibold mb-1 mt-2 font-sans",
};

const HeadingBlock = ({ level = 1, children, ...props }: HeadingBlockProps) => {
	const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

	// Generate an ID from children text content for anchor links
	const generateId = (content: ReactNode): string => {
		if (typeof content === "string") return content;
		if (Array.isArray(content)) {
			return content.map(generateId).join("");
		}
		if (React.isValidElement<{ children?: ReactNode }>(content) && content.props?.children) {
			return generateId(content.props.children);
		}
		return "";
	};

	const headingId = props.id || generateId(children);

	return (
		<Tag className={headingStyles[level] || headingStyles[1]} id={headingId} {...props}>
			{children}
		</Tag>
	);
};

export default HeadingBlock;
