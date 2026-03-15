import Image from "next/image";
import Link from "next/link";

const heroImageUrl =
	"https://gotami.j-theravada.com/wp-content/uploads/2024/05/cover01-smp.webp";

export default function Header() {
	return (
		<header className="w-full">
			{/* 1段目：ロゴ（中央）＋リンク（右） */}
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
						<Link
							className="relative mb-1 inline-flex whitespace-nowrap text-sm font-medium text-gray-700 transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-amber-500 after:transition-all hover:text-gray-900 hover:after:w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 focus-visible:ring-offset-2 sm:mb-2 sm:text-base"
							href="/about"
						>
							このサイトについて
						</Link>
					</div>
				</div>
			</div>

			{/* 2段目：hero */}
			<div className="mt-4 w-full sm:mt-6">
				<div className="relative isolate min-h-[42svh] w-full overflow-hidden sm:min-h-[52svh] lg:min-h-[58svh]">
					<div
						aria-hidden
						className="absolute inset-0 bg-cover bg-center"
						style={{ backgroundImage: `url("${heroImageUrl}")` }}
					/>
					<div
						aria-hidden
						className="absolute inset-0 bg-gradient-to-r from-zinc-950/72 via-zinc-950/36 to-zinc-950/66"
					/>
					<div className="relative mx-auto flex h-full max-w-7xl items-end justify-end px-6 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-44">
						<div className="ml-auto max-w-4xl text-right text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)]">
							<h1
								className="text-3xl leading-tight font-semibold tracking-[0.02em] sm:text-5xl lg:text-6xl"
								style={{ fontFamily: '"Hiragino Sans", "Noto Sans JP", sans-serif' }}
							>
								<span className="block">お釈迦様の真の教えを</span>
								<span className="block">現代の言葉で</span>
							</h1>
							<p className="mt-4 text-sm leading-relaxed text-zinc-100 sm:text-base">
								日本で誤解されてきた仏教を
								<br />
								ヴィパッサナー瞑想と法話で実践的に学ぶ
							</p>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
