import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { THERAVADA_ASSOCIATION_URL } from "../utils/site-links";

export default function SumanasaraProfile() {
	return (
		<section className="mx-auto mt-8 max-w-7xl px-6 sm:mt-10 sm:px-8">
			<div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
				<div className="grid gap-0 md:grid-cols-[360px_1fr]">
					<div className="relative min-h-[360px] bg-amber-100/40 md:min-h-full">
						<Image
							alt="アルボムッレ・スマナサーラ長老"
							className="object-cover object-top"
							fill
							sizes="(max-width: 768px) 100vw, 360px"
							src="/sumanasara.png"
						/>
						<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent md:bg-gradient-to-r" />
					</div>
					<div className="p-6 sm:p-8 lg:p-10">
						<p className="text-xs font-semibold uppercase tracking-widest text-amber-700">
							講師紹介
						</p>
						<h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
							アルボムッレ・スマナサーラ長老
						</h2>

						<div className="mt-5 rounded-xl border border-amber-200/80 bg-amber-50/60 p-5 sm:p-6">
							<h3 className="font-serif text-xl font-bold italic tracking-tight text-amber-900 sm:text-2xl">
								第二の仏教伝来
							</h3>
							<p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
								仏教は1500年前に日本へ伝わりましたが、釈尊の直説とヴィパッサナー実践の体系は十分に共有されてきませんでした。
							</p>
							<p className="mt-3 text-sm leading-relaxed text-gray-700 sm:text-base">
								スマナサーラ長老は、パーリ経典にもとづく流暢な日本語の説法と瞑想指導を通じて「何をどう実践すれば苦しみを減らせるのか」という具体的な道筋を示されました。これが「第二の仏教伝来」と呼ばれるゆえんです。
							</p>
							<p className="mt-3 text-right text-sm text-gray-500">
								— 仏教学者・藤本晃
							</p>
						</div>

						<p className="mt-5 text-sm leading-relaxed text-gray-600 sm:text-base">
							1945年スリランカ生まれ。13歳で出家得度。国立ケラニヤ大学で仏教哲学を講義。1980年来日。現在は日本テーラワーダ仏教協会で伝道と瞑想指導に従事。
						</p>

						<div className="mt-8 flex flex-wrap gap-3">
							<Link
								className="inline-flex items-center rounded-full bg-amber-700 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-amber-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70 focus-visible:ring-offset-2"
								href="/talks"
							>
								法話を聴く
							</Link>
							<Link
								className="inline-flex items-center rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/60 focus-visible:ring-offset-2"
								href="/about/sumanasara"
							>
								長老について詳しく
							</Link>
							<a
								className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400/60 focus-visible:ring-offset-2"
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
