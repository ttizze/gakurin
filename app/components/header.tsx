import Image from "next/image";
import Link from "next/link";

const navLinks = [
	{ href: "/about/early-buddhism", label: "初期仏教とは" },
	{ href: "/about/vipassana", label: "ヴィパッサナーとは" },
	{ href: "/about/sumanasara", label: "スマナサーラ長老について" },
];

export default function Header() {
	return (
		<header className="w-full">
			<div className="w-full px-6 py-5 sm:px-8">
				<div className="mx-auto flex max-w-7xl items-start justify-between">
					<Link className="shrink-0" href="/">
						<div className="sm:hidden">
							<Image
								alt="初期仏教塾"
								className="h-auto w-[min(140px,38vw)]"
								height={168}
								priority
								quality={72}
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
								quality={72}
								sizes="220px"
								src="/logo_pc.png"
								width={536}
							/>
						</div>
					</Link>

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

					<details className="group sm:hidden">
						<summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md text-gray-600 transition-colors hover:text-gray-900 [&::-webkit-details-marker]:hidden">
							<span className="sr-only">メニューを開く</span>
							<svg
								className="h-6 w-6 group-open:hidden"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.5}
								viewBox="0 0 24 24"
							>
								<path
									d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<svg
								className="hidden h-6 w-6 group-open:block"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.5}
								viewBox="0 0 24 24"
							>
								<path
									d="M6 18L18 6M6 6l12 12"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</summary>
						<nav
							aria-label="初期仏教塾の基本情報"
							className="absolute right-6 mt-2 flex min-w-56 flex-col gap-3 rounded-lg border border-gray-100 bg-white p-4 shadow-lg sm:hidden"
						>
							{navLinks.map((link) => (
								<Link
									className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
									href={link.href}
									key={link.href}
								>
									{link.label}
								</Link>
							))}
						</nav>
					</details>
				</div>
			</div>

			<div className="w-full">
				<div className="relative w-full sm:hidden">
					<Image
						alt="初期仏教塾 音声アーカイブ"
						className="h-auto w-full object-contain"
						height={1395}
						priority
						quality={68}
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
							quality={72}
							sizes="100vw"
							src="/hero_pc.jpg"
						/>
					</div>
				</div>
			</div>
		</header>
	);
}
