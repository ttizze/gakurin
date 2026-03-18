import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { THERAVADA_ASSOCIATION_URL } from "../utils/site-links";

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
						<p className="text-xs font-semibold tracking-widest text-amber-700">
							法話者プロフィール
						</p>
						<h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
							アルボムッレ・スマナサーラ長老
						</h2>
						<blockquote className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
							<p className="text-sm font-medium text-amber-900 sm:text-base">
								長老によって､ついに日本にブッダ本来の教えが届いた｡「第二の仏教伝来」だ｡
							</p>
							<p className="mt-1 text-xs text-amber-800">仏教学者・藤本晃</p>
						</blockquote>
						<p className="mt-4 text-sm leading-relaxed text-gray-700 sm:text-base">
							日本テーラワーダ仏教協会貫主､スリランカ上座仏教の僧侶｡日本語で初期仏教の教えを分かりやすく説き、瞑想を通して自分で確かめる学びを広めてきました｡日本における仏教理解を、伝統解釈中心から「実践と検証」へと開く大きな役割を担っています｡
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
							<a
								className="inline-flex items-center gap-1 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/60 focus-visible:ring-offset-2"
								href={THERAVADA_ASSOCIATION_URL}
								rel="noopener noreferrer"
								target="_blank"
							>
								日本テーラワーダ仏教協会
								<ExternalLink className="h-3.5 w-3.5" />
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
