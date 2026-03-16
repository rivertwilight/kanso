import { Tweet } from "react-tweet";

function getTweetId(url: string): string {
	const match = url.match(/status\/(\d+)/);
	return match ? match[1] : "";
}

export default function TweetEmbed({ url }: { url: string }) {
	return (
		<div className="my-4 not-prose max-w-lg mx-auto">
			<Tweet id={getTweetId(url)} />
		</div>
	);
}
