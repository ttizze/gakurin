"use client";

import dynamic from "next/dynamic";

const ScrollToTopButton = dynamic(() => import("./scroll-to-top-button"), {
	ssr: false,
});

export default function ClientHomeActions() {
	return <ScrollToTopButton />;
}
