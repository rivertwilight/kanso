import { ExternalLink } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import ImageBlock from "@/components/ImageBlock";
import HeadingBlock from "@/components/HeadingBlock";
import FrameBlock from "@/components/FrameBlock";
import TableBlock from "@/components/TableBlock";
import TweetEmbed from "@/components/TweetEmbed";
import DetailComparison, { ComparisonOption } from "@/components/essay/DetailComparison";
import {
	DetailDemoStyles,
	ButtonLoadingA, ButtonLoadingB,
	InputLabelA, InputLabelB,
	IconAlignA, IconAlignB,
	TruncationA, TruncationB,
	EmptyStateA, EmptyStateB,
	DisabledButtonA, DisabledButtonB,
} from "@/components/essay/DetailDemos";

export const mdxComponents: Record<string, any> = {
	code: CodeBlock,
	TweetEmbed,
	DetailComparison,
	ComparisonOption,
	DetailDemoStyles,
	ButtonLoadingA, ButtonLoadingB,
	InputLabelA, InputLabelB,
	IconAlignA, IconAlignB,
	TruncationA, TruncationB,
	EmptyStateA, EmptyStateB,
	DisabledButtonA, DisabledButtonB,
	img: ImageBlock,
	table: TableBlock,
	h1: (props: any) => <HeadingBlock level={1} {...props} />,
	h2: (props: any) => <HeadingBlock level={2} {...props} />,
	h3: (props: any) => <HeadingBlock level={3} {...props} />,
	h4: (props: any) => <HeadingBlock level={4} {...props} />,
	h5: (props: any) => <HeadingBlock level={5} {...props} />,
	h6: (props: any) => <HeadingBlock level={6} {...props} />,
	iframe: FrameBlock,
	p: ({ children, ...props }: any) => {
		// If the paragraph contains only an image/figure, unwrap it to avoid
		// invalid <figure> inside <p> nesting (causes hydration errors).
		const childArray = Array.isArray(children) ? children : [children];
		const nonEmpty = childArray.filter(
			(c: any) => c !== "\n" && c !== "" && c != null
		);
		if (
			nonEmpty.length === 1 &&
			typeof nonEmpty[0] === "object" &&
			nonEmpty[0]?.type === ImageBlock
		) {
			return <>{children}</>;
		}
		return <p className="mb-4" {...props}>{children}</p>;
	},
	ul: (props: any) => (
		<ul className="list-disc pl-6 mb-4 space-y-1" {...props} />
	),
	ol: (props: any) => (
		<ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />
	),
	blockquote: (props: any) => (
		<blockquote
			className="border-l-4 border-(--eink-border) pl-4 py-2 my-4 bg-(--eink-paper-warm) text-(--eink-ink-secondary) [&>*:last-child]:mb-0!"
			{...props}
		/>
	),
	a: ({ children, href, ...props }: any) => {
		const isExternal =
			href && (href.startsWith("http://") || href.startsWith("https://"));
		return (
			<a
				className="underline underline-offset-2 decoration-(--eink-ink-tertiary) hover:decoration-(--eink-ink)"
				href={href}
				{...(isExternal
					? { target: "_blank", rel: "noopener noreferrer" }
					: {})}
				{...props}
			>
				{children}
				{isExternal && (
					<ExternalLink
						className="inline ml-0.5"
						style={{ width: "0.75em", height: "0.75em" }}
					/>
				)}
			</a>
		);
	},
	hr: (props: any) => (
		<hr className="border-(--eink-divider) my-8" {...props} />
	),
	th: (props: any) => (
		<th
			className="border border-(--eink-border) px-3 py-2 bg-(--eink-paper-warm) text-left font-semibold whitespace-nowrap"
			{...props}
		/>
	),
	td: (props: any) => (
		<td
			className="border border-(--eink-border) px-3 py-2 whitespace-nowrap"
			{...props}
		/>
	),
};
