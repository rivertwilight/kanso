import CodeBlock from "@/components/CodeBlock";
import ImageBlock from "@/components/ImageBlock";
import HeadingBlock from "@/components/HeadingBlock";
import FrameBlock from "@/components/FrameBlock";
import TableBlock from "@/components/TableBlock";

export const mdxComponents = {
	code: CodeBlock,
	img: ImageBlock,
	table: TableBlock,
	h1: (props: any) => <HeadingBlock level={1} {...props} />,
	h2: (props: any) => <HeadingBlock level={2} {...props} />,
	h3: (props: any) => <HeadingBlock level={3} {...props} />,
	h4: (props: any) => <HeadingBlock level={4} {...props} />,
	h5: (props: any) => <HeadingBlock level={5} {...props} />,
	h6: (props: any) => <HeadingBlock level={6} {...props} />,
	iframe: FrameBlock,
	p: (props: any) => <p className="mb-4" {...props} />,
	ul: (props: any) => (
		<ul className="list-disc pl-6 mb-4 space-y-1" {...props} />
	),
	ol: (props: any) => (
		<ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />
	),
	blockquote: (props: any) => (
		<blockquote
			className="border-l-4 border-(--eink-border) pl-4 py-2 my-4 bg-(--eink-paper-warm) italic text-(--eink-ink-secondary) [&>*:last-child]:mb-0!"
			{...props}
		/>
	),
	a: (props: any) => (
		<a
			className="underline underline-offset-2 decoration-(--eink-ink-tertiary) hover:decoration-(--eink-ink)"
			{...props}
		/>
	),
	hr: (props: any) => (
		<hr className="border-(--eink-divider) my-8" {...props} />
	),
};
