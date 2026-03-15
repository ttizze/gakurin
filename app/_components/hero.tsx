const heroImageUrl =
	"https://gotami.j-theravada.com/wp-content/uploads/2024/05/cover01-smp.webp";

export default function Hero() {
	return (
		<section className="mt-4 w-full sm:mt-6">
			<div className="relative isolate min-h-[42svh] w-full overflow-hidden bg-zinc-900 sm:min-h-[52svh] lg:min-h-[58svh]">
				<div
					aria-hidden
					className="absolute inset-0 bg-cover bg-center bg-no-repeat xl:bg-contain xl:bg-center"
					style={{ backgroundImage: `url("${heroImageUrl}")` }}
				/>
				<div
					aria-hidden
					className="absolute inset-0 bg-linear-to-r from-zinc-950/72 via-zinc-950/36 to-zinc-950/66"
				/>
				<div className="relative mx-auto flex h-full max-w-7xl items-end justify-end px-6 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-44">
					<div className="ml-auto max-w-4xl text-right text-white drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)]">
						<h1
							className="text-3xl leading-tight font-semibold tracking-[0.02em] sm:text-5xl lg:text-6xl"
							style={{
								fontFamily: '"Hiragino Sans", "Noto Sans JP", sans-serif',
							}}
						>
							<span className="block">お釈迦さまの</span>
							<span className="block">真の教えを</span>
							<span className="block">現代のことばで</span>
						</h1>
						<p className="mt-4 text-sm leading-relaxed text-zinc-100 sm:text-base">
							日本で誤解されてきた仏教を
							<br />
							ヴィパッサナー瞑想と法話で実践的に学ぶ
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
