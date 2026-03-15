import Image from "next/image";
import Link from "next/link";

export default function Header() {
	return (
		<header className="w-full">
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
		</header>
	);
}
