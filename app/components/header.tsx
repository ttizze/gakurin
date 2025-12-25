import Image from "next/image";

export default function Header() {
	return (
		<header className="w-full">
			{/* 1段目：ロゴ（中央）＋キャッチ（右） */}
			<div className="w-full flex-none px-6 pt-6 sm:px-8 sm:pt-8">
				<div className="flex items-center justify-between gap-2 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
					<div aria-hidden className="hidden sm:block" />

					<div className="shrink-0 sm:justify-self-center">
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

					<div className="shrink-0 sm:justify-self-end">
						<div className="sm:hidden">
							<Image
								alt="スマナサーラ長老の珠玉の法話で学ぶ"
								className="h-auto w-[min(150px,46vw)]"
								height={84}
								priority
								sizes="(max-width: 640px) 46vw, 320px"
								src="/catch_smp.png"
								width={306}
							/>
						</div>
						<div className="hidden sm:block">
							<Image
								alt="スマナサーラ長老の珠玉の法話で学ぶ"
								className="h-auto w-[320px]"
								height={30}
								priority
								sizes="320px"
								src="/catch_pc.png"
								width={522}
							/>
						</div>
					</div>
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
