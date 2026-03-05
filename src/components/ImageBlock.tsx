interface ImageBlockProps {
	node: any;
	alt: string;
	src: string;
}

type NonArticleUsageProps = Pick<ImageBlockProps, "node">;

type ArticleUsageProps = Pick<ImageBlockProps, "src" | "alt">;

const ImageBlock = (props: ArticleUsageProps | NonArticleUsageProps) => {
	let src: string;
	let alt: string;

	// Type guard to check if 'node' is present in props
	if ("node" in props) {
		// Props are of type NonArticleUsageProps
		src = props.node?.properties?.src;
		alt = props.node?.properties?.alt;
	} else {
		// Props are of type ArticleUsageProps
		src = props.src;
		alt = props.alt;
	}

	return (
		<figure className="mb-4">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				src={src}
				alt={alt || ""}
				className="w-full max-h-[50vh] object-contain"
			/>
			{alt && (
				<figcaption className="text-center text-[#666] text-sm mt-2">
					{alt}
				</figcaption>
			)}
		</figure>
	);
};

export default ImageBlock;
