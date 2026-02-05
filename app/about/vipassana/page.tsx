import type { Metadata } from "next";
import SimplePageLayout from "../../components/simple-page-layout";

export const metadata: Metadata = {
	title: "ヴィパッサナー瞑想とは何か | 初期仏教塾",
	description:
		"ヴィパッサナー瞑想の意味と、ありのままに観る実践の要点を簡潔に整理します。",
};

export default function VipassanaPage() {
	return (
		<SimplePageLayout
			lead="ヴィパッサナー瞑想の意味と、ありのままに観る実践の要点を簡潔に整理します。"
			title="ヴィパッサナー瞑想とは何か"
		>
			<section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="text-base font-semibold text-amber-900">要点</h2>
				<ul className="mt-4 space-y-2 text-sm text-gray-700">
					<li>「ありのままに観る」ことで心の癖に気づく瞑想法。</li>
					<li>特別な信仰や儀式ではなく、日常で実践できる方法。</li>
					<li>テーラワーダ仏教で長く受け継がれてきた伝統的な修行。</li>
				</ul>
			</section>

			<section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="text-base font-semibold text-amber-900">解説</h2>
				<div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700">
					<p>
						ヴィパッサナーは、仏陀が示した悟りへの道の一つで、「今この瞬間を
						客観的に観る」ことを重視します。語の由来は「ありのまま」を意味する
						「vi」と、「観る」を意味する「passana」にあるとされています。
					</p>
					<p>
						目的は、不安や執着を生む心の反応に気づき、そこから自由になることです。
						日常の動作や感覚に意識を向け、価値判断を手放して観察することで、
						苦しみの根に気づいていきます。
					</p>
					<p>
						実践を始めるときは、期待や願望などの「余計な考え」を一度脇に置くことが
						大切だとされています。
					</p>
				</div>
			</section>

			<section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="text-base font-semibold text-amber-900">日常でのポイント</h2>
				<ul className="mt-4 space-y-2 text-sm text-gray-700">
					<li>動作や呼吸をいつもよりゆっくり観察してみる。</li>
					<li>起きていることを短い言葉で静かに確認する。</li>
					<li>感覚の変化を細やかに感じ取り続ける。</li>
				</ul>
			</section>
		</SimplePageLayout>
	);
}
