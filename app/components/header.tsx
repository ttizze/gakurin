"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
	{ href: "/about/early-buddhism", label: "初期仏教とは" },
	{ href: "/about/vipassana", label: "ヴィパッサナーとは" },
	{ href: "/about/sumanasara", label: "スマナサーラ長老について" },
];

export default function Header() {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="w-full">
			{/* ナビゲーションバー */}
			<div className="w-full px-6 py-5 sm:px-8">
				<div className="mx-auto flex max-w-7xl items-center justify-between">
					<Link className="shrink-0" href="/">
						<div className="sm:hidden">
							<Image
								alt="初期仏教塾"
								className="h-auto w-[min(140px,38vw)]"
								height={168}
								priority
								sizes="(max-width: 640px) 38vw, 300px"
								src="/logo_smp.png"
								width={429}
							/>
						</div>
						<div className="hidden sm:block">
							<Image
								alt="初期仏教塾"
								className="h-auto w-[220px]"
								height={206}
								priority
								sizes="220px"
								src="/logo_pc.png"
								width={536}
							/>
						</div>
					</Link>

					{/* PC: テキストリンク */}
					<nav
						aria-label="初期仏教塾の基本情報"
						className="hidden items-center gap-8 sm:flex"
					>
						{navLinks.map((link) => (
							<Link
								className="relative text-base font-medium text-gray-600 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-amber-500 after:transition-all hover:text-gray-900 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:ring-offset-2"
								href={link.href}
								key={link.href}
							>
								{link.label}
							</Link>
						))}
					</nav>

					{/* SP: ハンバーガーボタン */}
					<button
						aria-expanded={menuOpen}
						aria-label="メニューを開く"
						className="flex h-10 w-10 items-center justify-center rounded-md text-gray-600 transition-colors hover:text-gray-900 sm:hidden"
						onClick={() => setMenuOpen((prev) => !prev)}
						type="button"
					>
						<svg
							className="h-6 w-6"
							fill="none"
							stroke="currentColor"
							strokeWidth={1.5}
							viewBox="0 0 24 24"
						>
							{menuOpen ? (
								<path
									d="M6 18L18 6M6 6l12 12"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							) : (
								<path
									d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							)}
						</svg>
					</button>
				</div>

				{/* SP: ドロップダウンメニュー */}
				{menuOpen && (
					<nav
						aria-label="初期仏教塾の基本情報"
						className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:hidden"
					>
						{navLinks.map((link) => (
							<Link
								className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
								href={link.href}
								key={link.href}
								onClick={() => setMenuOpen(false)}
							>
								{link.label}
							</Link>
						))}
					</nav>
				)}
			</div>

			{/* ヒーロー */}
			<div className="w-full">
				<div className="relative w-full sm:hidden">
					<Image
						alt="初期仏教塾 音声アーカイブ"
						className="h-auto w-full object-contain"
						height={1395}
						priority
						sizes="100vw"
						src="/hero_smp.jpg"
						width={1170}
					/>
				</div>
				<div className="hidden w-full sm:block">
					<div className="relative aspect-[16/9] w-full overflow-hidden">
						<Image
							alt="初期仏教塾 音声アーカイブ"
							className="object-cover object-top"
							fill
							priority
							sizes="100vw"
							src="/hero_pc.jpg"
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
