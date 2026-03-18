const VALUE_POINTS = [
	{
		title: "経典にもとづいて学べる",
		description:
			"ブッダの教えの核を、初期仏教の視点から丁寧に学べます。",
	},
	{
		title: "現代の言葉で理解できる",
		description:
			"難解な用語に偏らず、日々の悩みと結びつけて理解できます。",
	},
	{
		title: "必要な法話がすぐ見つかる",
		description:
			"豊富なアーカイブから、テーマ別に自分に合う法話を選べます。",
	},
];

const BEGINNER_GUIDE_PARAGRAPHS = [
	"本来の仏教は宗教でも哲学でもありません｡生きる苦しみの原因を追求し解決する､いわば実践的な心理学です｡",
	"お釈迦さまの教えの目的は「苦しみをなくす」こと｡人間の苦しみの根本的な原因は今も昔も変わりません｡",
	"一般的な宗教では「信じる者は救われる」という立場ですが、初期仏教では、あなた自身の心を成長させて、苦しみの根本原因を発見し､自ら解決することを目指します。",
	"この「初期仏教塾」では、そうした法話や講演を横断的に閲覧できます。ストレスだらけの現代社会を生きる私たちにとって、今日からでも実践できる教えがここにあります。",
	"本当かどうかは、ぜひ動画を見ていただき、あなた自身の心で確かめてみてください。",
];

export default function HomeValuePoints() {
	return (
		<section className="mx-auto mt-8 max-w-7xl px-6 sm:mt-10 sm:px-8">
			<div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-6 sm:p-8">
				<h2 className="mt-2 text-2xl font-semibold tracking-tight text-amber-950 sm:text-3xl">
					自ら確かめる心の科学
				</h2>
				<div className="mt-5 rounded-xl border border-amber-100 bg-white/90 p-5">
					<div className="space-y-4 text-sm leading-relaxed text-gray-700">
						{BEGINNER_GUIDE_PARAGRAPHS.map((paragraph) => (
							<p key={paragraph}>{paragraph}</p>
						))}
					</div>
				</div>
				<div className="mt-6 grid gap-4 md:grid-cols-3">
					{VALUE_POINTS.map((point) => (
						<article
							className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm"
							key={point.title}
						>
							<h3 className="text-sm font-semibold text-amber-900 sm:text-base">
								{point.title}
							</h3>
							<p className="mt-2 text-sm leading-relaxed text-gray-700">
								{point.description}
							</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
