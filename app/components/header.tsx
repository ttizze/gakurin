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
			{/* 1段目：ロゴ（左）＋リンク（右） */}
			<div className="w-full flex-none px-6 pt-6 sm:px-8 sm:pt-8">
				<div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="shrink-0">
						<div className="sm:hidden">
							<Image
								alt="初期仏教塾"
								className="h-auto w-[min(160px,42vw)]"
								height={168}
								priority
								sizes="(max-width: 640px) 42vw, 360px"
								src="/logo_smp.png"
								width={429}
							/>
						</div>
						<div className="hidden sm:block">
							<Image
								alt="初期仏教塾"
								className="h-auto w-[260px]"
								height={206}
								priority
								sizes="260px"
								src="/logo_pc.png"
								width={536}
							/>
						</div>
					</div>

					<nav
						aria-label="初期仏教塾の基本情報"
						className="flex flex-wrap items-center gap-3 text-lg font-medium sm:text-xl lg:text-2xl"
					>
						{navLinks.map((link) => (
							<Link
								className="text-amber-900 transition hover:text-amber-700 hover:underline"
								href={link.href}
								key={link.href}
							>
								{link.label}
							</Link>
						))}
					</nav>
				</div>
			</div>

			{/* 2段目：hero */}
			<div className="mt-4 w-full sm:mt-6">
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
