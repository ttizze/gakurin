import Image from "next/image";

type Props = {
	talkCount: number;
};

export default function Header({ talkCount }: Props) {
	return (
		<>
			<header className="relative w-full overflow-hidden">
				<div className="absolute inset-0">
					<Image
						alt=""
						className="object-cover object-center"
						fill
						priority
						src="/gakurin-header-base.jpg"
						unoptimized
					/>
				</div>
				<div className="relative mx-auto max-w-6xl px-6 py-12 sm:px-8 sm:py-16">
					<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
						<div className="max-w-2xl">
							<h1 className="text-4xl font-semibold leading-tight text-slate-800 sm:text-5xl">
								初期仏教塾
							</h1>
							<p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">
								— exposition of early buddhism in modern terms —
							</p>
							<p className="mt-3 text-sm leading-relaxed text-slate-700 sm:text-base">
								初期仏教の法話や講演を横断的に閲覧できる、静かな学びの場。場所やテーマ、記録された日時を頼りに、必要な教えを見つけてください。
							</p>
						</div>
						<div className="flex flex-col gap-1.5 rounded border border-slate-300/70 bg-slate-100/80 px-3 py-2 text-xs text-slate-600 backdrop-blur-sm sm:text-sm">
							<div>収録数:{String(talkCount).padStart(4, "0")}件</div>
							<div>更新頻度:約1時間</div>
						</div>
					</div>
				</div>
			</header>
			<div />
		</>
	);
}
