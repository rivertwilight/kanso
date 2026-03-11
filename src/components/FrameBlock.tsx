const FrameBlock = (props: React.IframeHTMLAttributes<HTMLIFrameElement>) => {
	return (
		<div className="flex justify-center my-6">
			<iframe
				className="w-full max-w-3xl aspect-video"
				allowFullScreen
				{...props}
			/>
		</div>
	);
};

export default FrameBlock;
