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

export default function HomeValuePoints() {
	return (
		<section className="mx-auto mt-8 max-w-7xl px-6 sm:mt-10 sm:px-8">
			<div className="rounded-2xl border border-amber-100 bg-amber-50/70 p-6 sm:p-8">
				<h2 className="mt-2 text-2xl font-semibold tracking-tight text-amber-950 sm:text-3xl">
					初期仏教を、学びやすく、続けやすく
				</h2>
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
