import * as React from "react";
import styled from "styled-components";

const Switch = styled.button`
	margin: 1rem 0 0;
	padding: 0;
	width: 3.33rem;
	height: 3.33rem;
	line-height: 1;
	color: #909090;
	background-color: #fff;
	border: 1px solid #f1f1f1;
	border-radius: 50%;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
	cursor: pointer;
	@media (min-width: 1024px) {
		display: none;
	}
	@media (max-width: 1024px) {
		position: fixed;
		bottom: 26px;
		right: 26px;
	}
`;

const Warpper = styled.div`
	.card {
		border-radius: 30px;
	}
	@media (max-width: 1024px) {
		.card {
			height: 100vh;
		}
		position: fixed;
		top: 56px;
		left: 0;
		right: 0;
		overflow-y: scroll;
		transition: all 0.3s;
		${(props: { collapse: boolean }) => props.collapse && "top: -100vh;"}
	}
`;

const List = styled.div`
	padding: 0 10px;
`;

const CataItem = styled.a`
	padding-left: ${(props: { level?: number }) =>
		props.level && `${12 * props.level}px`};
	padding-top: 5px;
	display: block;
	padding-bottom: 5px;
	cursor: pointer;
	width: 100%;
	font-weight: bold;
	&:hover {
		background: #f6f6f6;
		// color: #43b155;
	}
`;

export default ({
	catalog,
}: {
	catalog: {
		title: string;
		level: number;
	}[];
}) => {
	const [collapse, setCollapse] = React.useState(true);
	const Title = (props, index) => (
		<CataItem
			href={`#${props.title}`}
			key={props.title}
			level={props.level}
		>
			{props.title}
		</CataItem>
	);
	const handleClick = () => {
		setCollapse(!collapse);
	};
	return (
		<>
			{/* <Warpper collapse={collapse}>
				<Card icon={<ListOutline />} title="目录">
					<List>{catalog.map(Title)}</List>
				</Card>
			</Warpper>
			<Switch onClick={handleClick}>
				<ListOutline />
			</Switch> */}
		</>
	);
};
