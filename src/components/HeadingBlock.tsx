import React, { PureComponent } from "react";

const elements = {
	h1: "h1",
	h2: "h2",
	h3: "h3",
	h4: "h4",
	h5: "h5",
	h6: "h6",
};

function Heading({ level = "h1", children, ...props }) {
	const Tag = elements[level] || elements.h1;
	return (
		<Tag className="typo-heading" {...props}>
			{children}
		</Tag>
	);
}

// TODO 监听阅读部分变化
export default class extends PureComponent<{ level: string }> {
	renderHtml = () => {
		const { level, children } = this.props;

		if (children) {
			const nodeValue = children[0].props.value;
			return (
				<Heading level={`h${level}`} id={nodeValue}>
					{/* <a href={`#${nodeValue}`}>
                        #
                    </a> */}
					{children}
				</Heading>
			);
		} else {
			return <>{children}</>;
		}
	};
	render() {
		return <>{this.renderHtml()}</>;
	}
}
