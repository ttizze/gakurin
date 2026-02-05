import type { Metadata } from "next";
import ContentCard from "../../components/content-card";
import SectionHeading from "../../components/section-heading";
import SimplePageLayout from "../../components/simple-page-layout";

export const metadata: Metadata = {
	title: "スマナサーラ長老のプロフィール | 初期仏教塾",
	description:
		"スリランカ上座仏教長老・アルボムッレ・スマナサーラ長老の歩みと活動を紹介します。",
};

export default function SumanasaraProfilePage() {
	return (
		<SimplePageLayout
			lead="スリランカ上座仏教（テーラワーダ仏教）長老・アルボムッレ・スマナサーラ長老の歩みと活動を紹介します。"
			title="アルボムッレ・スマナサーラ長老"
		>
			<ContentCard>
				<SectionHeading>プロフィール</SectionHeading>
				<div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700">
					<p>
						アルボムッレ・スマナサーラ長老。スリランカ上座仏教（テーラワーダ仏教）長老。1945年4月、スリランカ生まれ。13歳で出家得度。国立ケラニヤ大学で仏教哲学の教鞭をとる。1980 年に来日。駒澤大学大学院博士課程を経て、現在は（宗）日本テーラワーダ仏教協会で初期仏教の伝道と冥想指導に従事し、ブッダの根本の教えを説き続けている。
					</p>
					<p>
						朝日カルチャーセンター（東京・横浜など）講師を務めるほか、NHK 教育テレビ「こころの時代」などにも出演。
					</p>
				</div>
			</ContentCard>

			<ContentCard>
				<SectionHeading>主な著書</SectionHeading>
				<ul className="mt-4 space-y-2 text-sm text-gray-700">
					<li>『ブッダの実践心理学　アビダンマ講義シリーズ』（サンガ）</li>
					<li>『怒らないこと』（大和書房）</li>
					<li>『原訳「法句経」一日一悟』（佼成出版）</li>
					<li>『ブッダ—大人になる道』（筑摩書房）</li>
					<li>『仏教は心の科学』（宝島社）</li>
					<li>『妬まない生き方』（河出書房新社）</li>
					<li>『Freedom from Anger』（英文,WISDOM PUBLICATIONS）</li>
				</ul>
			</ContentCard>
		</SimplePageLayout>
	);
}
