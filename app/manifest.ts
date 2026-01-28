import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "初期仏教塾",
		short_name: "初期仏教塾",
		description: "スマナサーラ長老の珠玉の法話で学ぶ。",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#f59e0b",
		icons: [
			{
				src: "/icon-192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icon-512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
