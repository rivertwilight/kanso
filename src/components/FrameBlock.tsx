// TODO FrameBlock for Notion

const IFrameBlock = () => {
	return (
		<iframe
			srcDoc="{{UNTRUSTED_HTML_HERE}}"
			sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
			csp="script-src 'none'"
		/>
	);
};

export default IFrameBlock
