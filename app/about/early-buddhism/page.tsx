import type { Metadata } from "next";
import SimplePageLayout from "../../components/simple-page-layout";

export const metadata: Metadata = {
	title: "初期仏教とは何か | 初期仏教塾",
	description:
		"お釈迦様の教えの原点である初期仏教の特徴と、現代にも通じる実践の要点をまとめます。",
};

export default function EarlyBuddhismPage() {
	return (
		<SimplePageLayout
			lead="お釈迦様の教えの原点である初期仏教の特徴と、現代にも通じる実践の要点をまとめます。"
			title="初期仏教とは何か"
		>
			<section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="text-base font-semibold text-amber-900">要点</h2>
				<ul className="mt-4 space-y-2 text-sm text-gray-700">
					<li>信仰よりも、自分で確かめる姿勢を大切にする。</li>
					<li>目的は、苦しみの原因を理解し、和らげ、終わらせること。</li>
					<li>
						テーラワーダ仏教が初期仏教の伝統を今日まで伝えている。
					</li>
				</ul>
			</section>

			<section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
				<h2 className="text-base font-semibold text-amber-900">解説</h2>
				<div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700">
					<p>
						初期仏教は、お釈迦様が説いた教えのうち、パーリ語経典に残る
						もっとも古い層を指します。権威に従うのではなく、日々の体験を
						通して真偽を確かめる姿勢が重視されます。
					</p>
					<p>
						苦しみの原因は時代が変わっても大きく変わらないため、初期仏教の
						教えは現代にも通じます。儀礼よりも、智慧と優しさを育てる実践が
						中心に置かれています。
					</p>
					<p>
						テーラワーダ仏教は「長老の教え」という意味を持ち、僧団と在家が
						およそ2500年以上にわたりこの教えを伝承してきました。
					</p>
				</div>
			</section>
		</SimplePageLayout>
	);
}
