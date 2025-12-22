import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
	display: "swap",
});

export const metadata: Metadata = {
	title: "初期仏教塾",
	description: "初期仏教の法話を静かに味わうアーカイブ",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ja">
			<body className={`${inter.variable} antialiased`}>
				<NextTopLoader
					color="#f59e0b"
					height={3}
					crawl={false}
					showSpinner={false}
				/>
				{children}
			</body>
		</html>
	);
}
