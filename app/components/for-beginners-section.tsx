"use client";

import { ChevronDown, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { THERAVADA_ASSOCIATION_URL } from "../lib/site-links";

const OPEN_FOR_BEGINNERS_EVENT = "openForBeginners";
const BEGINNER_GUIDE_PARAGRAPHS = [
	"「仏教」と聞くと「宗教でしょ？」と感じる方もいらっしゃるかもしれません。しかし、2500年以上前にお釈迦様が説かれた教えは、「自分で確かめる」「権威ある人から言われたことでも盲信しない」という、いわゆる宗教とはほど遠い、理性的で現代的な教えです。",
	"お釈迦様の教えの目的は「苦しみをなくす」こと。人間の苦しみの根本的な原因は今も昔も変わりません。そのため、この教えに触れた方は「なんと現代的な教えだろう」という感想を持たれます。",
	"一般的な宗教では「信じる者は救われる」という立場ですが、初期仏教では、あなた自身の「智慧」や「優しさ」をレベルアップさせて、苦しみを乗り越えることを目指します。ストレスだらけの現代社会を生きる私たちにとって、今日からでも実践できる教えがここにあります。",
	"この「初期仏教塾」では、そうした初期仏教の法話や講演を横断的に閲覧できます。それが本当かどうかは、ぜひ音声を聴いていただき、あなたご自身の心で確かめてみてください。",
];

export default function ForBeginnersSection() {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleOpen = () => {
			setIsOpen(true);
		};

		window.addEventListener(OPEN_FOR_BEGINNERS_EVENT, handleOpen);

		return () => {
			window.removeEventListener(OPEN_FOR_BEGINNERS_EVENT, handleOpen);
		};
	}, []);

	return (
		<section className="bg-amber-50">
			<div className="mx-auto max-w-7xl px-6 py-3 sm:px-8">
				<div className="flex flex-col items-center gap-4">
					<a
						className="inline-flex items-center gap-1 text-amber-900 hover:text-amber-700 underline transition text-xs whitespace-nowrap"
						href={THERAVADA_ASSOCIATION_URL}
						rel="noopener noreferrer"
						target="_blank"
					>
						日本テーラワーダ仏教協会
						<ExternalLink className="h-3 w-3" />
					</a>
					<button
						aria-expanded={isOpen}
						className="flex items-center justify-center gap-2 text-center transition cursor-pointer"
						data-for-beginners-toggle
						onClick={() => setIsOpen((prev) => !prev)}
						type="button"
					>
						<h2 className="text-amber-900">初めての方へ</h2>
						<div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-700">
							<ChevronDown
								className={`h-4 w-4 text-amber-50 transition-transform ${
									isOpen ? "rotate-180" : ""
								}`}
							/>
						</div>
					</button>
				</div>
			</div>
			{isOpen && (
				<div className="text-sm leading-relaxed py-10 text-amber-900 bg-amber-50 sm:text-base">
					<div className="mx-auto max-w-7xl px-12 sm:px-16">
							<div className="space-y-6">
								{BEGINNER_GUIDE_PARAGRAPHS.map((paragraph) => (
									<p key={paragraph}>{paragraph}</p>
								))}
							</div>
						</div>
				</div>
			)}
		</section>
	);
}
