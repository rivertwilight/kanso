"use client";

import Image from "next/image";

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
		<>
			<div className="w-full max-h-[50vh] relative mb-2 overflow-hidden">
				<Image
					src={src}
					alt={alt}
					width={0}
					height={0}
					sizes="100vw"
					style={{ width: "100%", height: "auto", maxHeight: "50vh" }}
					className="object-contain"
				/>
			</div>
			{alt && (
				<div className="text-center text-[#666] text-sm">{alt}</div>
			)}
		</>
	);
};

export default ImageBlock;
