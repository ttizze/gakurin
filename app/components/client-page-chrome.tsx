"use client";

import dynamic from "next/dynamic";

const NextTopLoader = dynamic(() => import("nextjs-toploader"), {
	ssr: false,
});
const ScrollRestoration = dynamic(() => import("./scroll-restoration"), {
	ssr: false,
});

export default function ClientPageChrome() {
	return (
		<>
			<NextTopLoader
				color="#f59e0b"
				crawl={false}
				height={3}
				showSpinner={false}
			/>
			<ScrollRestoration />
		</>
	);
}
