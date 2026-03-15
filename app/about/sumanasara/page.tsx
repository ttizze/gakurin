import type { Metadata } from "next";
import Image from "next/image";
import SimplePageLayout from "../../components/simple-page-layout";

export const metadata: Metadata = {
	title: "スマナサーラ長老のプロフィール",
	description:
		"スリランカ上座仏教長老・アルボムッレ・スマナサーラ長老の歩みと活動を紹介します。",
};

export default function SumanasaraProfilePage() {
	return (
		<SimplePageLayout title="アルボムッレ・スマナサーラ長老">
			<div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
				<div className="prose prose-sm max-w-none flex-1 prose-slate">
					<p>
						スリランカ上座仏教（テーラワーダ仏教）長老。1945年4月、スリランカ生まれ。13歳で出家得度。国立ケラニヤ大学で仏教哲学の教鞭をとる。1980年に来日。駒澤大学大学院博士課程を経て、現在は（宗）日本テーラワーダ仏教協会で初期仏教の伝道と冥想指導に従事し、ブッダの根本の教えを説き続けている。
					</p>
					<p>
						朝日カルチャーセンター（東京・横浜など）講師を務めるほか、NHK教育テレビ「こころの時代」などにも出演。
					</p>
				</div>
				<div className="shrink-0">
					<Image
						alt="アルボムッレ・スマナサーラ長老"
						className="rounded-lg"
						height={400}
						src="/sumanasara.png"
						width={240}
					/>
				</div>
			</div>

			<div className="prose prose-sm max-w-none prose-slate">
				<h2>主な著書</h2>
				<ul>
					<li>『ブッダの実践心理学　アビダンマ講義シリーズ』（サンガ）</li>
					<li>『怒らないこと』（大和書房）</li>
					<li>『原訳「法句経」一日一悟』（佼成出版）</li>
					<li>『ブッダ—大人になる道』（筑摩書房）</li>
					<li>『仏教は心の科学』（宝島社）</li>
					<li>『妬まない生き方』（河出書房新社）</li>
					<li>『Freedom from Anger』（英文, WISDOM PUBLICATIONS）</li>
				</ul>
			</div>
		</SimplePageLayout>
	);
}
