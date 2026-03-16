import Image from "next/image";
import Link from "next/link";

export default function SumanasaraProfile() {
	return (
		<section className="mx-auto mt-8 max-w-7xl px-6 sm:mt-10 sm:px-8">
			<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
				<div className="grid gap-0 md:grid-cols-[320px_1fr]">
					<div className="relative min-h-[320px] bg-amber-100/40 md:min-h-full">
						<Image
							alt="アルボムッレ・スマナサーラ長老"
							className="object-cover object-top"
							fill
							sizes="(max-width: 768px) 100vw, 320px"
							src="/sumanasara.png"
						/>
					</div>
					<div className="p-6 sm:p-8">
						<p className="text-xs font-semibold tracking-[0.1em] text-amber-700">
							法話者プロフィール
						</p>
						<h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
							アルボムッレ・スマナサーラ長老
						</h2>
						<p className="mt-4 text-sm leading-relaxed text-gray-700 sm:text-base">
							スリランカ上座仏教の僧侶。日本語で初期仏教の教えを分かりやすく説き、瞑想を通して自分で確かめる学びを広めてきました。
						</p>
						<p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
							このサイトでは、長老の法話を通して「仏教は本来、体験可能な真理を語る教えである」という視点を現代のことばで学べます。
						</p>
						<div className="mt-6 flex flex-wrap gap-3">
							<Link
								className="inline-flex items-center rounded-full bg-amber-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 focus-visible:ring-offset-2"
								href="/talks"
							>
								法話を聴く
							</Link>
							<Link
								className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/60 focus-visible:ring-offset-2"
								href="/about/sumanasara"
							>
								長老について詳しく
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
