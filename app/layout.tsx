import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import ScrollRestoration from "./components/scroll-restoration";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "初期仏教塾",
	description: "スマナサーラ長老の珠玉の法話で学ぶ。",
	icons: {
		icon: [{ url: "/jtba-mark.png", type: "image/png" }],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const gaId = process.env.NEXT_PUBLIC_GA_ID;
	return (
		<html lang="ja">
			<body className={`${inter.variable} antialiased`}>
				<NextTopLoader
					color="#f59e0b"
					crawl={false}
					height={3}
					showSpinner={false}
				/>
				<ScrollRestoration />
				{children}
				{gaId ? <GoogleAnalytics gaId={gaId} /> : null}
			</body>
		</html>
	);
}
