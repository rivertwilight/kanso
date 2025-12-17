import * as React from "react";
import Link from "next/link";
import { IPost } from "@/types/index";

interface SearchState {
	searchIsFocus: boolean;
	kwd: string | undefined;
	inputMarginLeft: number;
}

interface SearchProps {
	allPosts: any;
	locale: string;
}

const SearchResult = ({
	data,
	isHide,
	left,
	kwd,
	locale,
}: {
	kwd: string;
	isHide: boolean;
	left: number;
	data: any;
	locale: string;
}): React.ReactElement | null => {
	if (isHide || kwd === "") return null;
	return (
		<div
			style={{
				left: left - 10,
			}}
			className="hotwords"
		>
			<div className="hotwords-inner">
				<div className="hotwords-subtitle">搜索结果</div>
				{data
					.filter((post: IPost) =>
						post.defaultTitle
							.toLowerCase()
							.includes(kwd.toLowerCase())
					)
					.map((post: IPost) => (
						<Link href={"/blog/" + post.id} locale={locale}>
							<a className="hotwords-item">{post.defaultTitle}</a>
						</Link>
					))}
			</div>
		</div>
	);
};

export default class extends React.Component<SearchProps, SearchState> {
	searchField: any;
	constructor(props) {
		super(props);
		this.state = {
			searchIsFocus: false,
			kwd: "",
			inputMarginLeft: 580,
		};
	}
	adjustPos() {
		this.setState({
			inputMarginLeft:
				window.innerWidth > 640
					? this.searchField.getBoundingClientRect().left
					: "",
		});
	}
	componentDidUpdate() {
		document
			.getElementsByTagName("main")[0]
			.addEventListener("click", () => {
				this.setState({ searchIsFocus: false });
			});
	}
	componentDidMount() {
		this.adjustPos();
		window.onresize = () => {
			this.adjustPos();
		};
	}
	render() {
		const { kwd, searchIsFocus, inputMarginLeft } = this.state;
		const { allPosts, locale } = this.props;
		return (
			<>
				<div
					ref={(r) => (this.searchField = r)}
					className={`search ${searchIsFocus ? "search-focus" : ""}`}
				>
					<input
						onFocus={() => {
							this.setState({ searchIsFocus: true });
						}}
						type="search"
						value={kwd}
						onChange={({ target: { value } }) => {
							this.setState({ kwd: value });
						}}
					/>
					<button className="search-btn">
						<svg
							fill="#8590a6"
							viewBox="0 0 24 24"
							width="18"
							height="18"
						>
							<path
								d="M17.068 15.58a8.377 8.377 0 0 0 1.774-5.159 8.421 8.421 0 1 0-8.42 8.421 8.38 8.38 0 0 0 5.158-1.774l3.879 3.88c.957.573 2.131-.464 1.488-1.49l-3.879-3.878zm-6.647 1.157a6.323 6.323 0 0 1-6.316-6.316 6.323 6.323 0 0 1 6.316-6.316 6.323 6.323 0 0 1 6.316 6.316 6.323 6.323 0 0 1-6.316 6.316z"
								fillRule="evenodd"
							></path>
						</svg>
					</button>
				</div>
				<SearchResult
					locale={locale}
					left={inputMarginLeft}
					data={allPosts}
					kwd={kwd}
					isHide={!searchIsFocus}
				/>
			</>
		);
	}
}
